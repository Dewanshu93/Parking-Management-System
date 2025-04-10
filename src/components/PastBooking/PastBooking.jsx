import React, { useState, useEffect } from "react";
import "./PastBooking.css"
import ManagerNavbar from "../ManagerNavbar/ManagerNavbar";

const PastBooking = () => {
    const [pastBookings, setPastBookings] = useState([]);
    const [managerParkingStation, setManagerParkingStation] = useState("");
    const managerUsername=localStorage.getItem("managerUsername");
    const managerDetails=JSON.parse(localStorage.getItem("managerDetails"));

    useEffect(() => {
        // Fetch manager info and set parking station
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
        // Fetch past bookings related to the manager's parking station
        const fetchPastBookings = async () => {
            try {
                const response = await fetch("http://localhost:3000/bookingHistory");
                const data = await response.json();

                const filteredBookings = data.filter(
                    (booking) => booking.parkingStation === managerParkingStation
                );

                setPastBookings(filteredBookings);
            } catch (error) {
                console.error("Error fetching past bookings:", error);
            }
        };

        if (managerParkingStation) {
            fetchPastBookings();
        }
    }, [managerParkingStation]);

    return (
        <div className="containerPastBooking">
            <ManagerNavbar />
            <div className="pastBookingContainer">
                <h1 className="pastBookingHeader">Past Bookings</h1>
                <div className="pastBokkingCardContainer">
                    {pastBookings.length > 0 ? (
                        pastBookings.map((booking, index) => (
                            <div key={index} className="pastBookingcard">
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">Name:</strong> {booking.BookedBy}</p>
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">City:</strong> {booking.city}</p>
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">Parking Station:</strong> {booking.parkingStation}</p>
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">Slot:</strong> {booking.slot}</p>
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">Check-In:</strong> {booking.checkInDate} {booking.checkInTime}</p>
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">Check-Out:</strong> {booking.checkOutDate} {booking.checkOutTime}</p>
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">Total Price:</strong> ₹{booking.totalPrice}</p>
                                <p className="pastBokkingDetails"><strong className="pastBokkingDetails">Payment Status:</strong> {booking.payment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No past bookings to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PastBooking;
