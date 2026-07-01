import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../styles/RequestCard.css";

export default function RequestCard({ request, onDelete }) {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [responses, setResponses] = useState([]);
    const [proposal, setProposal] = useState("");

    const requestOwnerId =
        request.user?.id || request.userId;

    const isClosed =
        request.status === "CLOSED";

    const isProvider =
        user?.role === "ROLE_PROVIDER";

    const isOwner =
        user?.id === requestOwnerId;

    // ============================
    // FETCH BOOKINGS
    // ============================

    const fetchResponses = async () => {

        if (!request?.id) return;

        try {

            const res = await fetch(
                `http://localhost:8081/api/bookings/request/${request.id}`
            );

            const data = await res.json();

            setResponses(data);

        } catch (err) {
            console.error(err);
        }

    };

    useEffect(() => {
        fetchResponses();
    }, [request.id]);

    // ============================
    // ACCEPTED BOOKING
    // ============================

    const acceptedBooking = useMemo(() => {
        return responses.find(r => r.status === "ACCEPTED") || null;
    }, [responses]);

    const provider = acceptedBooking?.provider || null;

    const providerPhone =
        provider?.phone ||
        provider?.phoneNumber ||
        null;

    const providerName =
        provider?.name ||
        provider?.firstName ||
        "Provider";

    // ============================
    // CHECKS
    // ============================

    const alreadyResponded = useMemo(() => {
        return responses.some(
            r => r.provider?.userId === user?.id
        );
    }, [responses, user]);

    const isAccepted = !!acceptedBooking;

    // ============================
    // SEND PROPOSAL
    // ============================

    const respondToRequest = async () => {

        if (!proposal.trim() || loading || alreadyResponded)
            return;

        setLoading(true);

        try {

            const res = await fetch(
                `http://localhost:8081/api/bookings/${requestOwnerId}/${user.id}/${request.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        notes: proposal
                    })
                }
            );

            if (!res.ok) {

                alert("Failed to send proposal");

                return;
            }

            setProposal("");

            await fetchResponses();

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    // ============================
    // ACCEPT
    // ============================

    const acceptProvider = async (id) => {

        await fetch(
            `http://localhost:8081/api/bookings/${id}/accept`,
            {
                method: "PUT"
            }
        );

        await fetchResponses();

    };

    // ============================
    // REJECT
    // ============================

    const rejectProvider = async (id) => {

        await fetch(
            `http://localhost:8081/api/bookings/${id}/reject`,
            {
                method: "PUT"
            }
        );

        await fetchResponses();

    };

    // ============================
    // CLOSE REQUEST
    // ============================

    const closeRequest = async () => {

        await fetch(
            `http://localhost:8081/api/requests/${request.id}/user/${user.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...request,
                    status: "CLOSED"
                })
            }
        );

        await fetchResponses();

    };

    // ============================
    // DELETE REQUEST
    // ============================

    const deleteRequest = async () => {

        const confirmDelete = window.confirm(
            "Delete this request?"
        );

        if (!confirmDelete) return;

        await fetch(
            `http://localhost:8081/api/requests/${request.id}/user/${user.id}`,
            {
                method: "DELETE"
            }
        );

        if (onDelete) {

            onDelete(request.id);

        }

    };

    return (

        <div className="request-card">

            {/* LEFT IMAGE */}

            <div className="request-image">

                {request.imageURL ? (

                    <img
                        src={request.imageURL}
                        alt={request.title}
                    />

                ) : (

                    <div className="request-placeholder">

                        📷

                    </div>

                )}

            </div>

            {/* RIGHT CONTENT */}

            <div className="request-content">

                {/* HEADER */}

                <div className="request-header">

                    <span className="request-badge">
                        REQUEST
                    </span>

                    <span
                        className={`status-badge ${
                            isClosed ? "closed" : "open"
                        }`}
                    >
                        {isClosed ? "CLOSED" : "OPEN"}
                    </span>

                </div>

                {/* TITLE */}

                <h3>
                    {request.title}
                </h3>

                {/* INFO ROW */}

                <div className="request-meta">

                    <span>
                        🛠 {request.service}
                    </span>

                    <span>
                        📍 {request.location}
                    </span>

                    <span>
                        💰 R{request.budget}
                    </span>

                </div>

                {/* DESCRIPTION */}

                <p className="request-description">
                    {request.description}
                </p>

                {/* BUTTON ROW */}

                <div className="request-actions">

                    <button
                        className="profile-btn"
                        onClick={() =>
                            navigate(`/profile/${requestOwnerId}`)
                        }
                    >
                        View Client Profile
                    </button>

                    {isOwner && (

                        <div className="owner-actions">

                            <button
                                onClick={() =>
                                    navigate(
                                        `/requests/edit/${request.id}`
                                    )
                                }
                            >
                                ✏️ Edit
                            </button>

                            <button
                                onClick={deleteRequest}
                            >
                                🗑 Delete
                            </button>

                        </div>

                    )}

                </div>
                                {/* =========================
                    PROVIDER RESPONSE
                ========================= */}
                {isProvider &&
                    !isOwner &&
                    !isClosed &&
                    !alreadyResponded &&
                    !isAccepted && (

                        <div className="proposal-section">

                            <h4>Send Proposal</h4>

                            <textarea
                                placeholder="Describe how you can help..."
                                value={proposal}
                                onChange={(e) =>
                                    setProposal(e.target.value)
                                }
                            />

                            <button
                                className="respond-btn"
                                onClick={respondToRequest}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Respond"}
                            </button>

                        </div>

                    )}

                {/* =========================
                    ACCEPTED PROVIDER
                ========================= */}
                {isOwner &&
                    acceptedBooking &&
                    providerPhone && (

                        <div className="responses-section">

                            <h4>✅ Provider Selected</h4>

                            <div className="response-item">

                                <p>
                                    <strong>{providerName}</strong>
                                </p>

                                <p>{providerPhone}</p>

                                <a
                                    href={`https://wa.me/${providerPhone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button className="whatsapp-btn">
                                        Chat on WhatsApp
                                    </button>
                                </a>

                            </div>

                        </div>

                    )}

                {/* =========================
                    PROVIDER PROPOSALS
                ========================= */}

                {isOwner &&
                    responses.length > 0 && (

                        <div className="responses-section">

                            <h4>
                                Provider Proposals
                            </h4>

                            {responses.map((r) => (

                                <div
                                    key={r.id}
                                    className="response-item"
                                >

                                    <p>
                                        <strong>
                                            {r.provider?.name ||
                                                r.provider?.firstName}
                                        </strong>
                                    </p>

                                    <p>
                                        {r.notes}
                                    </p>

                                    <p>
                                        Status:
                                        {" "}
                                        <strong>
                                            {r.status}
                                        </strong>
                                    </p>

                                    {r.status === "PENDING" &&
                                        !isClosed &&
                                        !isAccepted && (

                                            <div className="response-actions">

                                                <button
                                                    className="accept-btn"
                                                    onClick={() =>
                                                        acceptProvider(r.id)
                                                    }
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={() =>
                                                        rejectProvider(r.id)
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        )}

                                </div>

                            ))}

                        </div>

                    )}

                {/* =========================
                    CLOSE REQUEST
                ========================= */}

                {isOwner &&
                    !isClosed &&
                    !isAccepted && (

                        <button
                            className="close-request-btn"
                            onClick={closeRequest}
                        >
                            Close Request
                        </button>

                    )}

            </div>

        </div>

    );

}