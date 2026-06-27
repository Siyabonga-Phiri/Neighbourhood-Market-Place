package marketplace.neighbourhood.backend.repositories;



import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import marketplace.neighbourhood.backend.entities.ProviderDetails;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderDetails, Long> {

    Optional<ProviderDetails> findByUserId(Long userId);

    List<ProviderDetails> findByCategory(String category);

    List<ProviderDetails> findByProviderType(String providerType);

}