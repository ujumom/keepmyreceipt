package com.ieung.receipt.config.security;

import com.ieung.receipt.dto.res.TokenResDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider { // JWT 토큰을 생성 및 검증 모듈

    // application yml 설정파일에 설정한 값 사용
    @Value("${spring.jwt.secret}")
    private String secretKey;

    private long accessTokenValidMilisecond = 1000L * 60 * 60 * 24 ; // 1일만 토큰 유효
    private long refreshTokenValidMilisecond = 1000L * 60 * 60 * 24 * 7; // 7일만 토큰 유효

    private final UserDetailsService userDetailsService;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    // Jwt 토큰 생성
    public TokenResDTO createToken(String userPk, List<String> roles) {
        Date now = new Date();

        // accessToken 생성
        Claims claims = Jwts.claims().setSubject(userPk);
        claims.put("roles", roles);
        claims.put("userPk", userPk);
        String accessToken = Jwts.builder()
                                .setClaims(claims) // 데이터
                                .setIssuedAt(now) // 토큰 발행일자
                                .setExpiration(new Date(now.getTime() + accessTokenValidMilisecond)) // set Expire Time
                                .signWith(SignatureAlgorithm.HS256, secretKey) // 암호화 알고리즘, secret값 세팅
                                .compact();

        // refreshToken 생성
        String refreshToken = Jwts.builder()
                                .setIssuedAt(now) // 토큰 발행일자
                                .setExpiration(new Date(now.getTime() + refreshTokenValidMilisecond)) // set Expire Time
                                .signWith(SignatureAlgorithm.HS256, secretKey) // 암호화 알고리즘, secret값 세팅
                                .compact();

        return TokenResDTO.builder().accessToken(accessToken).refreshToken(refreshToken).build();
    }

    // Jwt 토큰으로 인증 정보를 조회
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUserPk(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // Jwt 토큰에서 회원 구별 정보 추출
    public String getUserPk(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    // Request의 Header에서 token 파싱
    public String resolveToken(HttpServletRequest req) {
        String token = req.getHeader("Authorization");
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }

    // Jwt 토큰의 유효성 + 만료일자 확인
    public boolean validateToken(String jwtToken) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public List<String> getUserRoles(String token) {
        return (List<String>)Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("roles");
    }
}
