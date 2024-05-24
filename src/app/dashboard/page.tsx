'use client'

import { HomeIcon, ChartBarIcon, UsersIcon, FolderIcon, CashIcon } from '@heroicons/react/solid';
import {MdAssessment, MdCloudUpload, MdSettings, MdPayment, MdMessage} from "react-icons/md";
import Link from "next/link";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import Sidebar  from "@/components/layout/Sidebar";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaWhatsapp } from "react-icons/fa";

export default function Dashboard() {
    const { session } = useSessionContext();
    const user = session?.user;

    const supabaseClient = useSupabaseClient();
    
    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.log(error);
        }
    };
    const router = useRouter();

	

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            {/* Main Content */}
            <div className="flex-1 p-7">
                {/* Banner */}
                <div className="bg-primary text-white p-4 rounded-md mb-10">
                    <h1 className="text-lg font-bold">Welcome to Your Dashboard, {user?.user_metadata.full_name?.split(' ')[0]}!</h1>
                    <p>Heres whats happening with your projects today!</p>
                </div>

                {/* Analytics Blocks */}
                <div className="grid grid-cols-3 gap-4">
                    <Link href="/analytics">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-48">
                            <MdAssessment className="mb-2 text-3xl text-primary flex-shrink-0" />
                            <div>
                                <h3 className="text-gray-700 font-bold">Analytics</h3>
                                <p className="text-gray-600">Insights on payment metrics, WhatsApp messages, and more!</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/dashboard/preferences">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-48">
                            <MdSettings className="mb-2 text-3xl text-primary flex-shrink-0" />
                            <div>
                                <h3 className="text-gray-700 font-bold">Reward Preferences</h3>
                                <p className="text-gray-600">Choose when to reward your customers</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/dashboard/upload-data">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-48">
                            <MdCloudUpload className="mb-2 text-3xl text-primary flex-shrink-0" />
                            <div>
                                <h3 className="text-gray-700 font-bold">Upload Customer Visit Data</h3>
                                <p className="text-gray-600">Upload csv file of customer last visits</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/billing">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-48">
                            <MdPayment className="mb-2 text-3xl text-primary flex-shrink-0" />
                            <div>
                                <h3 className="text-gray-700 font-bold">Billing</h3>
                                <p className="text-gray-600">Choose how you would like to billed and integrate your Tabby</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
