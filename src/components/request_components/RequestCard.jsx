import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

import "../styles/RequestCard.css";

export default function RequestCard({ request, onDelete }) {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
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
                `${import.meta.env.VITE_API_URL}/api/bookings/request/${request.id}`
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
                `${import.meta.env.VITE_API_URL}/api/bookings/${requestOwnerId}/${user.id}/${request.id}`,
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
            `${import.meta.env.VITE_API_URL}/api/bookings/${id}/accept`,
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
            `${import.meta.env.VITE_API_URL}/api/bookings/${id}/reject`,
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
            `${import.meta.env.VITE_API_URL}/api/requests/${request.id}/user/${user.id}`,
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
            `${import.meta.env.VITE_API_URL}/api/requests/${request.id}/user/${user.id}`,
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

        {/* IMAGE */}

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

        {/* CONTENT */}

        <div className="request-content">

            {/* TOP BAR */}

            <div className="request-top">

                <span
                    className={`status-badge ${
                        isClosed ? "closed" : "open"
                    }`}
                >
                    {isClosed ? "Completed" : "Open"}
                </span>

                {isOwner && (

                    <div className="more-actions">

                        <button
                            className="more-btn"
                            onClick={() =>
                                setShowMenu(!showMenu)
                            }
                        >
                            ⋮
                        </button>

                        {showMenu && (

                            <div className="actions-menu">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/requests/edit/${request.id}`
                                        )
                                    }
                                >
                                    Edit Request
                                </button>

                                {!isClosed && !isAccepted && (

                                    <button
                                        onClick={closeRequest}
                                    >
                                        Close Request
                                    </button>

                                )}

                                <button
                                    className="delete-action"
                                    onClick={deleteRequest}
                                >
                                    Delete Request
                                </button>

                            </div>

                        )}

                    </div>

                )}

            </div>

            {/* TITLE */}

            <h2 className="request-title">

                {request.title}

            </h2>

            {/* DESCRIPTION */}

            <p className="request-description">

                {request.description}

            </p>

            {/* DETAILS */}

            <div className="request-details">

                <div className="detail-item">

                    <span className="detail-label">
                        Budget
                    </span>

                    <strong>
                        R{request.budget}
                    </strong>

                </div>
<div className="detail-item">

    <span className="detail-label">
        Posted
    </span>

    <strong>
        {request.createdAt
            ? new Date(request.createdAt).toLocaleDateString()
            : "Recently"}
    </strong>

</div>

                <div className="detail-item">

                    <span className="detail-label">
                        Location
                    </span>

                    <strong>
                        {request.location}
                    </strong>

                </div>

                <div className="detail-item">

                    <span className="detail-label">
                        Posted By
                    </span>

                    <strong>

                        {request.user?.firstName ||
                            request.user?.name ||
                            "Comminuty Member "}

                    </strong>

                </div>

            </div>

            {/* MAIN ACTION */}

            <div className="request-footer">

                <button
                    className="profile-btn"
                    onClick={() =>
                        navigate(`/profile/${requestOwnerId}`)
                    }
                >
                    View Client Profile
                </button>

            </div>

            {/* PROVIDER PROPOSAL */}

            {isProvider &&
                !isOwner &&
                !isClosed &&
                !alreadyResponded &&
                !isAccepted && (

                    <div className="proposal-section">

                        <h4>
                            Send Proposal
                        </h4>

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
                            {loading
                                ? "Sending..."
                                : "Send Proposal"}
                        </button>

                    </div>

                )}

            {/* ACCEPTED PROVIDER */}

            {isOwner &&
                acceptedBooking &&
                providerPhone && (

                    <div className="responses-section">

                        <h4>
                            Selected Provider
                        </h4>

                        <div className="response-item">

                            <strong>

                                {providerName}

                            </strong>

                            <p>

                                {providerPhone}

                            </p>

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

            {/* RESPONSES */}

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

                                <strong>

                                    {r.provider?.name ||
                                        r.provider?.firstName}

                                </strong>

                                <p>

                                    {r.notes}

                                </p>

                                <p>

                                    Status :
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

        </div>

    </div>

);

}