import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Home = async ({ searchParams: { id , page } }: SearchParamProps) => {

  // User to be fetched
  const loggedIn = await getLoggedInUser();

  //FETCHING ACCOUNTS
  const accounts = await getAccounts({
    userId: loggedIn.$id
  });

  if(!accounts) return;

  const accounstData = accounts?.data[0];

  const appwriteItemId = (id as string) || accounstData[0]?.appwriteItemId;

  const account = await getAccount({appwriteItemId});

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={[accounstData]}
            totalBanks={accounstData?.totalBanks}
            totalCurrentBalance={accounstData?.totalCurrentBalance}
          />
          
        </header>

        RECENT TRANSACTIONS
      </div>

      {/* Now we add the right sidebar in our homepage since this sidebar is not avialable in anyother page except home that's why we will not include it in the layout */}

      <RightSidebar
        user={loggedIn}
        transactions={accounts?.transactions}
        banks={accounstData?.slice(0,2)}
      />

    </section>
  )
}

export default Home;