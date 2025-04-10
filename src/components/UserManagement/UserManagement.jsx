import React, { useState, useEffect } from "react";
import "./UserManagement.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [adminDetails, setAdminDetails] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    contact: "",
    email: "",
    username: "",
    license: "",
  });

  // Fetch users and adminDetails from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, adminRes] = await Promise.all([
          fetch("http://localhost:3000/users"),
          fetch("http://localhost:3000/adminDetails"),
        ]);
        const [userData, adminData] = await Promise.all([
          userRes.json(),
          adminRes.json(),
        ]);
        setUsers(userData);
        setAdminDetails(adminData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch users/admin data.");
      }
    };

    fetchData();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Validation rules
  const validateForm = () => {
    const { name, contact, email, username, license } = newUser;

    if (!name || !contact || !email || !username || !license) {
      toast.error("Please fill in all fields");
      return false;
    }

    if (!/^\d{10}$/.test(contact)) {
      toast.error("Contact must be a 10-digit number");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!/^[a-zA-Z0-9]{10}$/.test(license)) {
      toast.error("License must be 10 alphanumeric characters");
      return false;
    }

    const isUsernameExists = users.some((user) => user.username === username) ||
                             adminDetails.some((admin) => admin.username === username);

    if (isUsernameExists) {
      toast.error("Username already exists");
      return false;
    }

    return true;
  };

  // Add user
  const handleAddUser = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Date.now().toString(), ...newUser }),
      });
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
      setNewUser({ name: "", contact: "", email: "", username: "", license: "" });
      toast.success("User added successfully");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="adminUserManangement">
      <AdminNavbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="userManagementConatiner">
        <h2 className="adminUserManagementHeader">Admin User Management</h2>
        <table border="1" className="userManagementMainTable">
          <thead className="userManagementTable">
            <tr>
              <th className="userManagementTable">Name</th>
              <th className="userManagementTable">Contact</th>
              <th className="userManagementTable">Email</th>
              <th className="userManagementTable">Username</th>
              <th className="userManagementTable">License</th>
              <th className="userManagementTable">Actions</th>
            </tr>
          </thead>
          <tbody className="userManagementTable">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="userManagementTable">{user.name}</td>
                <td className="userManagementTable">{user.contact}</td>
                <td className="userManagementTable">{user.email}</td>
                <td className="userManagementTable">{user.username}</td>
                <td className="userManagementTable">{user.license}</td>
                <td className="userManagementTable">
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="addNewUserConatainer">
          <h3 className="addNewUserHead">Add New User</h3>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="addNewUserInput"
          />
          <input
            type="text"
            placeholder="Contact"
            value={newUser.contact}
            onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
            className="addNewUserInput"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="addNewUserInput"
          />
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="addNewUserInput"
          />
          <input
            type="text"
            placeholder="License"
            value={newUser.license}
            onChange={(e) => setNewUser({ ...newUser, license: e.target.value })}
            className="addNewUserInput"
          />
          <button onClick={handleAddUser}>Add User</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
