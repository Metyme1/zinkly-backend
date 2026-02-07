import React from 'react';

const Title = ({children , className}) => {
    return <p className={`text-2xl text-[#2461CB] font-[500] p-4 pb-2 ${className}`} > {children}</p>
};

export default Title;