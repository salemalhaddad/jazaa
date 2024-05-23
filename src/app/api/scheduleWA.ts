// Assuming necessary packages and modules are installed and types are available
import { createClient } from '@supabase/supabase-js';
import { scheduleJob } from 'node-schedule';
import { addDays } from 'date-fns';

// Supabase client initialization (Replace with your actual Supabase project details)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to perform the API call, replace with actual implementation
async function performAPICall(customerId: string): Promise<void> {
  // API call logic here
  console.log(`Performing API call for customer ${customerId}`);
}

// Function to fetch new customer visits from the database
async function getNewCustomerVisits(): Promise<Array<{ customerId: string; visitDate: string }>> {
  let { data, error } = await supabase
    .from('visits')
    .select('*');
  if (error) throw error;
  return data;
}

// Function to schedule API call X days after customer visit
const scheduleAPICallsAfterCustomerVisit = async (daysAfterVisit: number): Promise<void> => {
  try {
    const visits = await getNewCustomerVisits();
    visits.forEach((visit) => {
      const { customerId, visitDate } = visit;
      const scheduleDate = addDays(new Date(visitDate), daysAfterVisit);

      // Schedule the API call
      scheduleJob(scheduleDate, async () => {
        try {
          await performAPICall(customerId);
          console.log(`API call successful for customer ${customerId}`);
        } catch (error) {
          console.error(`API call failed for customer ${customerId}`, error);
        }
      });
    });
  } catch (error) {
    console.error('Failed to fetch customer visits or schedule API calls', error);
  }
};

// Example usage: Schedule API call 5 days after each customer visit
scheduleAPICallsAfterCustomerVisit(5);

