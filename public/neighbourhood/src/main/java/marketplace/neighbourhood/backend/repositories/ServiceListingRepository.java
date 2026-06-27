package marketplace.neighbourhood.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import marketplace.neighbourhood.backend.entities.ServiceListing;

@Repository
public interface ServiceListingRepository extends JpaRepository<ServiceListing, Long> {

    List<ServiceListing> findByCategory(String category);

    // ✅ NEW CORRECT FIELD (Persona.id = providerUserId)
    List<ServiceListing> findByProviderUserId(Long providerUserId);
}