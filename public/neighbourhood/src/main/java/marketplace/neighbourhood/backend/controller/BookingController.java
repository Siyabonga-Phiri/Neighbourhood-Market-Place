package marketplace.neighbourhood.backend.controller;

import marketplace.neighbourhood.backend.dto.BookingDTO;
import marketplace.neighbourhood.backend.services.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // =====================================================
    // CREATE BOOKING (FIXED SAFE INPUT)
    // =====================================================
    public static class BookingRequest {
        public String notes;
    }

    @PostMapping("/{userId}/{providerId}/{requestId}")
    public BookingDTO createBooking(
            @PathVariable Long userId,
            @PathVariable Long providerId,
            @PathVariable Long requestId,
            @RequestBody BookingRequest body
    ) {
        return bookingService.createBooking(
                userId,
                providerId,
                requestId,
                body != null ? body.notes : null
        );
    }

    // =====================================================
    // CLIENT VIEW
    // =====================================================
    @GetMapping("/user/{userId}")
    public List<BookingDTO> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }

    // =====================================================
    // PROVIDER VIEW
    // =====================================================
    @GetMapping("/provider/{providerId}")
    public List<BookingDTO> getProviderBookings(@PathVariable Long providerId) {
        return bookingService.getProviderBookings(providerId);
    }

    // =====================================================
    // REQUEST VIEW
    // =====================================================
    @GetMapping("/request/{requestId}")
    public List<BookingDTO> getRequestBookings(@PathVariable Long requestId) {
        return bookingService.getRequestBookings(requestId);
    }

    // =====================================================
    // ACCEPT
    // =====================================================
    @PutMapping("/{bookingId}/accept")
    public BookingDTO acceptBooking(@PathVariable Long bookingId) {
        return bookingService.acceptBooking(bookingId);
    }

    // =====================================================
    // REJECT
    // =====================================================
    @PutMapping("/{bookingId}/reject")
    public BookingDTO rejectBooking(@PathVariable Long bookingId) {
        return bookingService.rejectBooking(bookingId);
    }
}