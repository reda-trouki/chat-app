import Image from 'next/image';
import React from 'react'

type Props = {
    size : number;
}

const LoadingLogo = ({size}: Props) => {
  return (
    <div className='w-full h-full flex items-center justify-center' >
        <Image src={'/logo.svg'} alt="logo" width={size} height={size} className='animate-pulse duration-700' />
    </div>
  )
}

export default LoadingLogo