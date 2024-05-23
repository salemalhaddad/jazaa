'use client'
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon, ChartBarIcon, UsersIcon, FolderIcon, CashIcon } from '@heroicons/react/solid';
import Link from "next/link";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Sidebar from "@/components/layout/Sidebar"
import { useRouter } from "next/navigation";
import { useSessionContext } from '@supabase/auth-helpers-react';

export default function Preferences() {
    const [rewardType, setRewardType] = useState('');
    const [rewardFrequency, setRewardFrequency] = useState('');
    const [rewardFrequencyUnit, setRewardFrequencyUnit] = useState('');

    const supabaseClient = useSupabaseClient();

    const { session } = useSessionContext();
    const user = session?.user;

    const router = useRouter();

    

    const handleRewardFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRewardFrequency(e.target.value);
    };

    const handleRewardFrequencyUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRewardFrequencyUnit(e.target.value);
    };

    const handleSubmit = async () => {
        // Extract the submission details
        const rewardDetails = {
            frequency: rewardFrequency,
            frequency_unit: rewardFrequencyUnit,
        };

        // Send the details to the database
        const { data, error } = await supabaseClient
            .from('jazaa-users')
            .insert({user_name: user?.user_metadata.full_name, frequency: rewardFrequency, frequency_unit: rewardFrequencyUnit})

        if (error) {
            console.log('Error inserting reward details:', error);
        } else {
            console.log('Reward details updated successfully:', user?.user_metadata.full_name);
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
        <Sidebar />
        {/* Preferences Content */}
        <div className="flex-1 p-10">
            <h2 className={cn("text-2xl", "font-bold", "mb-4")}>Set Customer Reward Preferences</h2>
            <div className="flex flex-col ">
                <label className={cn("text-lg", "font-medium", "mb-2")} htmlFor="rewardFrequency">Reward Frequency</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        id="rewardFrequency"
                        value={rewardFrequency}
                        onChange={handleRewardFrequencyChange}
                        className={cn("w-1/2", "px-4", "py-2", "text-lg", "border", "border-gray-300", "rounded")}
                    />
                    <select
                        id="rewardFrequencyUnit"
                        value={rewardFrequencyUnit}
                        onChange={handleRewardFrequencyUnitChange}
                        className={cn("w-1/2", "px-4", "py-2", "text-lg", "border", "border-gray-300", "rounded")}
                    >
                        <option value="" disabled>Select reward frequency</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </select>
                </div>
                <div className="mt-4">
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    </div>
    );
}

