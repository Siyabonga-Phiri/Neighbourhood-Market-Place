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

  // 🔥 OWNERSHIP CHECK (safer fallback)
  const providerOwnerId =
    provider.providerId ||
    provider.providerUserId ||
    provider.id;

  const isOwner = currentUserId === providerOwnerId;

  return (
    <div className="provider-card">

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

        {/* 🔥 CLICKABLE PROVIDER NAME */}
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

        {/* WhatsApp */}
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

        {/* 🔥 OWNER ONLY BUTTONS */}
        {isOwner && (
          <div className="owner-actions">

            <button
              className="edit-btn"
              onClick={() => navigate(`/services/edit/${providerOwnerId}`)}
            >
              ✏️ Edit Service
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(providerOwnerId)}
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