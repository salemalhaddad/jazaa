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
import Papa from 'papaparse';

export default function Preferences() {
    const [customerDataFile, setCustomerDataFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const supabaseClient = useSupabaseClient();

    const { session } = useSessionContext();
    const user = session?.user;

    const router = useRouter();

    

    const handleDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerDataFile(e.target.files?.[0] ?? null);
        setUploadSuccess(false); // Reset upload success state on new file selection
    }

    const handleCsvUpload = async () => {
        const file = customerDataFile;
      
        if (!file) {
          return;
        }
      
        Papa.parse(file, {
          header: true,
          complete: async function (results) {
            const { data, errors } = results;
      
            if (errors.length > 0) {
              console.error('Errors in parsing CSV:', errors);
              return;
            }
      
            for (const row of data) {
              // Assuming there's a unique identifier in each row, like 'customer_id'
              const uniqueIdentifier = row.customer_name; // Adjust based on actual unique identifier in your CSV/data structure
              if (!uniqueIdentifier) {
                console.error('Unique identifier missing in row, skipping:', row);
                continue;
              }

              // Add 'business' column to each row
              let businessName = "DefaultBusinessName"; // Fallback business name
              const { data: userData, error: userError } = await supabaseClient
                .from('jazaa-users')
                .select('business_name')
                .eq('user_name', user?.user_metadata.full_name)
                .single();

              if (!userError && userData) {
                businessName = userData.business_name;
              }
              
              const rowWithBusiness = { ...row, business: businessName };

              // Check if the row already exists in the database
              const { data: existingRows, error: fetchError } = await supabaseClient
                .from('customer-visits')
                .select('*')
                .eq('customer_name', uniqueIdentifier); // Adjust the column name ('customer_id') as per your database schema

              if (fetchError) {
                console.error('Error fetching existing rows:', fetchError);
                continue;
              }

              if (existingRows.length === 0) {
                // Row does not exist, proceed to insert
                const { error: insertError } = await supabaseClient.from('customer-visits').insert([rowWithBusiness]);
                if (insertError) {
                  console.error('Error inserting row:', insertError);
                }
              } else {
                console.log('Row already exists, skipping insert:', rowWithBusiness);
              }
            }
      
            console.log('CSV processing completed');
            setUploadSuccess(true); // Set upload success state to true after processing is completed
          },
        });
      };

    return (
        <div className="flex h-screen bg-gray-100">
        <Sidebar />
        {/* Upload CSV Content */}
        <div className="flex-1 p-10">
            <h2 className={cn("text-2xl", "font-bold", "mb-4")}>Upload Customer Visit Data</h2>
            <p className={cn("text-md", "mb-4", "text-red-600")}>Please ensure the CSV file contains columns for customer name, WhatsApp number, last visit time (MM/DD/YYYY), and the service/product they paid for.</p>
            <div className="flex flex-col ">
                <label className={cn("text-lg", "font-medium", "mb-2")} htmlFor="uploadCsv">Upload CSV File</label>
                <input
                    type="file"
                    id="uploadCsv"
                    accept=".csv"
                    onChange={handleDataUpload}
                    className={cn("w-full", "px-4", "py-2", "text-lg", "border", "border-gray-300", "rounded")}
                />
                <div className="mt-4">
                    <button type="button" className="px-4 py-2 bg-primary text-white rounded" onClick={handleCsvUpload}>Upload</button>
                </div>
                {uploadSuccess && <p className={cn("text-md", "mt-4", "text-green-600")}>CSV upload successful!</p>}
            </div>
        </div>
    </div>
    );
}

