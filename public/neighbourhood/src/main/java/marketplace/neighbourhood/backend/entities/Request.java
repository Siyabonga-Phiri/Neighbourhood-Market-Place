package marketplace.neighbourhood.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String service;
    private LocalDate dateNeeded;
    private String description;
    private String location;
    private String budget;

    // ✅ FIXED: aligned with Services naming convention
    private String imageURL;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.OPEN;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private Persona user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "accepted_provider_id")
    private Persona acceptedProvider;

    private String acceptedProviderPhone;

    public Request() {}

    // ======================
    // GETTERS & SETTERS
    // ======================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public LocalDate getDateNeeded() {
        return dateNeeded;
    }

    public void setDateNeeded(LocalDate dateNeeded) {
        this.dateNeeded = dateNeeded;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Persona getUser() {
        return user;
    }

    public void setUser(Persona user) {
        this.user = user;
    }

    public Persona getAcceptedProvider() {
        return acceptedProvider;
    }

    public void setAcceptedProvider(Persona acceptedProvider) {
        this.acceptedProvider = acceptedProvider;
    }

    public String getAcceptedProviderPhone() {
        return acceptedProviderPhone;
    }

    public void setAcceptedProviderPhone(String acceptedProviderPhone) {
        this.acceptedProviderPhone = acceptedProviderPhone;
    }
}