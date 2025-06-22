import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
    return (
        <div className='h-screen flex items-center justify-center'>
            <SignIn />
        </div>
    )
}
export default page
