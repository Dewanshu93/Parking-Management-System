import React, { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const navigate = useNavigate();
    const username=localStorage.getItem("username");
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch("http://localhost:3000/users");
                const users = await response.json();

                // Find user by username
                const currentUser = users.find(user => user.username === username);
                if (currentUser) {
                    setUserDetails(currentUser);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (username) {
            fetchUserDetails();
        }
    }, [username]);

    const onLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userDetails");
        localStorage.removeItem("username"); // Remove username from local storage
        toast.success("Logout Successful");
        navigate("/login");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="UserNavbar">
            <ToastContainer/>
            <h1 className="head3">
                Park <span className="King">King</span>
            </h1>
            <div className="userProfileDetail">
                {userDetails ? (
                    <div className="profileInfo">
                        <p style={{color:"black"}}><strong style={{color:"black"}}>Username: </strong> {userDetails.username}</p>
                        <p style={{color:"black"}}><strong style={{color:"black"}}>Name:</strong> {userDetails.name}</p>
                        <p style={{color:"black"}}><strong style={{color:"black"}}>Email:</strong> {userDetails.email}</p>
                        <p style={{color:"black"}}><strong style={{color:"black"}}>Contact:</strong> {userDetails.contact}</p>
                        <p style={{color:"black"}}>
                            <strong>License:</strong>
                             {userDetails.license}
                        </p>
                    </div>
                ) : (
                    <p>Loading user details...</p>
                )}
            </div>
            {/* Hamburger icon */}
            <button className="hamburger" onClick={toggleMenu}>
                ☰
            </button>
            {/* Menu Items */}
            <ul className={`secondNav ${isMenuOpen ? "openMenu" : "closeMenu"}`}>
                <Link to="/dashboard">
                    <li className="listItem1">Home</li>
                </Link>
                <Link to="/AboutUs">
                    <li className="listItem1">About us</li>
                </Link>
                <Link to="/Plan">
                    <li className="listItem1">Plan</li>
                </Link>
                <Link to="/Testimonials">
                    <li className="listItem1">Testimonials</li>
                </Link>
                <Link to="/MyBookings">
                    <li className="listItem1">My Bookings</li>
                </Link>
                <Link to="/RateUs">
                    <li className="listItem1">Rate Us</li>
                </Link>
                <Link to="/BookingHistory">
                    <li className="listItem1">Booking History</li>
                </Link>
                <Link to="/RaiseComplain">
                    <li className="listItem1">Raise Complain</li>
                </Link>
                <Link to="/ComplainHistory">
                    <li className="listItem1">
                        Complain History
                    </li>
                </Link>
                <button onClick={onLogout} className="btn2">Logout</button>
            </ul>
        </nav>
    );
};

export default Navbar;
