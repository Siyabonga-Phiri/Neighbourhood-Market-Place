package marketplace.neighbourhood.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import marketplace.neighbourhood.backend.dto.RequestDTO;
import marketplace.neighbourhood.backend.entities.Request;
import marketplace.neighbourhood.backend.services.RequestService;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = {"http://localhost:5173", "https://neighbourhood-market-place-production.up.railway.app"})
public class RequestController {

    @Autowired
    private RequestService service;

    // =====================================================
    // CREATE REQUEST
    // =====================================================
    @PostMapping("/{userId}")
    public RequestDTO createRequest(
            @PathVariable Long userId,
            @RequestBody Request request
    ) {
     
        System.out.println("IMAGE URL RECEIVED: " + request.getImageURL());
        System.out.println("REQUEST RECEIVED: " + request.getTitle());
        return service.createRequest(userId, request);
    }

    // =====================================================
    // GET ALL REQUESTS (FEED)
    // =====================================================
    @GetMapping
    public List<RequestDTO> getAllRequests() {
        return service.getAllRequests();
    }

    // =====================================================
    // GET USER REQUESTS
    // =====================================================
    @GetMapping("/user/{userId}")
    public List<RequestDTO> getUserRequests(@PathVariable Long userId) {
        return service.getRequestsByUser(userId);
    }

    // =====================================================
    // GET SINGLE REQUEST
    // =====================================================
    @GetMapping("/{requestId}")
    public RequestDTO getRequestById(@PathVariable Long requestId) {
        return service.getRequestById(requestId);
    }

    // =====================================================
    // UPDATE REQUEST
    // =====================================================
    @PutMapping("/{requestId}/user/{userId}")
    public RequestDTO updateRequest(
            @PathVariable Long requestId,
            @PathVariable Long userId,
            @RequestBody Request request
    ) {
        System.out.println("UPDATED IMAGE URL: " + request.getImageURL());
        return service.updateRequest(requestId, userId, request);
    }

    // =====================================================
    // DELETE REQUEST
    // =====================================================
    @DeleteMapping("/{requestId}/user/{userId}")
    public void deleteRequest(
            @PathVariable Long requestId,
            @PathVariable Long userId
    ) {
        service.deleteRequest(requestId, userId);
    }
}