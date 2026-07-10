package marketplace.neighbourhood.backend.repositories;

import marketplace.neighbourhood.backend.entities.Persona;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Persona, Long> {
     Optional<Persona> findByEmailIgnoreCase(String email);
     Optional<Persona> findByPhoneNumber(String phoneNumber);
     boolean existsByPhoneNumber(String phoneNumber);

boolean existsByEmailIgnoreCase(String email);
}