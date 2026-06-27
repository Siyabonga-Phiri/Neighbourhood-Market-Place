package marketplace.neighbourhood.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import marketplace.neighbourhood.backend.entities.ProviderDetails;
import marketplace.neighbourhood.backend.services.ProviderProfileService;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderProfileService providerService;

    // CREATE provider profile
    @PostMapping("/register/{userId}")
    public ProviderDetails createProvider(
            @PathVariable Long userId,
            @RequestBody ProviderDetails providerProfile) {
        return providerService.createProvider(userId, providerProfile);
    }

    // GET all providers
    @GetMapping
    public List<ProviderDetails> getAllProviders() {
        return providerService.getAllProviders();
    }

    // GET provider by ID
    @GetMapping("/{id}")
    public ProviderDetails getProviderById(@PathVariable Long id) {
        return providerService.getProviderById(id);
    }

    // GET provider by user ID
    @GetMapping("/user/{userId}")
    public ProviderDetails getProviderByUserId(@PathVariable Long userId) {
        return providerService.getProviderByUserId(userId);
    }

    // FILTER by category
    @GetMapping("/category/{category}")
    public List<ProviderDetails> getByCategory(@PathVariable String category) {
        return providerService.getProvidersByCategory(category);
    }

    // FILTER by type
    @GetMapping("/type/{type}")
    public List<ProviderDetails> getByType(@PathVariable String type) {
        return providerService.getProvidersByType(type);
    }

    // DELETE provider
    @DeleteMapping("/{id}")
    public void deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
    }
}