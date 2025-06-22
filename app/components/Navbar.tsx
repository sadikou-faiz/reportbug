"use client"
import React, { useEffect, useState } from 'react'
import { LayoutDashboard, BookText, Icon, Bug, X, Menu } from "lucide-react"
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { checkAndAddUser } from '../server'

const Links = [
    { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/documentations", label: "Documentations", icon: BookText },
]

const NavLinks = ({
    className = "btn btn-primary btn-soft btn-sm",
}: {
    className?: string
}) => (
    <>
        {Links.map(({ href, label, icon: Icon }) => (
            <Link
                key={href}
                href={href}
                className={className}
            >
                <Icon className='w-4 h-4' />
                {label}
            </Link>
        ))}
    </>
)


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useUser()

    useEffect(() => {
        if (user && user.primaryEmailAddress?.emailAddress && user.fullName) {
            checkAndAddUser(user.primaryEmailAddress?.emailAddress, user.fullName)
        }
    }, [user])
    return (
        <header className='bg-base-300 shadow'>
            <div className='px-5 md:px-[10%] flex items-center justify-between h-16'>
                <div className='flex items-center gap-2'>
                    <Bug className='w-6 h-6 text-primary' />
                    <span className='font-bold text-lg'>Reportbug</span>
                </div>
                <div className='hidden md:flex gap-4'>
                    <NavLinks />
                </div>
                <div className='flex items-center gap-2'>
                    <UserButton />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='md:hidden btn-sm btn-soft btn-primary btn'
                    >
                        {isOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className='md:hidden flex flex-col bg-base-300 shadow-inner p-4 py-2 space-y-2'>
                    <NavLinks />
                </div>
            )}


        </header>
    )
}
export default Navbar
