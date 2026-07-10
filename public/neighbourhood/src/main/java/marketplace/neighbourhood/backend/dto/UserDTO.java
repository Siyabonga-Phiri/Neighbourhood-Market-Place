package marketplace.neighbourhood.backend.dto;

import marketplace.neighbourhood.backend.entities.Persona;
import marketplace.neighbourhood.backend.entities.ProviderDetails;

public class UserDTO {

    public Long id;
    public String email;
    public String phoneNumber;
    public String role;
    public String firstName;
    public String lastName;

    public ProviderDetails providerDetails;
    public String profileImage;
    public String bio;

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
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole().name();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();

        this.providerDetails = provider;
        this.profileImage = user.getProfileImage();
        this.bio = user.getBio();

        this.acceptedBookings = acceptedBookings;
        this.totalBookings = totalBookings;

        this.totalRequests = totalRequests;
        this.closedRequests = closedRequests;
    }
}