'use server';

import { ID } from "node-appwrite";
import { createSessionClient,createAdminClient  } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
    APPWRITE_DATABASE_ID : DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: USER_BANK_ID,
} = process.env;

export const signIn = async ({email, password}:signInProps) => {
    try {
        
        const {account} = await createAdminClient();

        // INSTEAD OF CREATING AN ACCOUNT WE ARE ONLY CREATING THE SESSION OF USER IN SIGN IN 
        const response = await account.createEmailPasswordSession(email, password);

        return parseStringify(response);

    } catch (error) {
        console.log("Error",error);
    }
}

export const signUp = async (userData: SignUpParams) => {

    // WE ARE DESTRUCTURING OUR PARAMETER OBJECT TO GET THE PARAMETERS WE NEED INSTEAD OF ALL PARAMETERS
    const {email,password,firstName,lastName} = userData;

    let newUserAccount;

    try {
        // CALLING THE APPWRITE FUNCTION TO CREATE AND RETURN AN ADMIN ACCOUNT API
        const { account, database } = await createAdminClient();

        // USING THE ADMIN ACCOUNT API TO CREATE A NEW USER ACCOUNT WITH 4 PARAMETERS WHICH ARE ID(UNIQUE FOR EACH USER), EMAIL, PASSWORD AND NAME(CONCATINATED HERE AS FIRSTNAME AND LASTNAME).
        newUserAccount = await account.create(
            ID.unique(),
            email, 
            password, 
            `${firstName} ${lastName}`
        );

        if(!newUserAccount) throw new Error('Error creating user');

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
        })

        if(!dwollaCustomerUrl) throw new Error("Errror creating dwolla customer");

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        )

        // AFTER THE USER IS CREATED WE HAVE TO CREATE SESSION FOR THE USER SO WE NOW WHCIH USER IS LOGGEDIN, WE CAN DO THIS USING APPWRITE FUCNTION CALLED createEmailPasswordSession(email,password) AND FINALLY WE ARE STORING THR SESSION IN CONSTANT VARIABLE
        const session = await account.createEmailPasswordSession(email, password);

        // SETTING THE CURRENT SESSION TO COOKIES OF APPLICATION THE cookies.set takes following parameters:
        // 1. session name defined in server actions in appwrite while creating the session in appwrite function called createSessionClient
        // 2. THE SECRET KEY FOR EACH SESSION WE CAN ACCESS IN THE VARIABLE WE GET FROM ABOVE
        // 3. IS THE CONFIGURATION OBJECT WHICH DEFINES THE BASIC PARAMETERS FOR SETTING THE COOKIE
        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        // THE APPWRITE API RETURN THE USER OBJECT BUT WE CANNOT TRANSFER THE WHOLE OBJECT FROM SERVE TO CLIENT IN NEXTJS SO WE NEED TO STRINGIFY THE OBJECT
        return parseStringify(newUserAccount);

    } catch (error) {
        console.log("Error",error);
    }
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      
      // NOW AGAIN THE FUCNTION BELOW RETURNS A WHOLE OBJECT AND WHEN WE TRANSFER IT TO CLIENT SIDE WE GET NULL HENCE WE ALSO HAS TO STRINGIFY IT HERE
    //   return await account.get();

        const user = await account.get();

        return parseStringify(user);
    } catch (error) {
      return null;
    }
  }
  
export const logoutAccount = async () => {
    try {
        
        const {account} = await createSessionClient();

        cookies().delete('appwrite-session');

        await account.deleteSession('current');

    } catch (error) {
        console.log('Error in logout', error);
    }
}

export const createLinkToken = async (user:User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: user.name,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);

        return parseStringify({
            linkToken: response.data.link_token
        })

    } catch (error) {
        
    } 
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId
}: createBankAccountProps) => {
    try {

        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            USER_BANK_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId
            }
        )

        return parseStringify(bankAccount);
        
    } catch (error) {
        
    }
}


/* 

exchangePublicToken IS A FUCNTION THAT USES HANDSHAKE WITH PLAID TO PRODUCUE AN ACCESS TOKEN AND GENERATE A TOKEN FOR PAYMENT PROCESSOR

HERE'S HOW WE DO IT:

GET A PUBLIC TOKEN FROM createLinkToken function AND PASS IT TO exchangePublicToken FUNCTION ALONG WITH THE user

(1). GET AN ACCESS TOKEN FROM PLAID USING itemPublicTokenExchange FUNTION IN plaidClient WHICH WE CREATED IN [lib]/plaid.ts THE plaidClient IS AN INTERFACE THAT CONNECTS OUR APP TO PLAID.

THE itemPublicTokenExchange FUNCTION TAKES THE PUBLIC TOKEN AS PARAMETER AND THEN RETURN AN ACCESS TOKEN AND ID.

(2). NOW WE HAVE THE ACCESS TOKEN SO WE CAN GET THE PLAID ACCOUNT DETAILS FOR OUR USER USING accountsGet from plaidClient.

(3). AFTER WE HAVE THE ACCOUNT INFORMATION AND ACCESS TOKEN WE CAN ACTUALLY CREATE PAYMENT PROCESSOR TOKEN. 

IN THIS CASE WE WILL BE USING DWOLLA WHICH IS PAYMENT PROCESSING GATEWAY.

*/
export const exchangePublicToken = async({
    publicToken,
    user,
}: exchangePublicTokenProps) => {
    try {

        // (1).
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;

        const itemId = response.data.item_id;

        // (2).
        const accountResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountResponse.data.accounts[0];

        // (3). 

        // GENERATE A REQUEST 
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
        }

        // PASS REQUEST TO PLAID TO GET  PROCESSOR TOKEN

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);

        // GET THE PROCESSOR TOKEN FROM RESPONSE

        const processorToken = processorTokenResponse.data.processor_token;

        // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        // If the funding source URL is not created, throw an error
        if (!fundingSourceUrl) throw Error;

        // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
        await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        shareableId: encryptId(accountData.account_id),
        });

        // Revalidate the path to reflect the changes
        revalidatePath("/");

        // Return a success message
        return parseStringify({
        publicTokenExchange: "complete",
        });
            
    } catch (error) {
        console.log('Error in exchnage public token', error);
    }
}