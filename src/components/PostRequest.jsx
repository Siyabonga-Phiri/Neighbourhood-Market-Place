import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import "./styles/PostRequest.css";

function PostRequest() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [request, setRequest] = useState({
        title: "",
        dateNeeded: "",
        description: "",
        location: "",
        budget: ""
    });

    // =========================
    // LOAD REQUEST IF EDIT MODE
    // =========================
    useEffect(() => {

        if (!isEditMode) return;

        const fetchRequest = async () => {
            try {

                const res = await fetch(
                    `http://localhost:8081/api/requests/${id}`
                );

                const data = await res.json();

                setRequest(data);

            } catch (err) {
                console.error("Failed to load request", err);
            }
        };

        fetchRequest();

    }, [id]);

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = (e) => {
        setRequest({
            ...request,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // SUBMIT (CREATE OR UPDATE)
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!user) {
            alert("Please login first");
            return;
        }

        try {

            const url = isEditMode
                ? `http://localhost:8081/api/requests/${id}/user/${user.id}`
                : `http://localhost:8081/api/requests/${user.id}`;

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                alert("Failed to save request");
                return;
            }

            alert(isEditMode ? "Request updated!" : "Request posted!");

            navigate("/feed");

        } catch (error) {
            console.error("Request save error", error);
        }
    };

    return (
        <div className="request-page">

            <h1>
                {isEditMode
                    ? "Edit Your Request"
                    : "Need help from your neighbours?"}
            </h1>

            <form className="request-card" onSubmit={handleSubmit}>

                <div className="column">

                    <label>Request Title</label>
                    <input
                        name="title"
                        value={request.title}
                        onChange={handleChange}
                    />

                    <label>Date Needed</label>
                    <input
                        type="date"
                        name="dateNeeded"
                        value={request.dateNeeded}
                        onChange={handleChange}
                    />

                    <label>Location</label>
                    <input
                        name="location"
                        value={request.location}
                        onChange={handleChange}
                    />

                    <label>Budget</label>
                    <input
                        name="budget"
                        value={request.budget}
                        onChange={handleChange}
                    />

                </div>

                <div className="column">

                    <label>Description</label>

                    <textarea
                        name="description"
                        value={request.description}
                        onChange={handleChange}
                    />

                </div>

                <button type="submit">
                    {isEditMode ? "Update Request" : "Post Request"}
                </button>

            </form>

        </div>
    );
}

export default PostRequest;