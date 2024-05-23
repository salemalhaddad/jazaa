'use client'

import { HomeIcon, ChartBarIcon, UsersIcon, FolderIcon, CashIcon } from '@heroicons/react/solid';
import {MdMessage} from "react-icons/md";
import Link from "next/link";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Sidebar() {
    const { session } = useSessionContext();
    const user = session?.user;

    const supabaseClient = useSupabaseClient();
    
    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-white w-64 p-5 shadow-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-10">Dashboard</h2>
            <ul className="space-y-4">
                <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                    <HomeIcon className="h-6 w-6" />
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-500 cursor-pointer">Home</Link>

                </li>
                <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                    <ChartBarIcon className="h-6 w-6" />
                    <Link href="/dashboard/analytics" className="text-gray-700 hover:text-blue-500 cursor-pointer">Analytics</Link>

                </li>
                <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <Link href="/dashboard/preferences" className="text-gray-700 hover:text-blue-500 cursor-pointer">Preferences</Link>
                </li>
                <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                    <CashIcon className="h-6 w-6" />
                    <Link href="/dashboard/billing" className="text-gray-700 hover:text-blue-500 cursor-pointer">Billing</Link>

                </li>
                <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h1a3 3 0 013 3v1" />
                    </svg>
                    <Link href="/" onClick={handleLogout}>Sign Out</Link>
                </li>
            </ul>
        </div>
    );
};
