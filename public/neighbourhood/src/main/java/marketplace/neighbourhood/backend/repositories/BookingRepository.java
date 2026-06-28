package marketplace.neighbourhood.backend.repositories;

import marketplace.neighbourhood.backend.entities.Booking;
import marketplace.neighbourhood.backend.entities.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import marketplace.neighbourhood.backend.entities.Request;

import java.util.List;
//import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

   List<Booking> findByCustomer_Id(Long customerId);
List<Booking> findByProvider_Id(Long providerId);
List<Booking> findByRequest_Id(Long requestId);
void deleteByRequest(Request request);

int countByCustomer_IdAndStatus(Long customerId, BookingStatus status);
int countByProvider_IdAndStatus(Long providerId, BookingStatus status);

boolean existsByProvider_IdAndRequest_Id(Long providerId, Long requestId);
}