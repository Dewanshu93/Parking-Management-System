import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Complain.css";
import Navbar from "../Navbar/Navbar";

const Complain = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [parkingStations, setParkingStations] = useState([]);
    const [selectedParkingStation, setSelectedParkingStation] = useState("");
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(""); // Either "employee" or "slot"
    const [complainAgainst, setComplainAgainst] = useState(""); // Selected employee or slot
    const [description, setDescription] = useState("");
    const username=localStorage.getItem("username");
    const userDetails=JSON.parse(localStorage.getItem("userDetails"));

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("http://localhost:3000/cityLocations");
                const data = await response.json();
                setCities(data);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        fetchCities();
    }, []);

    const handleCityChange = (city) => {
        setSelectedCity(city);
        const cityData = cities.find((c) => c.city === city);
        setParkingStations(cityData ? cityData.parkingStations : []);
        setSelectedParkingStation("");
        setEmployees([]);
        setSlots([]);
    };

    const handleParkingStationChange = (stationName) => {
        setSelectedParkingStation(stationName);
        const stationData = parkingStations.find((station) => station.name === stationName);
        setEmployees(stationData ? stationData.employees : []);
        setSlots(stationData ? stationData.slots : []);
        setSelectedEntity("");
        setComplainAgainst("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCity || !selectedParkingStation || !selectedEntity || !complainAgainst || !description) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const newComplain = {
            city: selectedCity,
            username,
            customerName:userDetails.name,
            parkingStation: selectedParkingStation,
            type: selectedEntity, // "employee" or "slot"
            complainAgainst,
            description,
            status: "Not Resolved",
            managerResponse:"No Action"
        };

        try {
            const response = await fetch("http://localhost:3000/complains", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newComplain),
            });

            if (response.ok) {
                toast.success("Complain submitted successfully!");
                setSelectedCity("");
                setParkingStations([]);
                setSelectedParkingStation("");
                setEmployees([]);
                setSlots([]);
                setSelectedEntity("");
                setComplainAgainst("");
                setDescription("");
            } else {
                toast.error("Failed to submit complain. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting complain:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="complainContainer">
            <Navbar />
            <ToastContainer /> {/* Ensure ToastContainer is here for toasts to work */}
            <div className="complainMainContainer">
                <h1 className="complainHeader">Raise a Complain</h1>
                <form onSubmit={handleSubmit} className="complainForm">
                    {/* City Selection */}
                    <div className="selectionConatiner">
                        <label className="complainLabel">Select City:</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => handleCityChange(e.target.value)}
                            className="dropdown"
                        >
                            <option value="" className="dropdown">-- Select City --</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.city} className="dropdown">
                                    {city.city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Parking Station Selection */}
                    {parkingStations.length > 0 && (
                        <div>
                            <label className="complainLabel">Select Parking Station:</label>
                            <select
                                value={selectedParkingStation}
                                onChange={(e) => handleParkingStationChange(e.target.value)}
                                className="dropdown"
                            >
                                <option value="" className="dropdown">-- Select Parking Station --</option>
                                {parkingStations.map((station, index) => (
                                    <option key={index} value={station.name} className="dropdown">
                                        {station.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Entity Selection */}
                    {employees.length > 0 && slots.length > 0 && (
                        <div>
                            <label className="complainLabel">Complain Against:</label>
                            <select
                                value={selectedEntity}
                                onChange={(e) => setSelectedEntity(e.target.value)}
                                className="dropdown"
                            >
                                <option value="" className="dropdown">-- Select Entity --</option>
                                <option value="employee" className="dropdown">Employee</option>
                                <option value="slot" className="dropdown">Parking Slot</option>
                            </select>
                        </div>
                    )}

                    {/* Employees or Slots */}
                    {selectedEntity === "employee" && (
                        <div>
                            <label className="complainLabel">Select Employee:</label>
                            <select
                                value={complainAgainst}
                                onChange={(e) => setComplainAgainst(e.target.value)}
                                className="dropdown"
                            >
                                <option value="" className="dropdown">-- Select Employee --</option>
                                {employees.map((employee, index) => (
                                    <option key={index} value={employee.name} className="dropdown">
                                        {employee.name} - {employee.role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedEntity === "slot" && (
                        <div>
                            <label className="complainLabel">Select Slot:</label>
                            <select
                                value={complainAgainst}
                                onChange={(e) => setComplainAgainst(e.target.value)}
                                className="dropdown"
                            >
                                <option value="" className="dropdown">-- Select Slot --</option>
                                {slots.map((slot, index) => (
                                    <option key={index} value={`Slot ${slot.slotNumber}`} className="dropdown">
                                        Slot {slot.slotNumber} - ₹{slot.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Complain Description */}
                    {selectedEntity && complainAgainst && (
                        <div>
                            <label className="complainLabel">Complain Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea"
                                placeholder="Write your complain here..."
                            ></textarea>
                        </div>
                    )}

                    {/* Submit Button */}
                    {selectedEntity && complainAgainst && description && (
                        <button type="submit" className="submitButton">
                            Submit Complain
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Complain;
