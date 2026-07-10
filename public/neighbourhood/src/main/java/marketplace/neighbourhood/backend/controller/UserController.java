package marketplace.neighbourhood.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;

import marketplace.neighbourhood.backend.security.JwtUtil;
import marketplace.neighbourhood.backend.dto.AuthResponse;
import marketplace.neighbourhood.backend.dto.LoginRequest;
import marketplace.neighbourhood.backend.dto.UserDTO;
import marketplace.neighbourhood.backend.entities.Persona;
import marketplace.neighbourhood.backend.entities.Role;
import marketplace.neighbourhood.backend.repositories.UserRepository;
import marketplace.neighbourhood.backend.repositories.ProviderProfileRepository;
import marketplace.neighbourhood.backend.services.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://neighbourhood-market-place-production.up.railway.app"
})
public class UserController {

    private final JwtUtil jwtUtil = new JwtUtil();

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerRepository;

    @Autowired
    private UserService userService;

    public UserController(UserRepository userRepository,
                          ProviderProfileRepository providerRepository) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
    }

    // =====================================================
    // CREATE USER
    // =====================================================
    @PostMapping
    public Persona createUser(@RequestBody Persona user) {

        // Phone number is required
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            throw new RuntimeException("Phone number is required.");
        }

        // Prevent duplicate phone numbers
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("Phone number is already registered.");
        }

        // Prevent duplicate emails (only if one was supplied)
        if (user.getEmail() != null &&
                !user.getEmail().isBlank() &&
                userRepository.existsByEmailIgnoreCase(user.getEmail())) {

            throw new RuntimeException("Email address is already registered.");
        }

        user.setRole(Role.ROLE_USER);

        return userRepository.save(user);
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================
    @GetMapping
    public List<Persona> getUsers() {
        return userRepository.findAll();
    }

    // =====================================================
    // LOGIN (EMAIL OR PHONE NUMBER)
    // =====================================================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        Optional<Persona> optionalUser =
                userRepository.findByEmailIgnoreCase(request.getIdentifier());

        if (optionalUser.isEmpty()) {
            optionalUser =
                    userRepository.findByPhoneNumber(request.getIdentifier());
        }

        Persona user = optionalUser.orElseThrow(
                () -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(token);
    }


// =====================================================
// CURRENT USER
// =====================================================
@GetMapping("/me")
public UserDTO getCurrentUser() {

    Object principal = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();

    Long userId;

    if (principal instanceof Long) {
        userId = (Long) principal;
    } else {
        userId = Long.valueOf(principal.toString());
    }

    return userService.getCurrentUser(userId);
}
    // =====================================================
    // PUBLIC PROFILE
    // =====================================================
    @GetMapping("/profile/{userId}")
    public UserDTO getProfile(@PathVariable Long userId) {
        return userService.getUserProfile(userId);
    }

    // =====================================================
    // UPDATE PROFILE IMAGE
    // =====================================================
    @PutMapping("/profile-image/{id}")
    public Persona updateProfileImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Persona user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfileImage(body.get("profileImage"));

        return userRepository.save(user);
    }

    // =====================================================
    // UPDATE PROFILE BIO
    // =====================================================
    @PutMapping("/profile/{id}")
    public Persona updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Persona user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBio(body.get("bio"));

        return userRepository.save(user);
    }
}