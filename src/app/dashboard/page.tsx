'use client'

import { HomeIcon, ChartBarIcon, UsersIcon, FolderIcon, CashIcon, DotsIcon } from '@heroicons/react/solid';
import {MdMessage} from "react-icons/md";

// import
export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-white w-64 p-5 shadow-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-10">Dashboard</h2>
                <ul className="space-y-4">
                    <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                        <HomeIcon className="h-6 w-6" />
                        <span>Home</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                        <ChartBarIcon className="h-6 w-6" />
                        <span>Analytics</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
                        <span>Preferences</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer">
                        <CashIcon className="h-6 w-6" />
                        <span>Billing</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10">
                {/* Banner */}
                <div className="bg-blue-500 text-white p-4 rounded-md mb-10">
                    <h1 className="text-lg font-bold">Welcome to Your Dashboard</h1>
                    <p>Heres whats happening with your projects today!</p>
                </div>

                {/* Analytics Blocks */}
                <div className="grid grid-cols-3 gap-4 ">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
					<MdMessage className="mb-2 text-3xl text-blue-500 flex-shrink-0" />
                        <h3 className="text-gray-700 font-bold">WhatsApp Payments</h3>
                        <p className="text-gray-600">Details about payment metrics</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                        <h3 className="text-gray-700 font-bold">Outreach-to-offer</h3>
                        <p className="text-gray-600">Message-to-payment analytics</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                        <h3 className="text-gray-700 font-bold">Latest Ceustomer Payments</h3>
                        <p className="text-gray-600">System performance data</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
