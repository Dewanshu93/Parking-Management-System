import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

const LoginPage = () => {
    const { register, handleSubmit } = useForm(); // Using useForm hooks
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:3000/users");
            const users = await response.json();

            const user = users.find((u) => u.username === data.username && u.password === data.password);

            if (user) {
                toast.success(`${data.username} logged in successfully!`);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userDetails",JSON.stringify(user));
                localStorage.setItem("username", data.username); // Store username

                setTimeout(() => {
                    navigate("/dashboard"); // Navigate after 1 second
                }, 1000);
            } else {
                toast.error("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        className="inputUserLogin"
                        placeholder="Please Enter Username"
                        {...register("username")} // Register input for useForm
                    />
                    <input
                        type="password"
                        className="inputUserLogin"
                        placeholder="Please enter password"
                        {...register("password")} // Register input for useForm
                    />
                    <br />
                    <button className="btn1" type="submit">
                        Login
                    </button>
                </form>
                <br />
                <div className="linkContainer">
                    <div>
                        <Link to="/ManagerLogin" className="anchorEl">
                            If you are Manager?
                        </Link>
                    </div>
                    <div>
                        <Link to="/AdminLogin" className="anchorEl">
                            If You are Admin?
                        </Link>
                    </div>
                    <div>
                        <Link to="/SignUp" className="anchorEl">
                            New to here? Join us
                        </Link>
                        <br />
                        <Link to="/ContactUs" className="anchorEl">
                            Facing issues? Contact us.
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
