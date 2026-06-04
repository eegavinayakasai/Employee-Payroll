package com.employee_payroll.Employee.security;

import com.employee_payroll.Employee.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil
{
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    private SecretKey getSigningKey()
    {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
     public String generateToken(String username, String role)
     {
         Map<String, Object> claims = new HashMap<>();
         claims.put("role", role);

         return Jwts.builder()
                 .claims(claims)
                 .subject(username)
                 .issuedAt(new Date())
                 .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                 .signWith(getSigningKey())
                 .compact();
     }
     public String extractUsername(String token)
     {
         return extractAllClaims(token).getSubject();
     }

      private boolean isTokenExpired(String token)
      {
          return extractAllClaims(token).getExpiration().before(new Date());
      }

      public boolean validateToken(String token, String username)
      {
          String extractedUsername =  extractUsername(token);
          return username.equals(extractedUsername) && !isTokenExpired(token);
      }
     public Claims extractAllClaims(String token)
     {
         return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                 .getPayload();
     }
}
