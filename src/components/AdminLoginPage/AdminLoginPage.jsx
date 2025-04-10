import React from "react";
import { useForm } from "react-hook-form"; // Import useForm
import { Link, useNavigate } from "react-router-dom";
import "./AdminLoginPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLoginPage = () => {
    const { register, handleSubmit } = useForm(); // Initialize useForm
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:3000/adminDetails");
            const admins = await response.json();

            const admin = admins.find(
                (a) => a.username === data.username && a.password === data.password
            );
            console.log(admin);

            if (admin) {
                toast.success("Admin login successful!");
                localStorage.setItem("isAdminLoggedIn", "true");
                localStorage.setItem("AdminUsername", admin.username);
                localStorage.setItem("adminDetails",JSON.stringify(admin));

                setTimeout(() => {
                    navigate("/AdminDashboard");
                }, 1000);
            } else {
                toast.error("Invalid admin username or password. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching admin details:", error);
            toast.error("An error occurred while logging in. Please try again later.");
        }
    };

    return (
        <div className="mainContainer1">
            <ToastContainer />
            <div className="centerContainer">
                <h1 className="head1">
                    Park <span className="logo1">King</span>
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}> {/* Use handleSubmit */}
                    <input
                        type="text"
                        className="AdminInput"
                        placeholder="Enter Admin Username"
                        {...register("username", { required: true })} // Register username
                    />
                    <input
                        type="password"
                        className="AdminInput"
                        placeholder="Enter Admin Password"
                        {...register("password", { required: true })} // Register password
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
                            Not an Admin? Go to User Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
