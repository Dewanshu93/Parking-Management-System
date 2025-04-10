import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ManagerNavbar.css";
import { toast } from "react-toastify";

const ManagerNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const managerDetails = JSON.parse(localStorage.getItem("managerDetails"));

    const onLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/managers");
            const managers = await response.json();
            const loggedInManager = managers.find((manager) => manager.username === username);

            if (loggedInManager) {
                localStorage.removeItem("isManagerLoggedIn");
                localStorage.removeItem("managerUsername");
                localStorage.removeItem("managerDetails");
                navigate("/login");
                toast.success(`${loggedInManager} Logged Out Successfully`);
                
            } else {
                console.error("No manager is currently logged in.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="hover-box">
                <h1 className="head3">
                    Park <span className="King">King</span>
                </h1>
                {managerDetails && (
                    <div className="tooltip">
                        <p className="managerInfoTooltip"><strong className="managerInfoTooltip">Username:</strong> {managerDetails.username}</p>
                        <p className="managerInfoTooltip"><strong className="managerInfoTooltip">City:</strong> {managerDetails.city}</p>
                        <p className="managerInfoTooltip"><strong className="managerInfoTooltip">Station:</strong> {managerDetails.parkingStationName}</p>
                        <p className="managerInfoTooltip"><strong className="managerInfoTooltip">Contact:</strong> {managerDetails.contact}</p>
                    </div>
                )}
            </div>

            <button className="hamburger" onClick={toggleMenu}>
                ☰
            </button>
            <ul className={`secondNav ${isMenuOpen ? "openMenu" : "closeMenu"}`}>
                <Link to="/ManagerDashboard">
                    <li className="listItem1">Home</li>
                </Link>
                <Link to="/ManageEmployeeDashboard">
                    <li className="listItem1">Employee</li>
                </Link>
                <Link to="/ManageComplain">
                    <li className="listItem1">Manage Complain</li>
                </Link>
                <Link to="/PastBooking">
                    <li className="listItem1">Past Booking</li>
                </Link>
                <button onClick={onLogout} className="btn2">Logout</button>
            </ul>
        </nav>
    );
};

export default ManagerNavbar;
