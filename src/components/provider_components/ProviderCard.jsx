import { useNavigate } from "react-router-dom";

function ProviderCard({ provider, currentUserId, onDelete }) {

  const navigate = useNavigate();

  const formatWhatsAppNumber = (number) => {
    if (!number) return null;

    let cleaned = number.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = "27" + cleaned.substring(1);
    }

    return cleaned;
  };

  const whatsappNumber = formatWhatsAppNumber(provider.providerPhoneNumber);

  const isAvailable = provider.available === true;

  // =========================
  // IDs (FIXED)
  // =========================

  const serviceId = provider.id; // ✅ SERVICE ID (IMPORTANT FIX)

  const providerOwnerId =
    provider.providerId ||
    provider.providerUserId ||
    provider.id;

  const isOwner = currentUserId === providerOwnerId;

  return (
    <div className="provider-card">

      {/* ========================= */}
      {/* IMAGE */}
      {/* ========================= */}
      {provider.imageURL && (
        <div className="provider-image-container">
          <img
            src={provider.imageURL}
            alt={provider.title || "Service image"}
            className="provider-image"
          />
        </div>
      )}

      {/* HEADER */}
      <div className="provider-header">

        <h2>{provider.title || "Service"}</h2>

        {provider.providerVerified && (
          <span className="verified-badge">
            ✅ Verified
          </span>
        )}

      </div>

      {/* MAIN INFO */}
      <div className="provider-info">

        <h3
          className="provider-name-link"
          onClick={() => navigate(`/provider/${providerOwnerId}`)}
        >
          {provider.providerName}
        </h3>

        <p>{provider.description}</p>

        <p><strong>Category:</strong> {provider.category}</p>

        <p><strong>Location:</strong> {provider.location}</p>

        <p><strong>Price:</strong> R{provider.price}</p>

        <p><strong>Phone:</strong> {provider.providerPhoneNumber || "N/A"}</p>

        <p><strong>Experience:</strong> {provider.yearsExperience} years</p>

      </div>

      {/* STATUS */}
      <div className="provider-status">

        <span className={isAvailable ? "status-open" : "status-closed"}>
          {isAvailable ? "🟢 Available" : "🔴 Unavailable"}
        </span>

      </div>

      {/* CONTACT + OWNER ACTIONS */}
      <div className="provider-actions">

        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            💬 Chat on WhatsApp
          </a>
        )}

        {!isAvailable && (
          <p className="unavailable-text">
            Currently unavailable for new work
          </p>
        )}

        {isOwner && (
          <div className="owner-actions">

            {/* ========================= */}
            {/* FIXED EDIT */}
            {/* ========================= */}
            <button
              className="edit-btn"
              onClick={() => navigate(`/services/edit/${serviceId}`)}
            >
              ✏️ Edit Service
            </button>

            {/* ========================= */}
            {/* FIXED DELETE */}
            {/* ========================= */}
            <button
              className="delete-btn"
              onClick={() => onDelete(serviceId)}
            >
              🗑 Delete Service
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default ProviderCard;