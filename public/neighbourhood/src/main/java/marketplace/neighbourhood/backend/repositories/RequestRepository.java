package marketplace.neighbourhood.backend.repositories;

import marketplace.neighbourhood.backend.entities.Request;
import marketplace.neighbourhood.backend.entities.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByUser_Id(Long userId);
long countByUser_Id(Long userId);
long countByUser_IdAndStatus(Long userId, RequestStatus status);
List<Request> findByStatus(RequestStatus status);
}