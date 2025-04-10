import React, { useState, useEffect } from "react";
import "./ManageComplainAdmin.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageComplainAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [editingResponse, setEditingResponse] = useState(null);
  const [newResponse, setNewResponse] = useState("");

  // Fetch complaints from the database
  useEffect(() => {
    fetch("http://localhost:3000/complains")
      .then((response) => response.json())
      .then((data) => setComplaints(data))
      .catch((error) => {
        console.error("Error fetching complaints:", error);
        toast.error("Failed to load complaints!");
      });
  }, []);

  // Update complaint status (Resolved/Not Resolved)
  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:3000/complains/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update status");
        }
        return res.json();
      })
      .then((updatedComplaint) => {
        const updatedComplaints = complaints.map((complaint) =>
          complaint.id === id ? { ...complaint, status: updatedComplaint.status } : complaint
        );
        setComplaints(updatedComplaints);
        toast.success("Status updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        toast.error("Failed to update status!");
      });
  };

  // Start editing manager response
  const startEditingResponse = (id, currentResponse) => {
    setEditingResponse(id);
    setNewResponse(currentResponse);
  };

  // Save updated manager response
  const saveResponse = (id) => {
    fetch(`http://localhost:3000/complains/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ managerResponse: newResponse })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update response");
        }
        return res.json();
      })
      .then((updatedComplaint) => {
        const updatedComplaints = complaints.map((complaint) =>
          complaint.id === id ? { ...complaint, managerResponse: updatedComplaint.managerResponse } : complaint
        );
        setComplaints(updatedComplaints);
        setEditingResponse(null);
        toast.success("Response updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating response:", error);
        toast.error("Failed to update response!");
      });
  };

  return (
    <div className="complainManagementAdmin">
      <AdminNavbar />
      <div className="adminComplainManagementContainer">
        <h1 className="adminComplainMangementHead">Complaint Management</h1>
        <div className="complainAdminContainer">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="complaintCardAdmin">
              <h3 className="adminComplainHead">
                Complaint by: {complaint.customerName} (@{complaint.username})
              </h3>
              <p className="adminComplainHead">
                <strong>City:</strong> {complaint.city}
              </p>
              <p className="adminComplainHead">
                <strong>Parking Station:</strong> {complaint.parkingStation}
              </p>
              <p className="adminComplainHead">
                <strong>Complaint Against:</strong> {complaint.complainAgainst}
              </p>
              <p className="adminComplainHead">
                <strong>Description:</strong> {complaint.description}
              </p>

              <p className="adminComplainHead">
                <strong>Status: </strong> {complaint.status}
              </p>

              <h4 className="adminComplainHead">Manager Response:</h4>
              {editingResponse === complaint.id ? (
                <>
                  <input
                    type="text"
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    className="adminComplainHead"
                  />
                  <button onClick={() => saveResponse(complaint.id)} className="adminComplainButton">Save</button>
                </>
              ) : (
                <>
                  <p className="adminComplainHead">{complaint.managerResponse}</p>
                  <button
                    onClick={() => startEditingResponse(complaint.id, complaint.managerResponse)}
                    className="adminComplainButton"
                  >
                    Edit Response
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageComplainAdmin;
