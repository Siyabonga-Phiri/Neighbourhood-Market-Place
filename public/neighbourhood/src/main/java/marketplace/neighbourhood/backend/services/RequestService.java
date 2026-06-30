package marketplace.neighbourhood.backend.services;

import marketplace.neighbourhood.backend.dto.RequestDTO;
import marketplace.neighbourhood.backend.entities.*;
import marketplace.neighbourhood.backend.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

     @Autowired
    private BookingRepository bookingRepository; //

    // =====================================================
    // CREATE REQUEST
    // =====================================================
    public RequestDTO createRequest(Long userId, Request request) {

        Persona user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        request.setUser(user);

        return toDTO(requestRepository.save(request));
    }

    // =====================================================
    // GET ALL REQUESTS
    // =====================================================
    public List<RequestDTO> getAllRequests() {

        return requestRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =====================================================
    // GET BY USER
    // =====================================================
    public List<RequestDTO> getRequestsByUser(Long userId) {

        return requestRepository.findByUser_Id(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =====================================================
    // GET ONE
    // =====================================================
    public RequestDTO getRequestById(Long requestId) {

        return requestRepository.findById(requestId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    // =====================================================
    // UPDATE
    // =====================================================
    public RequestDTO updateRequest(Long requestId, Long userId, Request updated) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getUser() == null ||
            !request.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        request.setTitle(updated.getTitle());
        request.setService(updated.getService());
        request.setDescription(updated.getDescription());
        request.setImageURL(updated.getImageURL());
        request.setBudget(updated.getBudget());
        request.setLocation(updated.getLocation());
        request.setDateNeeded(updated.getDateNeeded());

        return toDTO(requestRepository.save(request));
    }

    // =====================================================
    // DELETE
    // =====================================================
    @Transactional
    public void deleteRequest(Long requestId, Long userId) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getUser() == null ||
            !request.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        bookingRepository.deleteByRequest(request);
        requestRepository.delete(request);
    }

    // =====================================================
    // SAFE DTO MAPPER (THIS IS THE FIX)
    // =====================================================
    private RequestDTO toDTO(Request r) {

        if (r == null) return null;

        RequestDTO dto = new RequestDTO();

        dto.id = r.getId();
        dto.title = r.getTitle();
        dto.service = r.getService();
        dto.imageURL = r.getImageURL();
        dto.description = r.getDescription();
        dto.budget = r.getBudget();
        dto.location = r.getLocation();
        dto.dateNeeded = r.getDateNeeded();
        dto.status = r.getStatus() != null ? r.getStatus().name() : null;

        // =========================
        // CLIENT (SAFE)
        // =========================
        if (r.getUser() != null) {
            dto.userId = r.getUser().getId();
            dto.userName = r.getUser().getFirstName();
            dto.userPhone = r.getUser().getPhoneNumber();
        }

        // =========================
        // ACCEPTED PROVIDER (SAFE)
        // =========================
        if (r.getAcceptedProvider() != null) {
            dto.acceptedProviderId = r.getAcceptedProvider().getId();
            dto.acceptedProviderName = r.getAcceptedProvider().getFirstName();
            dto.acceptedProviderPhone = r.getAcceptedProvider().getPhoneNumber();
        }

        return dto;
    }
}