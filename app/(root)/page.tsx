import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Home = () => {

  // User to be fetched
  const loggedIn = {
    firstName: 'Jahad',
    lastName: 'Tariq',
    email: 'muhammadjahadt@gmail.com'
  };

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
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
          
        </header>

        RECENT TRANSACTIONS
      </div>

      {/* Now we add the right sidebar in our homepage since this sidebar is not avialable in anyother page except home that's why we will not include it in the layout */}

      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{currentBalance: 1234.50},{currentBalance: 5634.80}]}
      />

    </section>
  )
}

export default Home;