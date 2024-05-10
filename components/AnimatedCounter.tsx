"use client";

import CountUp from "react-countup";

const AnimatedCounter = (
  /* {propname} : {propname: propType} */
  {amount} : {amount: number}
) => {
  return (
    <div className="w-full">
      <CountUp
        decimals={2}
        decimal="."
        prefix="$"
        end={amount}
      />
    </div>
  )
}

export default AnimatedCounter