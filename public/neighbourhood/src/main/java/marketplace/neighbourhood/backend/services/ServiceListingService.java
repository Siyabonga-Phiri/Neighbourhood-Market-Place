package marketplace.neighbourhood.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import marketplace.neighbourhood.backend.dto.ServiceListingDto;
import marketplace.neighbourhood.backend.entities.ProviderDetails;
import marketplace.neighbourhood.backend.entities.Persona;
import marketplace.neighbourhood.backend.entities.ServiceListing;
import marketplace.neighbourhood.backend.repositories.ProviderProfileRepository;
import marketplace.neighbourhood.backend.repositories.ServiceListingRepository;

@Service
public class ServiceListingService {

    @Autowired
    private ServiceListingRepository serviceRepository;

    @Autowired
    private ProviderProfileRepository providerRepository;

    // CREATE SERVICE
    public ServiceListing createService(Long providerId, ServiceListingDto dto) {

        ProviderDetails provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        ServiceListing service = new ServiceListing();

        service.setTitle(dto.getTitle());
        service.setDescription(dto.getDescription());
        service.setCategory(dto.getCategory());
        service.setPrice(dto.getPrice());
        service.setLocation(dto.getLocation());
        service.setAvailable(true);

        // ✅ SOURCE OF TRUTH = Persona.id
        service.setProviderUserId(provider.getUser().getId());

        System.out.println("PROVIDER USER ID: " + provider.getUser().getId());
        System.out.println("SAVED SERVICE PROVIDER ID: " + service.getProviderUserId());

        return serviceRepository.save(service);
    }

    // GET ALL
    public List<ServiceListingDto> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    // GET BY CATEGORY
    public List<ServiceListingDto> getByCategory(String category) {
        return serviceRepository.findByCategory(category)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    // GET BY PROVIDER USER ID
    public List<ServiceListingDto> getByProvider(Long providerUserId) {
        return serviceRepository.findByProviderUserId(providerUserId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    // DELETE
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    // =========================
    // FIXED DTO MAPPER
    // =========================
    private ServiceListingDto convertToDto(ServiceListing service) {

        ServiceListingDto dto = new ServiceListingDto();

        dto.setId(service.getId());
        dto.setTitle(service.getTitle());
        dto.setDescription(service.getDescription());
        dto.setCategory(service.getCategory());
        dto.setPrice(service.getPrice());
        dto.setLocation(service.getLocation());
        dto.setAvailable(service.isAvailable());

        // ✅ ALWAYS SAFE (never null if DB is correct)
        dto.setProviderId(service.getProviderUserId());

        // =========================
        // OPTIONAL ENRICHMENT BLOCK
        // =========================
        try {
            ProviderDetails provider = providerRepository
                    .findByUserId(service.getProviderUserId())
                    .orElse(null);

            if (provider != null && provider.getUser() != null) {

                Persona user = provider.getUser();

                dto.setProviderName(user.getFirstName() + " " + user.getLastName());
                dto.setProviderPhoneNumber(user.getPhoneNumber());
                dto.setProviderCategory(provider.getCategory());
                dto.setYearsExperience(provider.getYearsExperience());
                dto.setProviderVerified(Boolean.TRUE.equals(provider.getVerified()));
            }

        } catch (Exception e) {
            // 🔒 NEVER break feed if enrichment fails
            System.out.println("Provider enrichment failed: " + e.getMessage());
        }

        return dto;
    }
    // UPDATE SERVICE
public ServiceListing updateService(Long id, ServiceListingDto dto) {

    ServiceListing service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));

    service.setTitle(dto.getTitle());
    service.setDescription(dto.getDescription());
    service.setCategory(dto.getCategory());
    service.setPrice(dto.getPrice());
    service.setLocation(dto.getLocation());
    service.setAvailable(dto.isAvailable());

    // IMPORTANT:
    // Do NOT change providerUserId here.
    // A service should always belong to the same provider.

    return serviceRepository.save(service);
}
}