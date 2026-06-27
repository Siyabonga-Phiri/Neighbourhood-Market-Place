package marketplace.neighbourhood.backend.dto;

import marketplace.neighbourhood.backend.entities.Persona;
import marketplace.neighbourhood.backend.entities.ProviderDetails;

public class UserDTO {

    public Long id;
    public String email;
    public String role;

    public ProviderDetails providerDetails;

    // BOOKINGS
    public long acceptedBookings;
    public long totalBookings;

    // REQUESTS
    public long totalRequests;
    public long closedRequests;

    public UserDTO(
            Persona user,
            ProviderDetails provider,
            long acceptedBookings,
            long totalBookings,
            long totalRequests,
            long closedRequests
    ) {

        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.providerDetails = provider;

        this.acceptedBookings = acceptedBookings;
        this.totalBookings = totalBookings;

        this.totalRequests = totalRequests;
        this.closedRequests = closedRequests;
    }
}