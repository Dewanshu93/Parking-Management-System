import React from "react";
import { useForm } from "react-hook-form";
import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            if (!data.email.endsWith("@gmail.com")) {
                toast.error("Invalid Email Address. Please use a @gmail.com email.");
                return;
            }

            const getResponse = await fetch("http://localhost:3000/users");
            const getData = await getResponse.json();

            const existingUser = getData.find(
                (eachData) => eachData.username === data.username
            );

            if (!existingUser) {
                const response = await fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    toast.success("User registered successfully!", {
                        autoClose: 2000,
                    });
                    setTimeout(() => navigate("/login"), 2500);
                } else {
                    toast.error("Failed to register the user.");
                }
            } else {
                toast.error("Username already exists. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2500);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="mainContainerSIgnUp">
            <ToastContainer />
            <div className="centerContainer2">
                <h1 className="head2">
                    Park <span className="King">King</span>
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        className="input1"
                        placeholder="Please Enter Your Name"
                        {...register("name", { required: "Name field is required." })}
                    />
                    {errors.name && <p className="error">{errors.name.message}</p>}

                    <input
                        type="text"
                        className="input1"
                        placeholder="Please Enter Your Contact Number"
                        {...register("contact", {
                            required: "Contact number is required.",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Contact must be exactly 10 digits.",
                            },
                        })}
                    />
                    {errors.contact && <p className="error">{errors.contact.message}</p>}

                    <input
                        type="text"
                        className="input1"
                        placeholder="Please Enter Your Email Address"
                        {...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                message: "Only @gmail.com emails are allowed.",
                            },
                        })}
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}

                    <input
                        type="text"
                        className="input1"
                        placeholder="Please Enter Username"
                        {...register("username", {
                            required: "Username field is required.",
                            minLength: {
                                value: 4,
                                message: "Username must be at least 4 characters.",
                            },
                        })}
                    />
                    {errors.username && <p className="error">{errors.username.message}</p>}

                    <input
                        type="text"
                        className="input1"
                        placeholder="Please Enter License Number"
                        {...register("license", {
                            required: "License number is required.",
                            pattern: {
                                value: /^[a-zA-Z0-9]{10}$/,
                                message: "License must be 10 alphanumeric characters.",
                            },
                        })}
                    />
                    {errors.license && <p className="error">{errors.license.message}</p>}

                    <input
                        type="password"
                        className="input1"
                        placeholder="Please enter password"
                        {...register("password", {
                            required: "Password field is required.",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters.",
                            },
                        })}
                    />
                    {errors.password && <p className="error">{errors.password.message}</p>}

                    <br />
                    <button className="btn1" type="submit">Sign Up</button>
                    <br />
                </form>
                <Link to="/login" className="anchorEl2">
                    Already a User? Login
                </Link>
            </div>
        </div>
    );
};

export default SignUpPage;
