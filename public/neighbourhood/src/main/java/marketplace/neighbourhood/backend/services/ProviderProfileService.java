package marketplace.neighbourhood.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import marketplace.neighbourhood.backend.entities.Persona;
import marketplace.neighbourhood.backend.entities.ProviderDetails;
import marketplace.neighbourhood.backend.repositories.ProviderProfileRepository;
import marketplace.neighbourhood.backend.repositories.UserRepository;
import marketplace.neighbourhood.backend.entities.Role;

@Service
public class ProviderProfileService {

    @Autowired
    private ProviderProfileRepository providerRepository;

    @Autowired
    private UserRepository userRepository;

   @Transactional
public ProviderDetails createProvider(Long userId, ProviderDetails providerProfile) {

    Persona user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (providerRepository.findByUserId(userId).isPresent()) {
        throw new RuntimeException("User already has a provider profile");
    }

    providerProfile.setUser(user);

    ProviderDetails saved = providerRepository.save(providerProfile);

    // 🔥 upgrade role ONLY in DB
    user.setRole(Role.ROLE_PROVIDER);
    userRepository.save(user);

    return saved;
}
    public List<ProviderDetails> getAllProviders() {
        return providerRepository.findAll();
    }

    public ProviderDetails getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    public ProviderDetails getProviderByUserId(Long userId) {
        return providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    public List<ProviderDetails> getProvidersByCategory(String category) {
        return providerRepository.findByCategory(category);
    }

    public List<ProviderDetails> getProvidersByType(String providerType) {
        return providerRepository.findByProviderType(providerType);
    }

    public void deleteProvider(Long id) {

        ProviderDetails provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        providerRepository.delete(provider);
    }
}