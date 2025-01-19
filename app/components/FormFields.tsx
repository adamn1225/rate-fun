"use client";
import React from 'react';

interface FormFieldsProps {
    year: string;
    setYear: (value: string) => void;
    make: string;
    setMake: (value: string) => void;
    model: string;
    setModel: (value: string) => void;
    freightDescription: string;
    setFreightDescription: (value: string) => void;
    length: number;
    setLength: (value: number) => void;
    width: number;
    setWidth: (value: number) => void;
    height: number;
    setHeight: (value: number) => void;
    weight: number;
    setWeight: (value: number) => void;
    originZip: string;
    setOriginZip: (value: string) => void;
    destinationZip: string;
    setDestinationZip: (value: string) => void;
    originCity: string;
    originState: string;
    destinationCity: string;
    destinationState: string;
    handleZipCodeBlur: (type: 'origin' | 'destination') => void;
    handleZipCodeKeyDown: (e: React.KeyboardEvent, type: 'origin' | 'destination') => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
    year,
    setYear,
    make,
    setMake,
    model,
    setModel,
    freightDescription,
    setFreightDescription,
    length,
    setLength,
    width,
    setWidth,
    height,
    setHeight,
    weight,
    setWeight,
    originZip,
    setOriginZip,
    destinationZip,
    setDestinationZip,
    originCity,
    originState,
    destinationCity,
    destinationState,
    handleZipCodeBlur,
    handleZipCodeKeyDown,
}) => {
    return (
        <>
            <div className='flex gap-1 items-center justify-center  w-full'>
                <input
                    type="text"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="border p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            {/* <div className='w-full flex justify-stretch items-center my-2'>
                <span className='border border-b border-gray-100/50 w-full' />
                <span className='text-stone-50 font-medium text-lg px-2'> Or </span>
                <span className='border border-b border-gray-100/50 w-full' />
            </div>
            <textarea
                placeholder="Freight Description"
                value={freightDescription}
                onChange={(e) => setFreightDescription(e.target.value)}
                className="border p-2 w-full"
            /> */}
            <div className='flex gap-1 items-center justify-center  w-full'>
                <input
                    type="number"
                    placeholder="Length"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="border p-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="border p-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="border p-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Weight"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="border p-2 w-full"
                />
            </div>
            <div className='w-full flex justify-stretch items-center my-2'>
                <span className='border border-b border-gray-100/50 w-full' />
                <span className='border border-b border-gray-100/50 w-full' />
            </div>
            <div className='flex gap-2 justify-evenly items-center  w-full'>
                <div className='flex flex-col w-full'>
                    <input
                        type="text"
                        placeholder="Origin Zip"
                        value={originZip}
                        onChange={(e) => setOriginZip(e.target.value)}
                        onBlur={() => handleZipCodeBlur('origin')}
                        onKeyDown={(e) => handleZipCodeKeyDown(e, 'origin')}
                        className="border p-2 w-full self-center"
                    />
                    <input
                        type="text"
                        placeholder="Origin City"
                        value={originCity}
                        readOnly
                        className="border p-2 w-full self-center mt-2"
                    />
                    <input
                        type="text"
                        placeholder="Origin State"
                        value={originState}
                        readOnly
                        className="border p-2 w-full self-center mt-2"
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <input
                        type="text"
                        placeholder="Destination Zip"
                        value={destinationZip}
                        onChange={(e) => setDestinationZip(e.target.value)}
                        onBlur={() => handleZipCodeBlur('destination')}
                        onKeyDown={(e) => handleZipCodeKeyDown(e, 'destination')}
                        className="border p-2 w-full self-center"
                    />
                    <input
                        type="text"
                        placeholder="Destination City"
                        value={destinationCity}
                        readOnly
                        className="border p-2 w-full self-center mt-2"
                    />
                    <input
                        type="text"
                        placeholder="Destination State"
                        value={destinationState}
                        readOnly
                        className="border p-2 w-full self-center mt-2"
                    />
                </div>
            </div>
        </>
    );
};

export default FormFields;