import React, { useState, useEffect } from "react";
import "./ManageEmployeeDashboard.css";
import ManagerNavbar from "../ManagerNavbar/ManagerNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageEmployeeDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [managerParkingStation, setManagerParkingStation] = useState("");
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        role: "",
        contact: "",
    });

    const username = localStorage.getItem("managerUsername");

    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const response = await fetch("http://localhost:3000/managers");
                const managers = await response.json();

                const loggedInManager = managers.find(
                    (manager) => manager.username === username
                );

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
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:3000/cityLocations");
                const cityLocations = await response.json();

                let parkingStationEmployees = [];
                cityLocations.forEach((city) => {
                    const parkingStation = city.parkingStations.find(
                        (station) => station.name === managerParkingStation
                    );
                    if (parkingStation && parkingStation.employees) {
                        parkingStationEmployees = parkingStation.employees;
                    }
                });

                setEmployees(parkingStationEmployees);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        if (managerParkingStation) {
            fetchEmployees();
        }
    }, [managerParkingStation]);

    const handleRemoveEmployee = async (employeeName) => {
        try {
            const response = await fetch("http://localhost:3000/cityLocations");
            const cityLocations = await response.json();
    
            // Loop through each city location
            for (const cityItem of cityLocations) {
                const updatedStations = cityItem.parkingStations.map((station) => {
                    if (station.name === managerParkingStation) {
                        const filteredEmployees = station.employees.filter(
                            (emp) => emp.name !== employeeName
                        );
                        return { ...station, employees: filteredEmployees };
                    }
                    return station;
                });
    
                const updatedCity = { ...cityItem, parkingStations: updatedStations };
    
                // Send PUT to update this specific cityLocation by ID
                await fetch(`http://localhost:3000/cityLocations/${cityItem.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCity),
                });
            }
    
            // Update frontend state
            setEmployees((prev) => prev.filter((emp) => emp.name !== employeeName));
            toast.success(`${employeeName} has been removed successfully.`);
        } catch (error) {
            console.error("Error removing employee:", error);
            toast.error("Failed to remove employee.");
        }
    };
    

    const handleEditRole = async (employeeName, newRole) => {
        try {
            const response = await fetch("http://localhost:3000/cityLocations");
            const cityLocations = await response.json();
    
            for (const city of cityLocations) {
                const updatedStations = city.parkingStations.map((station) => {
                    if (station.name === managerParkingStation) {
                        const updatedEmployees = station.employees.map((emp) =>
                            emp.name === employeeName ? { ...emp, role: newRole } : emp
                        );
                        return { ...station, employees: updatedEmployees };
                    }
                    return station;
                });
    
                const updatedCity = { ...city, parkingStations: updatedStations };
    
                await fetch(`http://localhost:3000/cityLocations/${city.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCity),
                });
            }
    
            // Update frontend state
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.name === employeeName ? { ...emp, role: newRole } : emp
                )
            );
    
            toast.success(`Role updated for ${employeeName} to ${newRole}.`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role.");
        }
    };
    

    const handleAddEmployee = () => {
        setShowAddEmployeeModal(true);
    };

    const handleSubmitEmployee = async () => {
        if (newEmployee.name && newEmployee.role && newEmployee.contact) {
            try {
                const managerDetails = JSON.parse(localStorage.getItem("managerDetails"));
                const managerCity = managerDetails?.city;
                const managerParkingStation = managerDetails?.parkingStationName;
    
                if (!managerCity || !managerParkingStation) {
                    toast.error("Manager details are missing in localStorage.");
                    return;
                }
    
                const response = await fetch("http://localhost:3000/cityLocations");
                const cityLocations = await response.json();
    
                const targetCity = cityLocations.find(
                    (city) => city.city.trim().toLowerCase() === managerCity.trim().toLowerCase()
                );
    
                if (!targetCity) {
                    console.error("City not found:", managerCity);
                    toast.error(`City "${managerCity}" not found.`);
                    return;
                }
    
                const updatedStations = targetCity.parkingStations.map((station) => {
                    if (
                        station.name.trim().toLowerCase() === managerParkingStation.trim().toLowerCase()
                    ) {
                        return {
                            ...station,
                            employees: [...(station.employees || []), newEmployee],
                        };
                    }
                    return station;
                });
    
                const updatedCity = {
                    ...targetCity,
                    parkingStations: updatedStations,
                };
    
                const putResponse = await fetch(`http://localhost:3000/cityLocations/${targetCity.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCity),
                });
    
                if (!putResponse.ok) {
                    throw new Error(`Server responded with ${putResponse.status}`);
                }
    
                setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
                toast.success(`Employee ${newEmployee.name} added successfully!`);
                setShowAddEmployeeModal(false);
                setNewEmployee({ name: "", role: "", contact: "" });
    
            } catch (error) {
                console.error("Error adding employee:", error);
                toast.error("Failed to add employee.");
            }
        } else {
            toast.warning("Please fill all the fields.");
        }
    };
    
    
    
    

    const handleCloseModal = () => {
        setShowAddEmployeeModal(false);
        setNewEmployee({ name: "", role: "", contact: "" });
    };

    return (
        <div className="containerManageEmployee">
            <ManagerNavbar />
            <div className="managerContainer">
                <h1 className="manageEmployeeHeader">Manage Employees</h1>
                <button className="addEmployeeButton" onClick={handleAddEmployee}>
                    Add New Employee
                </button>

                {showAddEmployeeModal && (
                    <div className="addNewEmployeeContainer">
                        <h2>Add New Employee</h2>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={newEmployee.name}
                                onChange={(e) =>
                                    setNewEmployee({ ...newEmployee, name: e.target.value })
                                }
                                className="newEmployeeInput"
                            />
                        </label>
                        <label>
                            Role:
                            <select
                                value={newEmployee.role}
                                onChange={(e) =>
                                    setNewEmployee({ ...newEmployee, role: e.target.value })
                                }
                                className="newEmployeeInput"
                            >
                                <option value="" className="newEmployeeInput">Select Role</option>
                                <option value="Manager" className="newEmployeeInput">Manager</option>
                                <option value="Staff" className="newEmployeeInput">Staff</option>
                                <option value="Security" className="newEmployeeInput">Security</option>
                            </select>
                        </label>
                        <label>
                            Contact:
                            <input
                                type="text"
                                value={newEmployee.contact}
                                onChange={(e) =>
                                    setNewEmployee({ ...newEmployee, contact: e.target.value })
                                }
                                className="newEmployeeInput"
                            />
                        </label>
                        <div className="addNewEmployeeButton">
                            <button
                                onClick={handleSubmitEmployee}
                                className="addButtonManageEmmployee"
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="addButtonManageEmmployee"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="card-container">
                    {employees.length > 0 ? (
                        employees.map((employee, index) => (
                            <div key={index} className="cardEmployee">
                                <p><strong>Name:</strong> {employee.name}</p>
                                <p><strong>Role:</strong> {employee.role}</p>
                                <p><strong>Contact:</strong> {employee.contact}</p>
                                <div className="button-containerEmployee">
                                    <button
                                        className="button"
                                        onClick={() => handleRemoveEmployee(employee.name)}
                                    >
                                        Remove Employee
                                    </button>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            const newRole = prompt(
                                                `Enter new role for ${employee.name}:`
                                            );
                                            if (newRole) {
                                                handleEditRole(employee.name, newRole);
                                            }
                                        }}
                                    >
                                        Edit Role
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No employees to display.</p>
                    )}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageEmployeeDashboard;
