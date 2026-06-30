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

    // ================================
    // FETCH BOOKINGS
    // ================================
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

    // ================================
    // ACCEPTED BOOKING
    // ================================
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

    // ================================
    // CHECKS
    // ================================
    const alreadyResponded = useMemo(() => {
        return responses.some(r => r.provider?.userId === user?.id);
    }, [responses, user]);

    const isAccepted = !!acceptedBooking;

    // ================================
    // SEND PROPOSAL
    // ================================
    const respondToRequest = async () => {

        if (!proposal.trim() || loading || alreadyResponded) return;

        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:8081/api/bookings/${requestOwnerId}/${user.id}/${request.id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes: proposal })
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

    // ================================
    // ACCEPT
    // ================================
    const acceptProvider = async (id) => {

        await fetch(
            `http://localhost:8081/api/bookings/${id}/accept`,
            { method: "PUT" }
        );

        await fetchResponses();
    };

    // ================================
    // REJECT
    // ================================
    const rejectProvider = async (id) => {

        await fetch(
            `http://localhost:8081/api/bookings/${id}/reject`,
            { method: "PUT" }
        );

        await fetchResponses();
    };

    // ================================
    // CLOSE REQUEST (SAFE VERSION)
    // ================================
    const closeRequest = async () => {

        await fetch(
            `http://localhost:8081/api/requests/${request.id}/user/${user.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...request,
                    status: "CLOSED"
                })
            }
        );

        await fetchResponses();
    };

    // ================================
    // DELETE REQUEST
    // ================================
    const deleteRequest = async () => {

        const confirm = window.confirm("Delete this request?");

        if (!confirm) return;

        await fetch(
            `http://localhost:8081/api/requests/${request.id}/user/${user.id}`,
            { method: "DELETE" }
        );

        if (onDelete) onDelete(request.id);
    };

    return (
        <div className="request-card">

            <div className="request-header">
                <span className="request-badge">REQUEST</span>

                <span className={`status-badge ${isClosed ? "closed" : "open"}`}>
                    {isClosed ? "CLOSED" : "OPEN"}
                </span>
            </div>

            <h3>{request.title}</h3>
            {request.imageURL && (
    <img
        src={request.imageURL}
        alt={request.title}
        style={{
            width: "100%",
            maxHeight: "220px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "10px"
        }}
    />
)}
            <p>{request.service}</p>
            <p>{request.location}</p>
            <p>Budget: R{request.budget}</p>
            <p>{request.description}</p>

            <button onClick={() => navigate(`/profile/${requestOwnerId}`)}>
                View Client Profile
            </button>

            {/* =========================
                OWNER ACTIONS
            ========================= */}
            {isOwner && (
                <div className="owner-actions">

                    <button onClick={() => navigate(`/requests/edit/${request.id}`)}>
                        ✏️ Edit
                    </button>

                    <button onClick={deleteRequest}>
                        🗑 Delete
                    </button>

                </div>
            )}

            {/* =========================
                PROVIDER RESPONSE
            ========================= */}
            {isProvider && !isOwner && !isClosed && !alreadyResponded && !isAccepted && (
                <div>
                    <h4>Send proposal</h4>

                    <textarea
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                    />

                    <button onClick={respondToRequest} disabled={loading}>
                        {loading ? "Sending..." : "Respond"}
                    </button>
                </div>
            )}

            {/* =========================
                ACCEPTED
            ========================= */}
            {isOwner && acceptedBooking && providerPhone && (
                <div className="responses-section">

                    <h4>Provider Selected</h4>

                    <p>{providerName}</p>
                    <p>{providerPhone}</p>

                    <a
                        href={`https://wa.me/${providerPhone}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button>Chat on WhatsApp</button>
                    </a>

                </div>
            )}

            {/* =========================
                PROPOSALS
            ========================= */}
            {isOwner && responses.length > 0 && (
                <div className="responses-section">

                    <h4>Provider Proposals</h4>

                    {responses.map(r => (
                        <div key={r.id} className="response-item">

                            <p>
                                <strong>Provider:</strong>{" "}
                                {r.provider?.name || r.provider?.firstName}
                            </p>

                            <p>{r.notes}</p>

                            <p>Status: {r.status}</p>

                            {r.status === "PENDING" && !isClosed && !isAccepted && (
                                <div>
                                    <button onClick={() => acceptProvider(r.id)}>Accept</button>
                                    <button onClick={() => rejectProvider(r.id)}>Reject</button>
                                </div>
                            )}

                        </div>
                    ))}

                </div>
            )}

            {/* CLOSE */}
            {isOwner && !isClosed && !isAccepted && (
                <button onClick={closeRequest}>
                    Close Request
                </button>
            )}

        </div>
    );
}