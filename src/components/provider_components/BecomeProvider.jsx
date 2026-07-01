import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../../api/axiosConfig";
import "../styles/PostRequest.css"

function BecomeProvider() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        category: "",
        yearsExperience: "",
        hourlyRate: "",
        bio: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await api.post(
                `/providers/register/${user.id}`,
                formData
            );

            console.log(response.data);

            // 🔥 IMPORTANT: trigger success UI instead of alert
            setSuccess(true);

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data ||
                "Failed to register as provider"
            );

        } finally {
            setLoading(false);
        }
    };

    // 🔁 handle re-login flow
    const handleContinue = () => {

        // clear auth (force re-login strategy)
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // optional: clear context if you expose logout function later

        navigate("/login", {
            state: { upgraded: true }
        });
    };

    // 🟢 SUCCESS SCREEN
    if (success) {
        return (
            <div className="success-container">
                <h1>🎉 You are now a Provider!</h1>

                <p>
                    Your provider profile has been created successfully.
                </p>

                <p>
                    To activate your provider dashboard, please sign in again.
                </p>

                <button onClick={handleContinue}>
                    Sign in to continue
                </button>
            </div>
        );
    }

    return (
        <div className="become-provider-page">

            <h1>Become a Provider</h1>

            <p>
                Tell customers about your skills and experience.
            </p>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Service Category</label>

                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Plumbing"
                        required
                    />
                </div>

                <div>
                    <label>Years of Experience</label>

                    <input
                        type="number"
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <div>
                    <label>Hourly Rate (R)</label>

                    <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <div>
                    <label>Bio</label>

                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell customers about your experience,
qualifications and why they should hire you."
                        rows="5"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Become a Provider"}
                </button>

            </form>

        </div>
    );
}

export default BecomeProvider;