import React from 'react';

export default function SuccessOnboarding() {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h2 className="text-3xl font-bold mb-4">Data Integration Successful!</h2>
      <p className="text-lg mb-8">Your data integration with Jazaa is now complete. If you encounter any issues or have questions, please don&apos;t hesitate to reach out to us.</p>
      <div className="flex justify-center">
        <a href="mailto:hello@jazaa.com" className="text-blue-500 hover:text-blue-700">
          <button className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md">Email Support</button>
        </a>
      </div>
    </div>
  );
}
