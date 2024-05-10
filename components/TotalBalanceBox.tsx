
/* we use a react built-in library component called countup to add a beautiful number animations but the countup component uses useRef hook which is a client side property. so we have to define our component as useRef. To do this we can:

-> Either turn whole TotalBalanceBox to client side component which effects the performance

-> or we can create a new client side component and then call the countup function inside it

*/

import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';

const TotalBalanceBox = (
  {
    accounts= [],
    totalBanks,
    totalCurrentBalance
  }:
  TotalBalanceBoxProps
) => {
  return (
    <section className='total-balance'>
      <div className='total-balance-chart'>
        {/* 
        to create a chart we use react library called react-chartjs-2 the documentation link is: https://www.npmjs.com/package/react-chartjs-2  
        
        Now we can use the Doughnut component directly from the library but since its a client side component we will create a new component for it.
        */}
        <DoughnutChart accounts={accounts}/>
      </div>

      <div className='flex flex-col gap-6'>
        <h2 className='header-2'>
          Bank Accounts: {totalBanks}
        </h2>
        <div className='flex flex-col gap-2'>
          <p className='total-balance-label'>
            Total Current Balance
          </p>
          <div className='total-balance-amount flex-center gap-2'>
            {/* the formatAmount is a utility function defined in [lib]/utils.ts which converts normal number into a currency format */}
            {/* {formatAmount(totalCurrentBalance)}   */}
            {/* Since we are using countup in AnimatedCounter Component we donot need to format our amount as it does it automatically for us */}
            <AnimatedCounter
              amount={totalCurrentBalance}
            />
          </div> 
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox;