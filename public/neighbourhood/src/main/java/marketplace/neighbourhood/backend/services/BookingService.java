package marketplace.neighbourhood.backend.services;

import marketplace.neighbourhood.backend.dto.BookingDTO;
import marketplace.neighbourhood.backend.dto.SimpleUserDTO;
import marketplace.neighbourhood.backend.entities.*;
import marketplace.neighbourhood.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    // CREATE BOOKING
    public BookingDTO createBooking(Long userId, Long providerId, Long requestId, String notes) {

        Persona user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Persona provider = userRepository.findById(providerId)
        .orElseThrow(() -> new RuntimeException("Provider not found"));

userRepository.flush(); // force sync
provider = userRepository.findById(providerId).get(); // re-fetch fresh state

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (providerId.equals(userId)) {
            throw new RuntimeException("Cannot respond to your own request");
        }

        if (request.getStatus() == RequestStatus.CLOSED) {
            throw new RuntimeException("Request is closed");
        }

        if (bookingRepository.existsByProvider_IdAndRequest_Id(providerId, requestId)) {
            throw new RuntimeException("Already responded");
        }

        Booking booking = new Booking();
        booking.setCustomer(user);
        booking.setProvider(provider);
        booking.setRequest(request);
        booking.setNotes(notes);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return toDTO(saved);
    }

    // CLIENT BOOKINGS
    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByCustomer_Id(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // PROVIDER BOOKINGS
    public List<BookingDTO> getProviderBookings(Long providerId) {
        return bookingRepository.findByProvider_Id(providerId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // REQUEST BOOKINGS
    public List<BookingDTO> getRequestBookings(Long requestId) {
        return bookingRepository.findByRequest_Id(requestId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ACCEPT
public BookingDTO acceptBooking(Long bookingId) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    Request request = booking.getRequest();

    if (request.getStatus() == RequestStatus.CLOSED) {
        throw new RuntimeException("Already closed");
    }

    booking.setStatus(BookingStatus.ACCEPTED);
    Booking saved = bookingRepository.save(booking);

    // =========================
    // SET REQUEST SNAPSHOT DATA
    // =========================
    request.setStatus(RequestStatus.CLOSED);
    request.setAcceptedProvider(saved.getProvider());

    // =========================
    // SAFE PHONE EXTRACTION (YOUR CHANGE APPLIED HERE)
    // =========================
    String phone = saved.getProvider().getPhoneNumber();

    if (phone == null || phone.isBlank()) {
        throw new RuntimeException("Provider phone is NULL — data issue for providerId: "
                + saved.getProvider().getId());
    }

    request.setAcceptedProviderPhone(phone);

    // IMPORTANT: persist request snapshot
    requestRepository.save(request);

    // =========================
    // REJECT OTHER BOOKINGS
    // =========================
    List<Booking> all = bookingRepository.findByRequest_Id(request.getId());

    for (Booking b : all) {
        if (!b.getId().equals(saved.getId())) {
            b.setStatus(BookingStatus.REJECTED);
            bookingRepository.save(b);
        }
    }

    

    return toDTO(saved);
}

    // REJECT
    public BookingDTO rejectBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.REJECTED);

        return toDTO(bookingRepository.save(booking));
    }

    // DTO MAPPER (SAFE)
    private BookingDTO toDTO(Booking b) {

    BookingDTO dto = new BookingDTO();

    dto.id = b.getId();
    dto.notes = b.getNotes();
    dto.status = b.getStatus();
    dto.bookingTime = b.getBookingTime();

    dto.requestId = b.getRequest().getId();
    dto.requestTitle = b.getRequest().getTitle();

    if (b.getCustomer() != null) {
        dto.customer = new SimpleUserDTO(
            b.getCustomer().getId(),
            b.getCustomer().getFirstName(),
            b.getCustomer().getPhoneNumber()
        );
    }

    if (b.getProvider() != null) {

    dto.provider = new SimpleUserDTO(
        b.getProvider().getId(),
        b.getProvider().getFirstName(),
        b.getProvider().getPhoneNumber()
    );

    dto.providerName =
        b.getProvider().getFirstName();

    dto.providerPhone =
        b.getProvider().getPhoneNumber();
}

    return dto;
}
}