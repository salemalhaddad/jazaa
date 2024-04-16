'use client'
import React, { useState } from 'react';
import DetailsButtonServer from "../../components/details-button-server";

export default function Page() {
    const [typeOfBusiness, setTypeOfBusiness] = useState('');
    const [industry, setIndustry] = useState('');

    const businessTypes = ["Software", "Medium Enterprise", "Large Enterprise"];
    const industries = ["Fitness", "Beauty and Wellness", "Other"];

    // Function to render business type options
    const renderOption = (option, selected, setter) => (
        <button
            key={option}
            onClick={() => setter(option)}
            className={`p-2 border-2 border-gray-300 rounded-md m-1 ${
                selected === option ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-300 border-gray-300'
            }`}
        >
            {option}
            {selected === option && <span className="ml-2 text-white">✓</span>}
        </button>
    );

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
			<DetailsButtonServer />
            <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" onSubmit={e => e.preventDefault()}>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Business Onboarding</h2>

                <div className="mb-4">
                    <label htmlFor="businessName" className="block text-gray-700 text-sm font-bold mb-2">
                        Business Name
                    </label>
                    <input type="text" id="businessName" placeholder="Enter business name, e.g. Fitness Warriors LLC" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="whatsappNumber" className="block text-gray-700 text-sm font-bold mb-2">
                        Business WhatsApp Number
                    </label>
                    <input type="tel" id="whatsappNumber" placeholder="e.g., +971501234567" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                {/* <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Type of Business
                    </label>
                    <div className="flex flex-wrap">
                        {businessTypes.map(type => renderOption(type, typeOfBusiness, setTypeOfBusiness))}
                    </div>
                </div> */}

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Industry
                    </label>
                    <div className="flex flex-wrap">
                        {industries.map(industryOption => renderOption(industryOption, industry, setIndustry))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};
