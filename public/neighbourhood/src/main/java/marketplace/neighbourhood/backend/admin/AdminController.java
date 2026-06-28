package marketplace.neighbourhood.backend.admin;

import marketplace.neighbourhood.backend.entities.Persona;
import marketplace.neighbourhood.backend.entities.ServiceListing;
import marketplace.neighbourhood.backend.entities.Booking;
import marketplace.neighbourhood.backend.entities.Request;

import marketplace.neighbourhood.backend.repositories.UserRepository;
import marketplace.neighbourhood.backend.repositories.ServiceListingRepository;
import marketplace.neighbourhood.backend.repositories.BookingRepository;
import marketplace.neighbourhood.backend.repositories.RequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceListingRepository serviceListingRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RequestRepository requestRepository;

    // =========================
    // DASHBOARD
    // =========================
    @GetMapping("/dashboard")
    public AdminDashboardDTO getDashboardStats() {
        return adminService.getDashboardStats();
    }

    // =========================
    // USERS
    // =========================
    @GetMapping("/users")
    public List<Persona> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // =========================
    // SERVICES
    // =========================
    @GetMapping("/services")
    public List<ServiceListing> getAllServices() {
        return serviceListingRepository.findAll();
    }

    @DeleteMapping("/services/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceListingRepository.deleteById(id);
    }

    // =========================
    // BOOKINGS
    // =========================
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @DeleteMapping("/bookings/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
    }

    // =========================
    // REQUESTS
    // =========================
    @GetMapping("/requests")
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    @DeleteMapping("/requests/{id}")
public void deleteRequest(@PathVariable Long id) {

    Request request = requestRepository.findById(id).orElse(null);
    if (request == null) return;

    bookingRepository.deleteByRequest(request);

    requestRepository.delete(request);
}
}