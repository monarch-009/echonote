"use client";
import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesGantt } from 'lucide-react'
import React from 'react'

/**
 * UserMenu Component
 * Wraps Clerk's UserButton to customize the menu items.
 * Adds a direct link to the Dashboard.
 */
const UserMenu = () => {
    return (
        <UserButton
            appearance={{
                elements: {
                    avatarBox: "w-10 h-10",
                },
            }}
        >
            <UserButton.MenuItems>
                <UserButton.Link
                    label='Dashboard'
                    href="/dashboard"
                    labelIcon={<ChartNoAxesGantt size={16} className="mr-2" />}
                />
                <UserButton.Action label='manageAccount' />
            </UserButton.MenuItems>
        </UserButton>
    )
}

export default UserMenu