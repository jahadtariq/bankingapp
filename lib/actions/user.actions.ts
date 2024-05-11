'use server';

import { ID } from "node-appwrite";
import { createSessionClient,createAdminClient  } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

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

    try {
        // CALLING THE APPWRITE FUNCTION TO CREATE AND RETURN AN ADMIN ACCOUNT API
        const { account } = await createAdminClient();

        // USING THE ADMIN ACCOUNT API TO CREATE A NEW USER ACCOUNT WITH 4 PARAMETERS WHICH ARE ID(UNIQUE FOR EACH USER), EMAIL, PASSWORD AND NAME(CONCATINATED HERE AS FIRSTNAME AND LASTNAME).
        const newUserAccount = await account.create(
            ID.unique(),
            email, 
            password, 
            `${firstName} ${lastName}`
        );

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
  