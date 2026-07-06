import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/authContext";

import "./styles/PostRequest.css";

function PostRequest() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [imageFile, setImageFile] = useState(null);

    const [request, setRequest] = useState({
        title: "",
        dateNeeded: "",
        description: "",
        location: "",
        budget: "",
        imageURL: ""      // ✅ NEW
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

                setRequest({
                    ...data,
                    imageURL: data.imageURL || ""
                });

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
    // UPLOAD IMAGE
    // =========================
    const uploadImage = async () => {

        if (!imageFile) return request.imageURL;

        const formData = new FormData();
        formData.append("image", imageFile);

        try {

            const res = await fetch(
                "http://localhost:8081/api/upload/image",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            return data.imageUrl;

        } catch (err) {

            console.error("Image upload failed", err);
            return "";
        }
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!user) {
            alert("Please login first");
            return;
        }

        try {

            // Upload first
            const uploadedImageURL = await uploadImage();

            const finalRequest = {
                ...request,
                imageURL: uploadedImageURL || request.imageURL
            };

            console.log("REQUEST PAYLOAD:", finalRequest);

            const url = isEditMode
                ? `http://localhost:8081/api/requests/${id}/user/${user.id}`
                : `http://localhost:8081/api/requests/${user.id}`;

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(finalRequest)
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

                    {/* IMAGE */}
                    <label>Attach Image</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />

                    {request.imageURL && (
                        <img
                            src={request.imageURL}
                            alt="Preview"
                            style={{
                                width: "100%",
                                maxWidth: "250px",
                                marginTop: "10px",
                                borderRadius: "8px"
                            }}
                        />
                    )}

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