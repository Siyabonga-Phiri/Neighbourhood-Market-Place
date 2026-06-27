package marketplace.neighbourhood.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.persistence.Table;

@Entity
@Table(
    name = "bookings",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"provider_id", "request_id"})
    }
)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime bookingTime;

    @Column(length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Persona customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id", nullable = false)
    private Persona provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    private ServiceListing service;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;

    @PrePersist
    public void init() {
        this.bookingTime = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public String getNotes() {
        return notes;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public Persona getCustomer() {
        return customer;
    }

    public Persona getProvider() {
        return provider;
    }

    public ServiceListing getService() {
        return service;
    }

    public Request getRequest() {
        return request;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setCustomer(Persona customer) {
        this.customer = customer;
    }

    public void setProvider(Persona provider) {
        this.provider = provider;
    }

    public void setService(ServiceListing service) {
        this.service = service;
    }

    public void setRequest(Request request) {
        this.request = request;
    }
}