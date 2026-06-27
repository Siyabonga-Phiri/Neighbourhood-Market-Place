package marketplace.neighbourhood.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import marketplace.neighbourhood.backend.entities.Persona;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET =
            "my_super_secret_key_my_super_secret_key_123456";

    private static final long EXPIRATION =
            1000 * 60 * 60 * 24; // 24 hours

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Generate token
    public String generateToken(Persona user) {

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    // Extract role (✅ NEW)
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}