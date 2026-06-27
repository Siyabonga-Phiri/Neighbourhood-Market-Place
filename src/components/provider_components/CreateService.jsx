import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateService() {

    const navigate = useNavigate();
    const { id } = useParams(); // ✅ EDIT MODE DETECTOR

    const isEditMode = Boolean(id);

    const [providerId, setProviderId] = useState(null);

    const [service, setService] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        location: "",
        available: true
    });

    // =========================
    // FETCH LOGGED IN USER
    // =========================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) return;

                const res = await fetch("http://localhost:8081/api/users/me", {
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
    // FETCH SERVICE IF EDIT MODE
    // =========================
    useEffect(() => {

        if (!isEditMode) return;

        const fetchService = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/services`);

                const data = await res.json();

                const existing = data.find(s => s.id === parseInt(id));

                if (existing) {
                    setService(existing);
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
    // SUBMIT (CREATE OR UPDATE)
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const url = isEditMode
                ? `http://localhost:8081/api/services/${id}`
                : `http://localhost:8081/api/services/${providerId}`;

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(service)
            });

            if (response.ok) {
                alert(isEditMode ? "Service updated!" : "Service created!");
                navigate("/provider/dashboard");
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

                <button type="submit">
                    {isEditMode ? "Update Service" : "Create Service"}
                </button>

            </form>

        </div>
    );
}

export default CreateService;