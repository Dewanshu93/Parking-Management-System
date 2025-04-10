import React, { useState, useEffect } from "react";
import "./ComplainManagePage.css";
import ManagerNavbar from "../ManagerNavbar/ManagerNavbar";

const ComplainManagePage = () => {
    const [complains, setComplains] = useState([]);
    const [managerParkingStation, setManagerParkingStation] = useState("");
    const managerUsername=localStorage.getItem("managerUsername");
    const managerDetails=JSON.parse(localStorage.getItem("managerDetails"));

    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const response = await fetch("http://localhost:3000/managers");
                const managers = await response.json();

                const loggedInManager = managers.find((manager) => manager.username===managerUsername);

                if (loggedInManager) {
                    setManagerParkingStation(loggedInManager.parkingStationName);
                }
            } catch (error) {
                console.error("Error fetching manager information:", error);
            }
        };

        fetchManagerInfo();
    }, []);

    useEffect(() => {
        const fetchComplains = async () => {
            try {
                const response = await fetch("http://localhost:3000/complains");
                const data = await response.json();

                const filteredComplains = data.filter(
                    (complain) => complain.parkingStation === managerParkingStation
                );

                setComplains(filteredComplains);
            } catch (error) {
                console.error("Error fetching complains:", error);
            }
        };

        if (managerParkingStation) {
            fetchComplains();
        }
    }, [managerParkingStation]);

    const handleAction = async (id) => {
        const updatedComplains = complains.map((complain) =>
            complain.id === id ? { ...complain, managerResponse: "Action Taken" } : complain
        );

        setComplains(updatedComplains);

        try {
            const complainToUpdate = complains.find((complain) => complain.id === id);

            await fetch(`http://localhost:3000/complains/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...complainToUpdate, managerResponse: "Action Taken" }),
            });

            alert("Manager response updated to Action Taken.");
        } catch (error) {
            console.error("Error updating manager response:", error);
            alert("Failed to update response. Please try again.");
        }
    };

    return (
        <div className="complainManagerContainer">
            <ManagerNavbar />
            <div className="ComplainManagerContainer">
                <h1 className="complainHeader">Complain Management</h1>
                <div className="complainCardContainer">
                    {complains.length > 0 ? (
                        complains.map((complain) => (
                            <div key={complain.id} className="complainCard">
                                <p className="complainDetails"><strong className="complainDetails">City:</strong> {complain.city}</p>
                                <p className="complainDetails"><strong className="complainDetails">Parking Station:</strong> {complain.parkingStation}</p>
                                <p className="complainDetails"><strong className="complainDetails">Type:</strong> {complain.type}</p>
                                <p className="complainDetails"><strong className="complainDetails">Complain Against:</strong> {complain.complainAgainst}</p>
                                <p className="complainDetails"><strong className="complainDetails">Description:</strong> {complain.description}</p>
                                <p className="complainDetails"><strong className="complainDetails">Status:</strong> {complain.status}</p>
                                <p className="complainDetails"><strong className="complainDetails">Manager Response:</strong> {complain.managerResponse}</p>
                                {complain.managerResponse === "No Action" && (
                                    <button
                                        className="resolveButton"
                                        onClick={() => handleAction(complain.id)}
                                    >
                                        Take Action
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="noData">No complaints to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplainManagePage;
