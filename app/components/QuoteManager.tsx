"use client";
import React, { useState } from 'react';
import Form from './Form';
import QuoteHistory from './QuoteHistory';

const QuoteManager = () => {
    const [activeTab, setActiveTab] = useState('form');

    return (
        <div>
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setActiveTab('form')}
                    className={`px-4 py-2 ${activeTab === 'form' ? 'bg-amber-400' : 'bg-gray-200'} text-gray-900 font-medium`}
                >
                    Request Quote
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 ${activeTab === 'history' ? 'bg-amber-400' : 'bg-gray-200'} text-gray-900 font-medium`}
                >
                    Quote History
                </button>
            </div>
            {activeTab === 'form' && <Form />}
            {activeTab === 'history' && <QuoteHistory userProfile={null} />}
        </div>
    );
};

export default QuoteManager;