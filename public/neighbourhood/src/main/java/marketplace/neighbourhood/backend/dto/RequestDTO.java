package marketplace.neighbourhood.backend.dto;

import java.time.LocalDate;

public class RequestDTO {

    public Long id;

    public String title;
    public String service;
    public String description;
    public String location;
    public String budget;
    public LocalDate dateNeeded;

    // ✅ FIXED: aligned with the rest of the project
    public String imageURL;

    public String status;

    // CLIENT (owner of request)
    public Long userId;
    public String userName;
    public String userPhone;

    // ACCEPTED PROVIDER (when request is closed)
    public Long acceptedProviderId;
    public String acceptedProviderName;
    public String acceptedProviderPhone;

    public RequestDTO() {}

    public RequestDTO(
            Long id,
            String title,
            String service,
            String description,
            String imageURL,
            String location,
            String budget,
            LocalDate dateNeeded,
            String status,
            Long userId,
            String userName,
            String userPhone,
            Long acceptedProviderId,
            String acceptedProviderName,
            String acceptedProviderPhone
    ) {
        this.id = id;
        this.title = title;
        this.service = service;
        this.description = description;
        this.imageURL = imageURL;
        this.location = location;
        this.budget = budget;
        this.dateNeeded = dateNeeded;
        this.status = status;

        this.userId = userId;
        this.userName = userName;
        this.userPhone = userPhone;

        this.acceptedProviderId = acceptedProviderId;
        this.acceptedProviderName = acceptedProviderName;
        this.acceptedProviderPhone = acceptedProviderPhone;
    }
}