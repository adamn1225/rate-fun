"use client";
import React, { useState, useEffect } from 'react';
import equipmentDims from '../../public/equipment_dims.json'; // Import the JSON data
import structuredEscortRequirements from '../../public/structured_escort_requirements.json';
import statePermitData from '../../public/state_permit_data.json';
import FormFields from './FormFields'; // Import the FormFields component

interface EscortRequirement {
    width_min?: number;
    width_max?: number;
    height_min?: number;
    escort_requirement: string;
}

interface StructuredEscortRequirements {
    [key: string]: EscortRequirement[];
}

type StatePermitData = {
    [key: string]: {
        Width: string;
        Height: string;
        "Single Axle": string;
        "Tandem Axle": string;
        "Gross Vehicle Weight": string;
    };
};

type StatePermitDataKeys = keyof typeof statePermitData;

const Form = () => {
    const [year, setYear] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [freightDescription, setFreightDescription] = useState('');
    const [length, setLength] = useState(Number);
    const [width, setWidth] = useState(Number);
    const [height, setHeight] = useState(Number);
    const [weight, setWeight] = useState(Number);
    const [originZip, setOriginZip] = useState('');
    const [destinationZip, setDestinationZip] = useState('');
    const [originCity, setOriginCity] = useState('');
    const [originState, setOriginState] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationState, setDestinationState] = useState('');
    const [emailError, setEmailError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [originLat, setOriginLat] = useState(0);
    const [originLon, setOriginLon] = useState(0);
    const [destinationLat, setDestinationLat] = useState(0);
    const [destinationLon, setDestinationLon] = useState(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [rate, setRate] = useState<number | null>(null);

    useEffect(() => {
        const equipment = equipmentDims.find(
            (item) => item.Manufacturer === make && item.Model === model
        );
        if (equipment?.Manufacturer) {
            setLength(equipment.dimensions.Length);
            setWidth(equipment.dimensions.Width);
            setHeight(equipment.dimensions.Height);
            setWeight(equipment.dimensions.Weight);
        } else {
            setLength(0);
            setWidth(0);
            setHeight(0);
            setWeight(0);
        }
    }, [make, model]);

    const checkPermitRequirements = (state: string) => {
        const stateKey = `${state} Size and Weight Limits` as keyof typeof statePermitData;

        if (!(stateKey in statePermitData)) {
            console.error(`State key "${stateKey}" not found in permit data.`);
            return false;
        }

        const stateData = statePermitData[stateKey];
        const overWidth = width > parseFloat(stateData.Width.replace(/[^0-9.]/g, '')) * 12;
        const overHeight = height > parseFloat(stateData.Height.replace(/[^0-9.]/g, ''));
        const overWeight = weight > parseFloat(stateData["Gross Vehicle Weight"].replace(/[^0-9.]/g, ''));

        return overWidth || overHeight || overWeight;
    };

    const checkEscortRequirements = (state: string) => {
        const requirements = (structuredEscortRequirements as StructuredEscortRequirements)[state.toLowerCase()] || [];
        return requirements.filter(rule => {
            return (
                (rule.width_min && width >= rule.width_min && (!rule.width_max || width <= rule.width_max)) ||
                (rule.height_min && height >= rule.height_min)
            );
        });
    };

    useEffect(() => {
        console.log(`Origin Lat: ${originLat}, Origin Lon: ${originLon}`);
        console.log(`Destination Lat: ${destinationLat}, Destination Lon: ${destinationLon}`);
    }, [originLat, originLon, destinationLat, destinationLon]);

    const lookupZipCode = async (type: 'origin' | 'destination') => {
        const zipCode = type === 'origin' ? originZip : destinationZip;
        const url = `https://api.zippopotam.us/us/${zipCode}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const city = data.places[0]['place name'];
            const state = data.places[0]['state'];
            const latitude = parseFloat(data.places[0].latitude);
            const longitude = parseFloat(data.places[0].longitude);
            if (type === 'origin') {
                setOriginCity(city);
                setOriginState(state);
                setOriginLat(latitude);
                setOriginLon(longitude);
                console.log(`Origin: ${city}, ${state}, Lat: ${latitude}, Lon: ${longitude}`);
            } else {
                setDestinationCity(city);
                setDestinationState(state);
                setDestinationLat(latitude);
                setDestinationLon(longitude);
                console.log(`Destination: ${city}, ${state}, Lat: ${latitude}, Lon: ${longitude}`);
            }
        } catch (error) {
            console.error('Error fetching zip code data:', error);
        }
    };

    const handleZipCodeBlur = (type: 'origin' | 'destination') => {
        lookupZipCode(type);
    };

    const handleZipCodeKeyDown = (e: React.KeyboardEvent, type: 'origin' | 'destination') => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            lookupZipCode(type);
        }
    };

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance * 0.621371; // Convert to miles
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate distance
        const distance = haversineDistance(originLat, originLon, destinationLat, destinationLon);
        setDistance(distance);

        const originPermitRequired = checkPermitRequirements(originState);
        const destinationPermitRequired = checkPermitRequirements(destinationState);

        const originEscorts = checkEscortRequirements(originState);
        const destinationEscorts = checkEscortRequirements(destinationState);

        const totalEscortCost = originEscorts.length * 500 + destinationEscorts.length * 500; // Example cost logic
        const totalPermitCost = (originPermitRequired ? 125 : 0) + (destinationPermitRequired ? 125 : 0);

        // Default rates and conditions
        const fullLoadRate = 3;
        const partialLoadRate = 2;
        let baseRate = fullLoadRate;

        // Overweight cost additions
        let overweightCost = 0;
        if (weight >= 48000 && weight <= 59999) {
            overweightCost = 1.5;
        } else if (weight >= 60000 && weight <= 79999) {
            overweightCost = 2.5;
        } else if (weight >= 80000 && weight <= 89999) {
            overweightCost = 3;
        } else if (weight >= 90000 && weight <= 105000) {
            overweightCost = 5;
        } else if (weight > 105001) {
            overweightCost = 8;
        }

        // Dimension-based full load check
        const isOverWidth = width > 96;
        const isOverHeight = height > 10.5;
        const isOverLength = length >= 40;
        const requiresFullLoad = isOverWidth || isOverHeight || isOverLength || weight >= 35000;

        if (requiresFullLoad) {
            baseRate = fullLoadRate;
        } else if (length >= 15 && length < 30 && weight < 20000 && !isOverWidth && !isOverHeight) {
            baseRate = partialLoadRate;
        }

        // Total rate per mile
        const totalRate = baseRate + overweightCost;

        // Calculate pilot car costs if applicable
        let pilotCarCost = 0;
        if (isOverWidth || isOverHeight) {
            const pilotCarsNeeded = isOverWidth && isOverHeight ? 2 : 1;
            if (pilotCarsNeeded === 1) {
                pilotCarCost = 500 + 1.5 * distance;
            } else if (pilotCarsNeeded === 2) {
                pilotCarCost = 1000 + 3 * distance;
            }
        }

        // Permit costs
        const permitsPerState = isOverWidth && isOverHeight ? 200 : (isOverWidth || isOverHeight ? 125 : 0);
        const numStates = 3; // Example: Modify with actual state count from route
        const permitCost = permitsPerState * numStates;

        // Calculate total cost
        const baseCost = totalRate * distance;
        const totalCost = baseCost + pilotCarCost + permitCost;
        const serviceFee = totalCost * 0.15; // 15% service fee
        const finalCost = totalCost + serviceFee;

        console.log(`Base Rate: $${baseRate} per mile`);
        console.log(`Overweight Cost: $${overweightCost} per mile`);
        console.log(`Pilot Car Cost: $${pilotCarCost.toFixed(2)}`);
        console.log(`Permit Cost: $${permitCost.toFixed(2)}`);
        console.log(`Total Cost (before service fee): $${totalCost.toFixed(2)}`);
        console.log(`Final Cost (after service fee): $${finalCost.toFixed(2)}`);

        alert(`Final Shipping Estimate: $${finalCost.toFixed(2)} (includes service fee)`);

        return finalCost;
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <div>
            {formSubmitted ? (
                <div className="text-center p-4">
                    <p className="text-stone-100 text-md font-medium">{submissionMessage}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full">
                    <p className="text-stone-100 text-center text-md text-nowrap w-full font-medium my-2">Fill out the form below to get an instant quote</p>
                    <span className='flex justify-center items-center'><hr className="my-4 w-1/2 text-stone-100/20" /></span>
                    <FormFields
                        year={year}
                        setYear={setYear}
                        make={make}
                        setMake={setMake}
                        model={model}
                        setModel={setModel}
                        freightDescription={freightDescription}
                        setFreightDescription={setFreightDescription}
                        length={length}
                        setLength={setLength}
                        width={width}
                        setWidth={setWidth}
                        height={height}
                        setHeight={setHeight}
                        weight={weight}
                        setWeight={setWeight}
                        originZip={originZip}
                        setOriginZip={setOriginZip}
                        destinationZip={destinationZip}
                        setDestinationZip={setDestinationZip}
                        originCity={originCity}
                        originState={originState}
                        destinationCity={destinationCity}
                        destinationState={destinationState}
                        handleZipCodeBlur={handleZipCodeBlur}
                        handleZipCodeKeyDown={handleZipCodeKeyDown}
                    />
                    <div className='flex justify-center'>
                        <button type="submit" className="m-0 px-4 py-2 border border-gray-900 shadow-md bg-amber-400 text-gray-900 font-semibold hover:border-gray-900 hover:bg-amber-400/70 hover:border hover:text-gray-900">
                            Submit
                        </button>
                    </div>
                    {distance !== null && (
                        <div className="text-center p-4">
                            <p className="text-stone-100 text-md font-medium">Distance: {distance.toFixed(2)} miles</p>
                        </div>
                    )}
                    {rate !== null && (
                        <div className="text-center p-4">
                            <p className="text-stone-100 text-md font-medium">Rate: ${rate.toFixed(2)}</p>
                        </div>
                    )}
                    {submissionMessage && (
                        <div className="text-center p-4">
                            <p className="text-stone-100 text-md font-medium">{submissionMessage}</p>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default Form;