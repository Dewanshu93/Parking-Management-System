import React, { useState, useEffect } from "react";
import "./ManagerDashboard.css";
import ManagerNavbar from "../ManagerNavbar/ManagerNavbar";

const ManagerDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [managerParkingStation, setManagerParkingStation] = useState("");
    const username = localStorage.getItem("managerUsername");

    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const response = await fetch("http://localhost:3000/managers");
                const managers = await response.json();

                const loggedInManager = managers.find((manager) => manager.username === username);

                if (loggedInManager) {
                    setManagerParkingStation(loggedInManager.parkingStationName);
                    console.log("Manager's Parking Station:", loggedInManager.parkingStationName);
                }
            } catch (error) {
                console.error("Error fetching manager information:", error);
            }
        };

        fetchManagerInfo();
    }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch("http://localhost:3000/bookingHistory");
                const data = await response.json();

                const filteredRequests = data.filter(
                    (request) => request.parkingStation === managerParkingStation
                );

                setRequests(filteredRequests);
                console.log("Filtered Requests:", filteredRequests);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };

        if (managerParkingStation) {
            fetchRequests();
        }
    }, [managerParkingStation]);

    const viewProfile = async (username) => {
        try {
            const response = await fetch("http://localhost:3000/users");
            const users = await response.json();
            const userBookingsResponse = await fetch("http://localhost:3000/bookingHistory");
            const userBookings = await userBookingsResponse.json();

            const ticketsByUser = userBookings.filter(booking => booking.BookedBy === username);
            const totalTicketBooked = ticketsByUser.length;
            const user = users.find(user => user.username === username);

            if (user) {
                const userProfileWindow = window.open("", "_blank");

                let ticketDetailsHTML = `
                    <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 8px;">Parking Station</th>
                                <th style="padding: 8px;">Slot</th>
                                <th style="padding: 8px;">Check-In</th>
                                <th style="padding: 8px;">Check-Out</th>
                                <th style="padding: 8px;">Total Price</th>
                                <th style="padding: 8px;">Status</th>
                                <th style="padding: 8px;">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                ticketsByUser.forEach(ticket => {
                    ticketDetailsHTML += `
                        <tr>
                            <td style="padding: 8px;">${ticket.parkingStation}</td>
                            <td style="padding: 8px;">${ticket.slot}</td>
                            <td style="padding: 8px;">${ticket.checkInDate} ${ticket.checkInTime}</td>
                            <td style="padding: 8px;">${ticket.checkOutDate} ${ticket.checkOutTime}</td>
                            <td style="padding: 8px;">₹${ticket.totalPrice}</td>
                            <td style="padding: 8px;">${ticket.status}</td>
                            <td style="padding: 8px;">${ticket.payment}</td>
                        </tr>
                    `;
                });

                ticketDetailsHTML += `</tbody></table>`;

                userProfileWindow.document.write(`
                    <html>
                    <head>
                        <title>User Profile</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                                text-align: center;
                            }
                            .profile-container {
                                width: 60%;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                            }
                            h2 {
                                color: #333;
                            }
                            p {
                                font-size: 18px;
                                margin: 5px 0;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="profile-container">
                            <h2>User Profile</h2>
                            <p><strong>Name:</strong> ${user.name}</p>
                            <p><strong>Username:</strong> ${user.username}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Contact:</strong> ${user.contact}</p>
                            <p><strong>License:</strong> ${user.license}</p>
                            <p><strong>Total Tickets Booked:</strong> ${totalTicketBooked}</p>
                            <h3>Ticket History</h3>
                            ${ticketDetailsHTML}
                        </div>
                    </body>
                    </html>
                `);
            } else {
                alert("User not found!");
            }
        } catch (error) {
            alert("Error fetching user details. Please try again.");
        }
    };

    const handleApprove = async (id) => {
        const requestToUpdate = requests.find((request) => request.id === id);
        if (!requestToUpdate) return;

        const updatedRequest = {
            ...requestToUpdate,
            status: "approved",
        };

        try {
            await fetch(`http://localhost:3000/bookingHistory/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRequest),
            });

            setRequests(requests.map((req) => (req.id === id ? updatedRequest : req)));
        } catch (error) {
            alert("Failed to update request. Please try again.");
        }
    };

    const handlePayment = async (id) => {
        const requestToUpdate = requests.find((request) => request.id === id);
        if (!requestToUpdate) return;

        const updatedRequest = {
            ...requestToUpdate,
            payment: "Success",
        };

        try {
            await fetch(`http://localhost:3000/bookingHistory/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRequest),
            });

            setRequests(requests.map((req) => (req.id === id ? updatedRequest : req)));
        } catch (error) {
            alert("Failed to update payment status. Please try again.");
        }
    };

    const handleCheckIn = async (id) => {
        const requestToUpdate = requests.find((request) => request.id === id);
        if (!requestToUpdate) return;

        const updatedRequest = {
            ...requestToUpdate,
            CheckedIn: true,
        };

        try {
            await fetch(`http://localhost:3000/bookingHistory/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRequest),
            });

            setRequests(requests.map((req) => (req.id === id ? updatedRequest : req)));
        } catch (error) {
            alert("Failed to update check-in status. Please try again.");
        }
    };

    const handleCheckout = async (id) => {
        const requestToUpdate = requests.find((request) => request.id === id);
        if (!requestToUpdate) return;

        const updatedRequest = {
            ...requestToUpdate,
            CheckedOut: true,
        };

        try {
            await fetch(`http://localhost:3000/bookingHistory/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRequest),
            });

            setRequests(requests.map((req) => (req.id === id ? updatedRequest : req)));
        } catch (error) {
            alert("Failed to complete checkout. Please try again.");
        }
    };

    return (
        <div className="container69">
            <ManagerNavbar />
            <div className="managerConatiner">
                <h1 className="managerHeader">Manager Dashboard</h1>
                <div className="card-container699999">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <div key={request.id} className="card69">
                                <p className="para699"><strong>Username:</strong> {request.BookedBy}</p>
                                <p className="para699"><strong>City:</strong> {request.city}</p>
                                <p className="para699"><strong>Parking Station:</strong> {request.parkingStation}</p>
                                <p className="para699"><strong>Slot:</strong> {request.slot}</p>
                                <p className="para699"><strong>Check-In:</strong> {request.checkInDate} {request.checkInTime}</p>
                                <p className="para699"><strong>Check-Out:</strong> {request.checkOutDate} {request.checkOutTime}</p>
                                <p className="para699"><strong>Total Price:</strong> ₹{request.totalPrice}</p>
                                <p className="para699"><strong>Status:</strong> {request.status}</p>
                                <p className="para699"><strong>Payment Status:</strong> {request.payment}</p>
                                <p className="para699"><strong>Checked In:</strong> {request.CheckedIn ? "YES" : "No"}</p>
                                <p className="para699"><strong>Checked Out:</strong> {request.CheckedOut ? "YES" : "No"}</p>
                                <div className="managerDashboardButtonConatiner">
                                    {request.status !== "approved" && request.CheckedIn !== true && (
                                        <button className="button69Manager" onClick={() => handleApprove(request.id)}>Approve Request</button>
                                    )}
                                    {request.CheckedIn !== true && (
                                        <button className="button69Manager" onClick={() => handleCheckIn(request.id)}>Check-In</button>
                                    )}
                                    {request.payment !== "Success" && (
                                        <button className="button69Manager" onClick={() => handlePayment(request.id)}>Mark as Paid</button>
                                    )}
                                    <button className="button69Manager" onClick={() => handleCheckout(request.id)}>Checkout</button>
                                    <button className="button69Manager" onClick={() => viewProfile(request.BookedBy)}>View Profile</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No requests to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
