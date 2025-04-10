import React, { useState, useEffect } from "react";
import "./ManageReview.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageReview = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [adminReply, setAdminReply] = useState("");

  // Fetch reviews from db.json
  useEffect(() => {
    fetch("http://localhost:3000/ratings")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  // Remove review from backend
  const removeReview = (id) => {
    fetch(`http://localhost:3000/ratings/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete review");
        setReviews(reviews.filter((review) => review.id !== id));
        toast.success("Review removed successfully!");
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
        toast.error("Failed to remove review");
      });
  };

  // Save admin reply to backend
  const saveReply = (id) => {
    fetch(`http://localhost:3000/ratings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminReply }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save reply");
        return res.json();
      })
      .then((updatedReview) => {
        const updatedReviews = reviews.map((r) =>
          r.id === id ? { ...r, adminReply: updatedReview.adminReply } : r
        );
        setReviews(updatedReviews);
        setEditingReplyId(null);
        setAdminReply("");
        toast.success("Reply saved!");
      })
      .catch((err) => {
        console.error("Error saving reply:", err);
        toast.error("Failed to save reply");
      });
  };

  return (
    <div className="manageReviewAdmin">
      <AdminNavbar />
      <div className="reviewContainerAdmin">
        <h1 style={{ color: "yellow", fontSize: "32px" }}>Manage User Reviews</h1>
        <div className="reviewMainContainerAdmin">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="reviewCardAdmin">
                <h3><strong>Username:</strong> {review.username}</h3>
                <p><strong>Name:</strong> {review.reviewer.name}</p>
                <p><strong>Designation:</strong> {review.reviewer.designation}</p>
                <p style={{ textAlign: "start" }}><strong>Review:</strong> {review.comment}</p>
                <p><strong>Rating:</strong> {review.rating} ⭐</p>

                {review.adminReply ? (
                  <p><strong>Admin Reply:</strong> {review.adminReply}</p>
                ) : editingReplyId === review.id ? (
                  <>
                    <textarea
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="adminReplyTextarea"
                    />
                    <button onClick={() => saveReply(review.id)} className="adminReviewButton">
                      Save Reply
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingReplyId(review.id);
                      setAdminReply("");
                    }}
                    className="adminReviewButton"
                  >
                    Add Reply
                  </button>
                )}

                <button onClick={() => removeReview(review.id)} className="adminReviewButton">
                  Remove Review
                </button>
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageReview;
