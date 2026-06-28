package marketplace.neighbourhood.backend.admin;

import marketplace.neighbourhood.backend.entities.Persona;
import marketplace.neighbourhood.backend.entities.Request;
import marketplace.neighbourhood.backend.entities.Role;

import marketplace.neighbourhood.backend.repositories.UserRepository;
import marketplace.neighbourhood.backend.repositories.RequestRepository;
import marketplace.neighbourhood.backend.repositories.BookingRepository;
import marketplace.neighbourhood.backend.repositories.ServiceListingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceListingRepository serviceListingRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public AdminDashboardDTO getDashboardStats() {

        long users = userRepository.count();

        List<Persona> allUsers = userRepository.findAll();

        long providers = allUsers.stream()
                .filter(u -> u.getRole() == Role.ROLE_PROVIDER)
                .count();

        long services = serviceListingRepository.count();

        long requests = requestRepository.count();

        long bookings = bookingRepository.count();

        return new AdminDashboardDTO(
                users,
                providers,
                services,
                requests,
                bookings
        );
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
        requestRepository.deleteById(id);
    
}
}