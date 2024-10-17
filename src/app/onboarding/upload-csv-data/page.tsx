'use client'
import { SetStateAction, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from "next/navigation";
import { useSessionContext } from '@supabase/auth-helpers-react';
import Papa from 'papaparse';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiWarning } from "react-icons/ci";

export default function Preferences() {
	const [customerDataFile, setCustomerDataFile] = useState<File | null>(null);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [uploadOption, setUploadOption] = useState("");
	const [frequency, setRewardFrequency] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [businessType, setBusinessType] = useState("");
	const [discount, setDiscount] = useState<number | null>(0);
	const [frequency_unit, setRewardFrequencyUnit] = useState("");
	const [terms, setTerms] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [uploadError, setUploadError] = useState<string | null>(null);
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

	const handleBusinessTypeChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setBusinessType(e.target.value);
    };

	const handleTermsChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setTerms(e.target.checked);
    };

  const handlePhoneChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setPhoneNumber(e.target.value);
  };

  const handleZiinaDataUpload = async () => {
    const file = customerDataFile;
    if (!file) {
      return;
    }

    interface ZiinaCsvRow {
      Time: string;
      Transaction_ID: string;
      Type: string;
      Amount: string;
      Fee: string;
      Waived_Fee: string;
      Tip: string;
      Customer_VAT: string;
      Message: string;
      Performed_By: string;
      Invoice_Number: string;
      ZiiLink_Reference: string;
      Customer: string;
      Customer_Username: string;
      Customer_Card_Number: string;
      Customer_Email: string;
      Customer_Phone_Number: string;
      Customer_Address_Line_1: string;
      Customer_Address_Line_2: string;
      Recipient_Name: string;
      Recipient_Email: string;
      Recipient_Phone_Number: string;
      Recipient_Address_Line_1: string;
      Recipient_Address_Line_2: string;
      Custom_Request_Question: string;
      Custom_Request_Answer: string;
    }

    Papa.parse<ZiinaCsvRow>(file, {
      header: true,
      delimiter: ",", // Specify the delimiter explicitly
      skipEmptyLines: true, // Skip empty lines
      complete: async function (results) {
        const { data: csvData, errors, meta } = results;
        if (errors.length > 0) {
          console.error('Errors in parsing CSV:', errors);
          setUploadError("Error parsing CSV file. Please check the file format.");
          return;
        }

        let processedRows = 0;
        let skippedRows = 0;

        for (const row of csvData) {
          if (row) {
            console.log('Raw row data:', row);
            const uniqueIdentifier = row.Transaction_ID || row.Customer || `Order_${row.Time}`;

            if (!uniqueIdentifier) {
              console.error('Unable to generate unique identifier for row:', row);
              setUploadError((prev) => `CSV format is unidentifiable. Please check Transaction_ID column.`);
              skippedRows++;
              continue;
            }

            console.log('Processing row:', uniqueIdentifier);

            try {
              const { data: existingRows, error: fetchError } = await supabaseClient
                .from('customer-visits')
                .select('*')
                .eq('customer_name', uniqueIdentifier);

              if (fetchError) {
                console.error('Error fetching existing rows:', fetchError);
                setUploadError((prev) => `Jazaa is only for signed in businesses. Please sign in.`);
                skippedRows++;
                continue;
              }

              console.log('Business name is: ', businessName);
              if (existingRows.length === 0 && row.Type == 'Invoice') {
                const { error: insertError } = await supabaseClient
                  .from('customer-visits')
                  .insert([
                    {
                      customer_name: row.Customer,
                      whatsapp_no: row.Customer_Phone_Number || '',
                      last_visit_date: row.Time,
                      offering_name: 'Ziina Transaction',
                      offering_price: parseFloat(row.Amount.replace('AED', '')) || 0,
                      discount: discount,
                      business: businessName,
                      frequency: frequency,
                      frequency_unit: frequency_unit,
                      business_no: phoneNumber
                    }
                  ]);

                if (insertError) {
                  console.error('Error inserting row:', insertError);
                  setUploadError((prev) => `Please contact hello@jazaa.co.`);
                  skippedRows++;
                } else {
                  processedRows++;
                  console.log(`Inserted new row for ${uniqueIdentifier}`);
                }
              } else {
                console.log('Row already exists, skipping insert:', uniqueIdentifier);
                skippedRows++;
              }
            } catch (error) {
              console.error('Unexpected error processing row:', error);
              setUploadError((prev) => `Please contact hello@jazaa.co.`);
              skippedRows++;
            }
          } else {
            console.log('Empty row encountered, skipping');
            skippedRows++;
          }
        }

        console.log(`CSV processing completed. Processed: ${processedRows}, Skipped: ${skippedRows}`);
        setUploadSuccess(true);

        const { data: insertData, error } = await supabaseClient
          .from('jazaa-users')
          .insert([
            {
              business_name: businessName,
              businessType: businessType,
              frequency: frequency,
              frequency_unit: frequency_unit,
              phone_no: phoneNumber
            }
          ]);

        if (error) {
          console.log("Error in onboarding page", error);
        } else {
          console.log("Data insertion successful");
        }
      }
    });
  };


  const handlePackmanDataUpload = async () => {
    const file = customerDataFile;
    if (!file) {
      return;
    }

    interface PackmanCsvRow {
      Order_ID: string;
      Paytabs_ID: string;
      Checkout_ID: string;
      Tax_Invoice_Number_Customer: string;
      Tax_Invoice_Number_Seller: string;
      Creation_Date: string;
      Creation_Date_Time: string;
      Approved_Date: string;
      Approved_Date_Time: string;
      Dispatch_Date: string;
      Dispatch_Date_Time: string;
      Completed_Date: string;
      Completed_Date_Time: string;
      Store_ID: string;
      Store_Name: string;
      Store_Cell: string;
      Pickup_Cell: string;
      Pickup_City: string;
      Pickup_Address: string;
      Customer_Name: string;
      Customer_Cell: string;
      Customer_City: string;
      Customer_Address: string;
      Customer_Email: string;
      Shipping_Company: string;
      Status: string;
      Location: string;
      Shipping_Method: string;
      Shipping_Multiplier: string;
      Shipping_Cost: string;
      Shipping_Disclaimers: string;
      Shipping_Disclaimers_Cost: string;
      Payment_COD_Cost: string;
      Delivery_Charge_VAT: string;
      Total_Shipping_Charged_Amount: string;
      Shipping_Discount: string;
      Payment_Method: string;
      Payment_Gateway_Cost: string;
      Payment_Gateway_VAT: string;
      Items_Cost: string;
      Items_Discount: string;
      Items_VAT: string;
      Charged: string;
      Platform_Fee: string;
      Platform_Fee_VAT: string;
      Service_Fee_Cost: string;
      Service_Fee_VAT: string;
      Service_Fee_Charged_To: string;
      Total_Products_Count: string;
      Total_SKU_Count: string;
      Min_SKU_Price: string;
      Max_SKU_Price: string;
      Discount_Code: string;
      Restored: string;
      Status_Adjusted: string;
    }

  Papa.parse<PackmanCsvRow>(file, {
    header: true,
    delimiter: ",",
    skipEmptyLines: true,
    complete: async function (results) {
      const { data: csvData, errors } = results;
      if (errors.length > 0) {
        console.error('Errors in parsing CSV:', errors);
        setUploadError("Error parsing CSV file. Please check the file format.");
        return;
      }

      let processedRows = 0;
      let skippedRows = 0;

      for (const row of csvData) {
        if (row) {
          console.log('Raw row data:', row);
          const uniqueIdentifier = row.Order_ID || row.Customer_Name || `Order_${row.Creation_Date_Time}`;

          if (!uniqueIdentifier) {
            console.error('Unable to generate unique identifier for row:', row);
            setUploadError((prev) => `${prev}\nCSV format is unidentifiable. Please check Order ID column.`);
            skippedRows++;
            continue;
          }

          console.log('Processing row:', uniqueIdentifier);

          try {
            const { data: existingRows, error: fetchError } = await supabaseClient
              .from('customer-visits')
              .select('*')
              .eq('customer_name', uniqueIdentifier);

            if (fetchError) {
              console.error('Error fetching existing rows:', fetchError);
              setUploadError((prev) => `${prev}\nJazaa is only for signed in businesses. Please sign in.`);
              skippedRows++;
              continue;
            }

            console.log('Business name is: ', businessName);
            if (existingRows.length === 0 && row.Status === 'Completed') {
              const { error: insertError } = await supabaseClient
                .from('customer-visits')
                .insert([
                  {
                    customer_name: row.Customer_Name,
                    whatsapp_no: row.Customer_Cell,
                    last_visit_date: row.Completed_Date,
                    offering_name: 'Packman Order',
                    offering_price: parseFloat(row.Charged) || 0,
                    discount: discount,
                    business: businessName,
                    frequency: frequency,
                    frequency_unit: frequency_unit,
                    business_no: phoneNumber
                  }
                ]);

              if (insertError) {
                console.error('Error inserting row:', insertError);
                setUploadError((prev) => `${prev}\nPlease contact hello@jazaa.co.`);
                skippedRows++;
              } else {
                processedRows++;
                console.log(`Inserted new row for ${uniqueIdentifier}`);
              }
            } else {
              console.log('Row already exists or not completed, skipping insert:', uniqueIdentifier);
              skippedRows++;
            }
          } catch (error) {
            console.error('Unexpected error processing row:', error);
            setUploadError((prev) => `${prev}\nPlease contact hello@jazaa.co.`);
            skippedRows++;
          }
        } else {
          console.log('Empty row encountered, skipping');
          skippedRows++;
        }
      }

      console.log(`CSV processing completed. Processed: ${processedRows}, Skipped: ${skippedRows}`);
      setUploadSuccess(true);

      const { data: insertData, error } = await supabaseClient
        .from('jazaa-users')
        .insert([
          {
            business_name: businessName,
            businessType: businessType,
            frequency: frequency,
            frequency_unit: frequency_unit,
            phone_no: phoneNumber
          }
        ]);

      if (error) {
        console.log("Error in onboarding page", error);
      } else {
        console.log("Data insertion successful");
      }
    },
    error: function(error) {
      console.error('Error:', error);
      setUploadError("Error reading the CSV file.");
    }
  });
  };

  const handleShopifyDataUpload= async () => {
    const file = customerDataFile;
    if (!file) {
      return;
    }

    interface CsvRow {
        Name: string;
        Email: string;
        Financial_Status: string;
        Paid_at: string;
        Fulfillment_Status: string;
        Fulfilled_at: string;
        Accepts_Marketing: string;
        Currency: string;
        Subtotal: string;
        Shipping: string;
        Taxes: string;
        Total: string;
        Discount_Code: string;
        Discount_Amount: string;
        Shipping_Method: string;
        Created_at: string;
        Lineitem_quantity: string;
        Lineitem_name: string;
        Lineitem_price: string;
        Lineitem_compare_at_price: string;
        Lineitem_sku: string;
        Lineitem_requires_shipping: string;
        Lineitem_taxable: string;
        Lineitem_fulfillment_status: string;
        Billing_Name: string;
        Billing_Street: string;
        Billing_Address1: string;
        Billing_Address2: string;
        Billing_Company: string;
        Billing_City: string;
        Billing_Zip: string;
        Billing_Province: string;
        Billing_Country: string;
        Billing_Phone: string;
        Shipping_Name: string;
        Shipping_Street: string;
        Shipping_Address1: string;
        Shipping_Address2: string;
        Shipping_Company: string;
        Shipping_City: string;
        Shipping_Zip: string;
        Shipping_Province: string;
        Shipping_Country: string;
        Shipping_Phone: string;
        Notes: string;
        Note_Attributes: string;
        Cancelled_at: string;
        Payment_Method: string;
        Payment_Reference: string;
        Refunded_Amount: string;
        Vendor: string;
        Outstanding_Balance: string;
        Employee: string;
        Location: string;
        Device_ID: string;
        Id: string;
        Tags: string;
        Risk_Level: string;
        Source: string;
        Lineitem_discount: string;
        Tax_1_Name: string;
        Tax_1_Value: string;
        Tax_2_Name: string;
        Tax_2_Value: string;
        Tax_3_Name: string;
        Tax_3_Value: string;
        Tax_4_Name: string;
        Tax_4_Value: string;
        Tax_5_Name: string;
        Tax_5_Value: string;
        Phone: string;
        Receipt_Number: string;
        Duties: string;
        Billing_Province_Name: string;
        Shipping_Province_Name: string;
        Payment_ID: string;
        Payment_Terms_Name: string;
        Next_Payment_Due_At: string;
        Payment_References: string;
    }

    Papa.parse<CsvRow>(file, {
      header: true,
      delimiter: ",", // Specify the delimiter explicitly
      skipEmptyLines: true, // Skip empty lines
      complete: async function (results) {
        const { data: csvData, errors, meta } = results;
        if (errors.length > 0) {
          console.error('Errors in parsing CSV:', errors);
          // Display error message to the user
          setUploadError("Error parsing CSV file. Please check the file format.");
          return;
        }
        if (meta.fields && meta.fields.length !== 79) {
          console.error(`Expected 79 fields, but found ${meta.fields.length}`);
          setUploadError(`Invalid CSV format. Expected 79 fields, but found ${meta.fields.length}.`);
          return;
        }

        let processedRows = 0;
        let skippedRows = 0;

        for (const row of csvData) {
          if (row) {
            console.log('Raw row data:', row);
            // Check for 'Billing Name' with space and 'Billing_Name' with underscore
            const billingName = row.Billing_Name || '';

            let uniqueIdentifier = billingName || row.Name || row.Id || `Order_${row.Name}`;

            if (!uniqueIdentifier) {
              console.error('Unable to generate unique identifier for row:', row);
            //   setUploadError((prev) => prev + `\nRow skipped due to missing identifier: ${JSON.stringify(row)}`);
			setUploadError((prev) => `CSV format is unidentifiable. Please check first column (Id).`);
              skippedRows++;
              continue;
            }

            console.log('Processing row:', uniqueIdentifier);

            try {
              const { data: existingRows, error: fetchError } = await supabaseClient
                .from('customer-visits')
                .select('*')
                .eq('customer_name', uniqueIdentifier);

              if (fetchError) {
                console.error('Error fetching existing rows:', fetchError);
                // setUploadError((prev) => prev + `\nError fetching data for ${uniqueIdentifier}: ${fetchError.message}`);
                setUploadError((prev) => `Jazaa is only for signed in businesses. Please sign in.`);
                skippedRows++;
                continue;
              }

              console.log('Business name is: ', businessName);
              if (existingRows.length === 0) {
                const { error: insertError } = await supabaseClient
                  .from('customer-visits')
                  .insert([
                    {
                      customer_name: uniqueIdentifier,
                      whatsapp_no: row.Billing_Phone || '',
                      last_visit_date: row.Paid_at || row.Created_at,
                      offering_name: row.Lineitem_name || 'Unknown Product',
                      offering_price: parseFloat(row.Lineitem_price) || 0,
                      discount: discount,
                      business: businessName,
                      frequency: frequency,
                      frequency_unit: frequency_unit,
                      business_no: phoneNumber
                    }
                  ]);

                if (insertError) {
                  console.error('Error inserting row:', insertError);
                //   setUploadError((prev) => prev + `\nError inserting data for ${uniqueIdentifier}: ${insertError.message}`);
				  setUploadError((prev) => `Please contact hello@jazaa.co.`);
                  skippedRows++;
                } else {
                  processedRows++;
                  console.log(`Inserted new row for ${uniqueIdentifier}`);
                }
              } else {
                console.log('Row already exists, skipping insert:', uniqueIdentifier);
                skippedRows++;
              }
            } catch (error) {
              console.error('Unexpected error processing row:', error);
            //   setUploadError((prev) => prev + `\nUnexpected error processing row: ${error.message}`);
			setUploadError((prev) => `Please contact hello@jazaa.co.`);
              skippedRows++;
            }
          } else {
            console.log('Empty row encountered, skipping');
            skippedRows++;
          }
        }

        console.log(`CSV processing completed. Processed: ${processedRows}, Skipped: ${skippedRows}`);
        setUploadSuccess(true);
        // setUploadError((prev) => prev + `\nProcessing summary: ${processedRows} rows processed, ${skippedRows} rows skipped.`);
        const { data: insertData, error } = await supabaseClient
          .from('jazaa-users')
          .insert([
            {
              business_name: businessName,
              businessType: businessType,
              frequency: frequency,
              frequency_unit: frequency_unit,
              phone_no: phoneNumber
            }
          ]);

        if (error) {
          console.log("Error in onboarding page", error);
        } else {
          console.log("Data insertion successful: ");
        }
      },
      error: function(error) {
        console.error('Error:', error);
        setUploadError("Error reading the CSV file.");
      }
    });
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

			console.log('Business name is: ', businessName)
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
                    business: businessName,
                    frequency: frequency,
                    frequency_unit: frequency_unit,
                    business_no: phoneNumber
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

		  const { data, error } = await supabaseClient
            .from('jazaa-users')
            .insert([
                {
                    business_name: businessName,
					businessType: businessType,
                    frequency: frequency,
                    frequency_unit: frequency_unit,
                    phone_no: phoneNumber
                }
            ]);

        if (error) {
            console.log("Error in onboarding page", error);
        } else {
            console.log("Data insertion successful: ");
		}

        }
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
		<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Fill in the required details</h2>
        <div >
            <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-2 mt-8">Enter your WhatsApp number</label>
            <div className="flex items-center">
                <span className="text-lg font-medium text-gray-700 mr-2">+971</span>
                <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 501234567"
                    required
                />
            </div>
        </div>
        <div className="mb-4">
            <label htmlFor="businessName" className="block text-lg font-medium text-gray-700 mb-2 mt-4">Enter business name</label>
            <input
                type="text"
                name="businessName"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your business name, ex Fitness Players LLC"
                required
            />
        </div>
        <div className="mb-4">
            <label htmlFor="businessType" className="block text-lg font-medium text-gray-700 mb-2">Select the type of business</label>
            <select
                id="businessType"
                value={businessType}
                onChange={handleBusinessTypeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
            >
                <option value="" disabled>Select Business Type</option>
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail</option>
                <option value="fitness">Fitness</option>
                <option value="salon">Salon</option>
				<option value="other">Other</option>
            </select>
        </div>
		<div className="mb-4">
			<label htmlFor="discount" className="block text-lg font-medium text-gray-700 mb-2">Select discount percentage given to customers</label>
			<select
				id="discount"
				value={discount === null ? 'other' : discount.toString()}
				onChange={(e) => {
					if (e.target.value === 'other') {
						setDiscount(null);
					} else {
						setDiscount(Number(e.target.value));
					}
				}}
				className="w-full px-4 py-2 border border-gray-300 rounded-md"
				required
			>
				<option value="" disabled>Select Discount Percentage</option>
				<option value="5">5%</option>
				<option value="10">10%</option>
				<option value="15">15%</option>
				<option value="20">20%</option>
				<option value="25">25%</option>
				<option value="30">30%</option>
				<option value="35">35%</option>
				<option value="40">40%</option>
				<option value="45">45%</option>
				<option value="50">50%</option>
				<option value="other">Other</option>
			</select>
			{discount === null && (
				<input
					type="number"
					id="customDiscount"
					onChange={(e) => setDiscount(Number(e.target.value))}
					className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
					placeholder="Enter custom discount percentage"
				/>
			)}
		</div>
        <div className="mb-4">
            <label htmlFor="rewardFrequency" className="block text-lg font-medium text-gray-700 mb-2">When would you like to reward your customers since their last purchase?</label>
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
                    <option value="" disabled>Select Frequency Unit</option>
                    <option value="days">Day(s) since last visit</option>
                    <option value="weeks">Week(s) since last visit</option>
                    <option value="months">Month(s) since last visit</option>
                </select>
            </div>
        </div>



        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2 mt-2">Choose Data Upload Option</label>
          <div className="flex flex-row gap-4 flex-wrap">
            <button
              onClick={() => setUploadOption('manual')}
              className={`py-3 px-6 rounded-lg shadow-md ${uploadOption === 'manual' ? 'bg-white text-blue-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
              disabled={uploadOption === 'manual'}
            >
              Manual
            </button>
            <button
              onClick={() => setUploadOption('shopify')}
              className={`py-3 px-6 rounded-lg shadow-md ${uploadOption === 'shopify' ? 'bg-white text-blue-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
              disabled={uploadOption === 'shopify'}
            >
              Shopify Orders Data
            </button>
            <button
              onClick={() => setUploadOption('packman')}
              className={`py-3 px-6 rounded-lg shadow-md ${uploadOption === 'packman' ? 'bg-white text-blue-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
              disabled={uploadOption === 'packman'}
            >
              Packman Orders Data
            </button>
            <button
              onClick={() => setUploadOption('ziina')}
              className={`py-3 px-6 rounded-lg shadow-md ${uploadOption === 'ziina' ? 'bg-white text-blue-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
              disabled={uploadOption === 'ziina'}
            >
              Ziina Orders Data
            </button>
          </div>
          {uploadOption && (
            <div className="mt-4">
				<div className="inline-block bg-blue-100 text-blue-700 p-2 gap-2 rounded-lg flex flex-row items-center mb-4">
          <IoIosInformationCircleOutline className="text-5xl" />
            <p className="text-left text-gray-600">File uploaded should have the same format as the sample file below.</p>
          </div>
          <div className="inline-block bg-red-100 text-blue-700 p-2 gap-2 rounded-lg flex flex-row items-center mb-4">
            <CiWarning className="text-7xl text-red-500" />
          <p className="text-left text-gray-600">All data is shown to the developer except ones related to sales & revenue. It is encrypted and can only be shown to you.</p>
        </div>
              <label htmlFor="uploadCsvData" className="block text-lg font-medium text-gray-700 mb-2">Upload {uploadOption === 'manual' ? 'Manual' : uploadOption === 'shopify' ? 'Shopify Orders' : uploadOption === 'packman' ? 'Packman Orders' : 'Ziina Orders'} Data</label>
              <input
                type="file"
                id="uploadCsvData"
                accept=".csv"
				onChange={handleDataUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <a href={`/${uploadOption}_orders_sample.csv`} download className="block text-left text-blue-600 mt-2 underline">Download a sample CSV file</a>
            </div>
          )}
        </div>



		<div className="flex items-start">
			<div className="flex items-center h-5">
				<input id="terms" aria-describedby="terms" type="checkbox" checked={terms} onChange={handleTermsChange} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
			</div>
			<div className="ml-3 text-sm mb-4">
				<label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/terms-conditions">Terms and Conditions</a></label>
			</div>
		</div>

        <button
          type="button"
          className="w-full px-4 py-2 bg-blue-600 text-white mt-2 rounded-md hover:bg-blue-700"
          onClick={uploadOption === 'manual' ? handleCsvUpload : uploadOption === 'shopify' ? handleShopifyDataUpload : uploadOption === 'packman' ? handlePackmanDataUpload : handleZiinaDataUpload}
        >
          Upload
        </button>
        {uploadSuccess && <p className="text-center text-green-600 mt-4">CSV upload successful!</p>}
        {uploadError && <p className="text-center text-red-600 mt-4">{uploadError}</p>}
      </div>
    </div>
  );
}
