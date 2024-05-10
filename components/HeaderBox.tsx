import React from 'react'


// How to declare props: 

// the props are declared in [types]/index.d.ts file in project root directory

// general syntax : 

// propsType comes from above file 
// props are the ones we need to use if they are assigned a value here those are the default values
// const ComponentName = ({props}:propsType) => {component Body}


const HeaderBox = (
    {
        type = "title",
        title,
        subtext,
        user
    }:
    HeaderBoxProps
) => {
  return (
    <div className='header-box'>
        <h1 className='header-box-title'>
            {title}
            {type === 'greeting' && (
                <span className='text-bankGradient'>
                    &nbsp;{user}
                </span>
            )}
        </h1>
        <p className='header-box-subtext'>{subtext}</p>
    </div>
  )
}

export default HeaderBox;