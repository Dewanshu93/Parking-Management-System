import React, { useState, useEffect } from "react";
import "./ManageAdmins.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [editingAdmin, setEditingAdmin] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/adminDetails")
      .then((response) => response.json())
      .then((data) => setAdmins(data))
      .catch((error) => {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      });
  }, []);

  const handleAddAdmin = async () => {
    const { username, password } = newAdmin;

    if (!username || !password) {
      toast.warning("Please enter both username and password.");
      return;
    }

    const isUsernameExists = admins.some((admin) => admin.username === username);

    if (isUsernameExists) {
      toast.error("Username already exists. Please choose a different one.");
      return;
    }

    const newAdminData = { ...newAdmin, id: Date.now().toString() };

    try {
      const response = await fetch("http://localhost:3000/adminDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdminData),
      });

      if (response.ok) {
        setAdmins([...admins, newAdminData]);
        setNewAdmin({ username: "", password: "" });
        toast.success("Admin added successfully!");
      } else {
        toast.error("Failed to add admin.");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("An error occurred while adding the admin.");
    }
  };

  const handleEditAdmin = async (id) => {
    if (!editingAdmin.username || !editingAdmin.password) {
      toast.warning("Username and password cannot be empty.");
      return;
    }

    const isDuplicate = admins.some(
      (admin) => admin.username === editingAdmin.username && admin.id !== id
    );

    if (isDuplicate) {
      toast.error("Username already taken by another admin.");
      return;
    }

    const updatedAdmins = admins.map((admin) =>
      admin.id === id ? editingAdmin : admin
    );

    try {
      const response = await fetch(`http://localhost:3000/adminDetails/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAdmin),
      });

      if (response.ok) {
        setAdmins(updatedAdmins);
        setEditingAdmin(null);
        toast.success("Admin updated successfully!");
      } else {
        toast.error("Failed to update admin.");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("An error occurred while updating the admin.");
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/adminDetails/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAdmins(admins.filter((admin) => admin.id !== id));
        toast.success("Admin deleted successfully.");
      } else {
        toast.error("Failed to delete admin.");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("An error occurred while deleting the admin.");
    }
  };

  return (
    <div className="manageAdmins">
      <AdminNavbar />
      <div className="manageAdminsMainContainer">
        <h2 className="manageAdminsMainHead">Manage Admins</h2>

        <div className="manageAdminsCardContainer">
          <h3>Add New Admin</h3>
          <input
            type="text"
            placeholder="Username"
            value={newAdmin.username}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, password: e.target.value })
            }
          />
          <button onClick={handleAddAdmin}>Add Admin</button>
        </div>

        <div className="manageAdminsListContainer">
          <h3>Admin List</h3>
          <ul className="manageAdminsList">
            {admins.map((admin) => (
              <li key={admin.id} className="manageAdminsListData">
                {editingAdmin?.id === admin.id ? (
                  <>
                    <input
                      type="text"
                      value={editingAdmin.username}
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          username: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      value={editingAdmin.password}
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          password: e.target.value,
                        })
                      }
                    />
                    <button onClick={() => handleEditAdmin(admin.id)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {admin.username}
                    <button onClick={() => setEditingAdmin(admin)}>Edit</button>
                    <button onClick={() => handleDeleteAdmin(admin.id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ManageAdmins;
