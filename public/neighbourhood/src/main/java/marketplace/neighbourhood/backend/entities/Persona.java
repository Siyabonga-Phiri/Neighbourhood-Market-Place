package marketplace.neighbourhood.backend.entities;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
//import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String location;

@Column(unique = true)
    private String phoneNumber;

    @Column(name = "profile_picture")
    private String profileImage;
    private String bio;
  
    @Column(nullable = false)
    private String password;

    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @JsonIgnore
    @OneToOne(mappedBy = "user", fetch = FetchType.EAGER)
    private ProviderDetails providerDetails;

    @JsonIgnore
@OneToMany(mappedBy = "user")
private List<Request> requests;

    @PrePersist
    protected void onCreate() {
        dateCreated = LocalDateTime.now();
    }

    // GETTERS & SETTERS


    public String getPhoneNumber() {
    return phoneNumber;
}

public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public ProviderDetails getProviderDetails() {
        return providerDetails;
    }

    public void setProviderDetails(ProviderDetails providerDetails) {
        this.providerDetails = providerDetails;
    }

    public List<Request> getRequests() {
    return requests;
}

public void setRequests(List<Request> requests) {
    this.requests = requests;
}
public String getBio() {
    return bio;
}


public void setBio(String bio) {
    this.bio = bio;
}
}