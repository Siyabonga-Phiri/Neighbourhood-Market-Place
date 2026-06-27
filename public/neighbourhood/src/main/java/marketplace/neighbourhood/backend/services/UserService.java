package marketplace.neighbourhood.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import marketplace.neighbourhood.backend.dto.UserDTO;
import marketplace.neighbourhood.backend.entities.*;
import marketplace.neighbourhood.backend.repositories.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderProfileRepository providerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RequestRepository requestRepository;

    // =====================================================
    // CURRENT USER
    // =====================================================
    public UserDTO getCurrentUser(String email) {

        Persona user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildUserDTO(user);
    }

    // =====================================================
    // PROFILE
    // =====================================================
    public UserDTO getUserProfile(Long userId) {

        Persona user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildUserDTO(user);
    }

    // =====================================================
    // DTO BUILDER
    // =====================================================
    private UserDTO buildUserDTO(Persona user) {

        Long id = user.getId();

        ProviderDetails provider = providerRepository
                .findByUserId(id)
                .orElse(null);

        // BOOKINGS (provider side)
        long acceptedBookings = bookingRepository
                .countByProvider_IdAndStatus(id, BookingStatus.ACCEPTED);

        long totalBookings = bookingRepository
                .findByProvider_Id(id)
                .size();

        // REQUESTS (customer side)
        long totalRequests = requestRepository
                .findByUser_Id(id)
                .size();

        long closedRequests = requestRepository
                .countByUser_IdAndStatus(id, RequestStatus.CLOSED);

        return new UserDTO(
                user,
                provider,
                acceptedBookings,
                totalBookings,
                totalRequests,
                closedRequests
        );
    }

    // =====================================================
    // ALL USERS
    // =====================================================
    public List<Persona> getAllUsers() {
        return userRepository.findAll();
    }
}