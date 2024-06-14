'use client'
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from "next/navigation";
import { useSessionContext } from '@supabase/auth-helpers-react';
import Papa from 'papaparse';
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function Preferences() {
	const [customerDataFile, setCustomerDataFile] = useState<File | null>(null);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [frequency, setRewardFrequency] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [frequency_unit, setRewardFrequencyUnit] = useState("");

	const supabaseClient = useSupabaseClient();
	const { session } = useSessionContext();
	const user = session?.user;
	const router = useRouter();

	const handleDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
	if (e.target.files) {
		setCustomerDataFile(e.target.files[0]);
	} else {
		setCustomerDataFile(null);
	}
	setUploadSuccess(false); // Reset upload success state on new file selection
	}

	const handleRewardFrequencyChange = (e: { target: { value: SetStateAction<string>; }; }) => {
		setRewardFrequency(e.target.value);
	};

	const handleRewardFrequencyUnitChange = (e: { target: { value: SetStateAction<string>; }; }) => {
		setRewardFrequencyUnit(e.target.value);
	};

	const handleBusinessNameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setBusinessName(e.target.value);

    };

  const handleCsvUpload = async () => {
    const file = customerDataFile;
    if (!file) {
      return;
    }

    interface CsvRow {
      customer_name: string;
      whatsapp_no: string;
      last_visit_date: string;
      offering_name: string;
      offering_price: number;
      discount: string;
      offering_amount: string;
    }

    Papa.parse<CsvRow>(file, {
      header: true,
      complete: async function (results) {
        const { data, errors } = results;
        if (errors.length > 0) {
          console.error('Errors in parsing CSV:', errors);
          return;
        }

        for (const row of data) {
          if (row) {
            const uniqueIdentifier = row.customer_name;
            if (!uniqueIdentifier) {
              console.error('Unique identifier missing in row, skipping:', row);
              continue;
            }

            const rowWithBusiness = { ...row, business: user?.user_metadata.full_name };

            const { data: existingRows, error: fetchError } = await supabaseClient
              .from('customer-visits')
              .select('*')
              .eq('customer_name', uniqueIdentifier);

            if (fetchError) {
              console.error('Error fetching existing rows:', fetchError);
              continue;
            }

            if (existingRows.length === 0) {
              const { data: { user } } = await supabaseClient.auth.getUser();
              const { error: insertError } = await supabaseClient
                .from('customer-visits')
                .insert([
                  {
                    customer_name: row.customer_name,
                    whatsapp_no: row.whatsapp_no,
                    last_visit_date: row.last_visit_date,
                    offering_name: row.offering_name,
                    offering_price: row.offering_price,
                    discount: row.discount,
                    business: businessName
                  }
                ]);

              const { data, error: updateError } = await supabaseClient
                .rpc('encrypt_price', { last_date: row.last_visit_date });

              if (updateError) {
                console.error('Error updating offering_amount:', updateError);
              } else {
                console.log('Column offering_amount updated successfully.');
              }

              if (insertError) {
                console.error('Error inserting row:', insertError);
              }
            } else {
              console.log('Row already exists, skipping insert:', rowWithBusiness);
            }
          }

          console.log('CSV processing completed');
          setUploadSuccess(true);
        }
      },
    });



  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
		<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Fill in the required details</h2>

        <div className="mb-4">
            <label htmlFor="businessName" value={businessName} onChange={handleBusinessNameChange} className="block text-lg font-medium text-gray-700 mb-2 mt-8">Enter business name</label>
            <input
                type="text"
                name="businessName"
                id="businessName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your business name, ex Fitness Players LLC"
                required
            />
        </div>
        <div className="mb-4">
            <label htmlFor="rewardFrequency" className="block text-lg font-medium text-gray-700 mb-2">How often do you want to reward your customers?</label>
            <div className="flex items-center space-x-2">
                <input
                    type="number"
					id="rewardFrequency"
					value={frequency}
					onChange={handleRewardFrequencyChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter frequency"
                    required
                />
                <select
					id="rewardFrequencyUnit"
					value={frequency_unit}
					onChange={handleRewardFrequencyUnitChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                >
                    <option value="" disabled selected>Select Frequency Unit</option>
                    <option value="days">Per Day</option>
                    <option value="weeks">Per Week</option>
                    <option value="months">Per Month</option>
                </select>
            </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2 mt-2" htmlFor="uploadCsv">Upload CSV File</label>
		  <div className="inline-block bg-blue-100 text-blue-700 p-2 gap-2 rounded-lg flex flex-row items-center mb-4">
		  	<IoIosInformationCircleOutline className="text-5xl" />
            <p className="text-left text-gray-600">Ensure the file uploaded has the same format as showcased in the sample CSV file below.</p>
          </div>
          <input
            type="file"
            id="uploadCsv"
            accept=".csv"
            onChange={handleDataUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <a href="/customer_visits_sample.csv" download className="block text-left text-blue-600 mt-2 underline">Download a sample CSV file</a>
        </div>
        <button
          type="button"
          className="w-full px-4 py-2 bg-blue-600 text-white mt-2 rounded-md hover:bg-blue-700"
          onClick={handleCsvUpload}
        >
          Upload
        </button>
        {uploadSuccess && <p className="text-center text-green-600 mt-4">CSV upload successful!</p>}
      </div>
    </div>
  );
}

