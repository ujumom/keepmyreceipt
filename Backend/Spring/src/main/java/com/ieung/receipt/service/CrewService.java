package com.ieung.receipt.service;

import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.config.security.JwtTokenProvider;
import com.ieung.receipt.dto.req.LoginReqDTO;
import com.ieung.receipt.dto.req.SignUpReqDTO;
import com.ieung.receipt.dto.req.TokenReqDTO;
import com.ieung.receipt.dto.res.TokenResDTO;
import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.exception.CUserNotFoundException;
import com.ieung.receipt.repository.ClubCrewRepository;
import com.ieung.receipt.repository.CrewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static com.ieung.receipt.util.TokenUtil.getCurrentCrewId;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrewService {
    private final CrewRepository crewRepository;
    private final ClubCrewRepository clubCrewRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * crewId로 회원정보 조회
     * @param id
     * @return crew
     * @throws Exception
     */
    public Crew findCrewById(long id) throws Exception {
        Crew crew = crewRepository.findById(id).orElseThrow(() -> new CUserNotFoundException());

        return crew;
    }

    /**
     * email로 Crew 조회
     * @param email
     * @return crew
     * @throws Exception
     */
    public Crew findByEmail(String email) throws Exception {
        Crew crew = crewRepository.findByEmail(email);

        return crew;
    }

    /**
     * 회원가입
     * @param signUpReqDTO
     */
    @Transactional(readOnly = false)
    public void signUp(SignUpReqDTO signUpReqDTO) {
        // DB에 저장할 Crew Entity 세팅
        Crew crew = Crew.builder()
                .email(signUpReqDTO.getEmail())
                .password(passwordEncoder.encode(signUpReqDTO.getPassword()))
                .name(signUpReqDTO.getName())
                .roles(Collections.singletonList("ROLE_USER"))
                .build();

        Crew signUpCrew = crewRepository.save(crew);

        if (signUpCrew == null) {
            throw new ApiMessageException("회원가입에 실패했습니다. 다시 시도해 주세요.");
        }
    }

    /**
     * 회원 정보 수정 (이름)
     * @param name 바꿀 이름
     * @return crew
     * @throws Exception
     */
    @Transactional(readOnly = false)
    public void changeCrewInfo(String name) throws Exception {
        Crew crew = findCrewById(getCurrentCrewId());

        crew.updateName(name);
        crewRepository.save(crew);
    }

    /**
     * 회원 탈퇴
     * @param crewId
     */
    @Transactional(readOnly = false)
    public void deleteCrew(Long crewId) {
        // 해당 회원이 리더인 모임이 있다면 탈퇴 불가
        if (clubCrewRepository.findExistLeaderByCrewId(crewId)) {
            throw new ApiMessageException("모임의 리더는 탈퇴할 수 없습니다.");
        }

        crewRepository.deleteById(crewId);
    }
}