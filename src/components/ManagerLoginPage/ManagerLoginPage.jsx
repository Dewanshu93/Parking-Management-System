import React from "react";
import { useForm } from "react-hook-form"; // Import useForm
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManagerLoginPage.css";

const ManagerLoginPage = () => {
    const { register, handleSubmit } = useForm(); // Initialize useForm
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:3000/managers");
            const users = await response.json();

            console.log("Fetched managers:", users);

            const user = users.find(
                (u) => u.username === data.username.trim() && u.password === data.password.trim()
            );

            console.log("Matching user:", user);

            if (user) {
                toast.success(`Manager ${user.username} logged in successfully!`);
                localStorage.setItem("isManager", "true");
                localStorage.setItem("managerUsername", user.username);
                localStorage.setItem("managerDetails",JSON.stringify(user))

                setTimeout(() => {
                    navigate("/ManagerDashboard");
                }, 1000);

                
            } else {
                toast.error("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("An error occurred while logging in. Please try again later.");
        }
    };

    return (
        <div className="mainContainer1">
            <ToastContainer /> {/* Ensure this is here for toasts to work */}
            <div className="centerContainer">
                <h1 className="head1">
                    Park <span className="logo1">King</span>
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}> {/* Handle form submission */}
                    <input
                        type="text"
                        className="managerLoginInput"
                        placeholder="Please Enter Username"
                        {...register("username", { required: "Username is required" })} // Use register
                    />
                    <input
                        type="password"
                        className="managerLoginInput"
                        placeholder="Please enter password"
                        {...register("password", { required: "Password is required" })} // Use register
                    />
                    <br />
                    <button className="btn1" type="submit">
                        Login
                    </button>
                </form>
                <br />
                <div className="linkContainer">
                    <div>
                        <Link to="/login" className="anchorEl">
                            If you are User?
                        </Link>
                    </div>
                    <div>
                        <Link to="/ContactUs" className="anchorEl">
                            Facing issues? Contact us.
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerLoginPage;
