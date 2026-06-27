package marketplace.neighbourhood.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import marketplace.neighbourhood.backend.dto.ServiceListingDto;
import marketplace.neighbourhood.backend.entities.ServiceListing;
import marketplace.neighbourhood.backend.services.ServiceListingService;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceListingService service;

    // CREATE service
    @PostMapping("/{providerId}")
    public ServiceListing createService(
            @PathVariable Long providerId,
            @RequestBody ServiceListingDto serviceDTO) {

        return service.createService(providerId, serviceDTO);
    }

    // GET all services
    @GetMapping
    public List<ServiceListingDto> getAllServices() {
        return service.getAllServices();
    }

    // GET by category
    @GetMapping("/category/{category}")
    public List<ServiceListingDto> getByCategory(
            @PathVariable String category) {

        return service.getByCategory(category);
    }

    // GET by provider
    @GetMapping("/provider/{providerId}")
    public List<ServiceListingDto> getByProvider(
            @PathVariable Long providerId) {

        return service.getByProvider(providerId);
    }

    // UPDATE service
    @PutMapping("/{id}")
    public ServiceListing updateService(
            @PathVariable Long id,
            @RequestBody ServiceListingDto serviceDTO) {

        return service.updateService(id, serviceDTO);
    }

    // DELETE service
    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        service.deleteService(id);
    }
}