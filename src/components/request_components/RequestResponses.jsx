import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RequestResponses() {

    const { requestId } = useParams();

    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [requestStatus, setRequestStatus] = useState("OPEN");


    // FETCH RESPONSES
    const fetchResponses = async () => {

        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:8081/api/bookings/request/${requestId}`
            );

            if (!response.ok) {
                console.error("Failed to load responses");
                return;
            }

            const data = await response.json();
            setResponses(data);

            // detect if request is effectively closed
            const accepted = data.find(r => r.status === "ACCEPTED");
            if (accepted) {
                setRequestStatus("CLOSED");
            }

        } catch (error) {
            console.error("Error fetching responses:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchResponses();
    }, [requestId]);


    // ACCEPT PROVIDER
    const acceptOffer = async (bookingId) => {

        try {

            setProcessingId(bookingId);

            const response = await fetch(
                `http://localhost:8081/api/bookings/${bookingId}/accept`,
                { method: "PUT" }
            );

            if (!response.ok) {
                alert("Failed to accept provider");
                return;
            }

            await fetchResponses();

        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };


    // REJECT PROVIDER
    const rejectOffer = async (bookingId) => {

        try {

            setProcessingId(bookingId);

            const response = await fetch(
                `http://localhost:8081/api/bookings/${bookingId}/reject`,
                { method: "PUT" }
            );

            if (!response.ok) {
                alert("Failed to reject provider");
                return;
            }

            await fetchResponses();

        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };


    if (loading) {
        return <p>Loading responses...</p>;
    }


    return (
        <div className="responses-container">

            {/* HEADER STATE */}
            <div className="request-status-banner">
                {requestStatus === "CLOSED" ? (
                    <h3>🟢 Deal Closed — You are now in business</h3>
                ) : (
                    <h3>🟡 Awaiting client decision</h3>
                )}
            </div>


            <h2>Provider Responses</h2>


            {responses.length === 0 ? (
                <p>No providers have responded yet.</p>
            ) : (

                responses.map((res) => {

                    const isAccepted = res.status === "ACCEPTED";
                    const isProcessing = processingId === res.id;

                    return (
                        <div key={res.id} className="response-card">

                            {/* PROVIDER */}
                            <h3>
                                {res.provider?.firstName} {res.provider?.lastName}
                            </h3>

                            <p>{res.notes}</p>

                            {/* STATUS */}
                            <p>
                                Status: <b>{res.status}</b>
                            </p>

                            {/* ACCEPTED HIGHLIGHT */}
                            {isAccepted && (
                                <div className="accepted-highlight">
                                    ✔ This provider is now assigned
                                </div>
                            )}

                            {/* ACTIONS */}
                            {res.status === "PENDING" && requestStatus !== "CLOSED" && (
                                <div className="response-actions">

                                    <button
                                        onClick={() => acceptOffer(res.id)}
                                        disabled={isProcessing}
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => rejectOffer(res.id)}
                                        disabled={isProcessing}
                                    >
                                        Reject
                                    </button>

                                </div>
                            )}

                        </div>
                    );

                })

            )}

        </div>
    );
}