package com.ieung.receipt.service.security;


import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.CrewRepository;
import com.ieung.receipt.service.CrewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailService implements UserDetailsService {

    private final CrewRepository crewRepository;

    @Override
    public UserDetails loadUserByUsername(String userPk) {
        Crew crew = null;
        try {
            crew = crewRepository.findById(Long.valueOf(userPk)).orElseThrow(() -> new ApiMessageException("존재하지 않는 회원정보입니다."));
        } catch (Exception e){
            e.printStackTrace();
        }

        return crew;
    }
}
