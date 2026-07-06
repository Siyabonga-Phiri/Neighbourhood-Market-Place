import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/PostRequest.css"

function CreateService() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [providerId, setProviderId] = useState(null);

    const [imageFile, setImageFile] = useState(null);

    const [service, setService] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        location: "",
        available: true,
        imageURL: ""   // ✅ FIXED: backend-consistent naming
    });

    // =========================
    // FETCH USER
    // =========================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                setProviderId(data?.providerDetails?.id || null);

            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    // =========================
    // FETCH SERVICE (EDIT MODE)
    // =========================
    useEffect(() => {

        if (!isEditMode) return;

        const fetchService = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`);
                const data = await res.json();

                const existing = data.find(s => s.id === parseInt(id));

                if (existing) {
                    setService({
                        ...existing,
                        imageURL: existing.imageURL || ""
                    });
                }

            } catch (error) {
                console.error("Failed to load service:", error);
            }
        };

        fetchService();

    }, [id]);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        setService({
            ...service,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // UPLOAD IMAGE TO CLOUDINARY
    // =========================
    const uploadImage = async () => {
        if (!imageFile) return service.imageURL;

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/image`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            return data.imageUrl; // Cloudinary response
        } catch (error) {
            console.error("Image upload failed", error);
            return "";
        }
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // 1. upload image first (if any)
            const uploadedImageURL = await uploadImage();

            const finalService = {
                ...service,
                imageURL: uploadedImageURL || service.imageURL // ✅ FIXED KEY
            };

            const url = isEditMode
                ? `${import.meta.env.VITE_API_URL}/api/services/${id}`
                : `${import.meta.env.VITE_API_URL}/api/services/${providerId}`;

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(finalService)
            });

            if (response.ok) {
                alert(isEditMode ? "Service updated!" : "Service created!");
                navigate("/");
            } else {
                alert("Failed to save service");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="create-service-container">

            <h1>
                {isEditMode ? "Edit Service" : "Create Service"}
            </h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    value={service.title}
                    onChange={handleChange}
                    placeholder="Service Title"
                    required
                />

                <textarea
                    name="description"
                    value={service.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />

                <input
                    name="category"
                    value={service.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                />

                <input
                    name="price"
                    value={service.price}
                    onChange={handleChange}
                    placeholder="Price"
                    type="number"
                    required
                />

                <input
                    name="location"
                    value={service.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                />

                {/* IMAGE INPUT */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />

                {/* PREVIEW */}
                {service.imageURL && (
                    <img
                        src={service.imageURL}
                        alt="preview"
                        style={{ width: "120px", marginTop: "10px" }}
                    />
                )}

                <button type="submit">
                    {isEditMode ? "Update Service" : "Create Service"}
                </button>

            </form>

        </div>
    );
}

export default CreateService;