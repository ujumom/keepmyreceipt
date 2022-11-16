package com.ieung.receipt.service;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.code.NotiCode;
import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.entity.Club;
import com.ieung.receipt.entity.ClubCrew;
import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.entity.Notification;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.ClubCrewRepository;
import com.ieung.receipt.repository.ClubRepository;
import com.ieung.receipt.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClubCrewService {
    private final ClubCrewRepository clubCrewRepository;
    private final NotificationRepository notificationRepository;
    private final ClubRepository clubRepository;

    /**
     * 모임 가입 신청
     * @param clubId, crewId
     */
    @Transactional(readOnly = false)
    public ClubCrew joinClub(long clubId, Crew crew) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new ApiMessageException("존재하지 않는 모임입니다."));

        // 가입 여부 확인
        if (clubCrewRepository.findExistByClubIdAndCrewId(clubId, crew.getId())) {
            throw new ApiMessageException("이미 가입된 모임입니다.");
        }

        // DB에 저장할 Crew Entity 세팅
        ClubCrew clubCrew = ClubCrew.builder()
                .club(club)
                .crew(crew)
                .auth(AuthCode.NONE)
                .build();

        ClubCrew resClubCrew = clubCrewRepository.save(clubCrew);
        if (resClubCrew == null) {
            throw new ApiMessageException("모임 신청에 실패했습니다. 다시 시도해 주세요.");
        }

        return resClubCrew;
    }

    /**
     * 모임별 권한 확인
     * @param clubId, crewId
     */
    public AuthCode getAuth(long clubId, long crewId) {
        AuthCode authCode = clubCrewRepository.findAuthCodeByClubIdAndCrewId(clubId, crewId);

        if (authCode == null) {
            throw new ApiMessageException("모임에 가입된 회원이 아닙니다.");
        }

        return authCode;
    }

    /**
     * 가입 신청 승인
     * @param clubCrewId, crewId (승인하는 회원 아이디)
     */
    @Transactional(readOnly = false)
    public ClubCrew approve(long clubCrewId, long crewId) {
        ClubCrew clubCrew = clubCrewRepository.findByIdWithClub(clubCrewId)
                                                .orElseThrow(() -> new ApiMessageException("가입 신청한 회원이 아닙니다."));
        // 승인 요청을 보낸 회원이 리더인지 확인
        if (getAuth(clubCrew.getClub().getId(), crewId) == AuthCode.LEADER) {
            // 이미 가입되었는지 확인
            if (clubCrew.getAuth() == AuthCode.NONE) {
                clubCrew.updateAuth(AuthCode.NORMAL);
                return clubCrewRepository.save(clubCrew);
            } else {
                throw new ApiMessageException("이미 가입된 회원입니다.");
            }
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 가입 신청 거절
     * @param clubCrewId, crewId (승인하는 회원 아이디)
     */
    @Transactional(readOnly = false)
    public ClubCrew refusal(long clubCrewId, long crewId) {
        ClubCrew clubCrew = clubCrewRepository.findByIdWithClub(clubCrewId)
                                               .orElseThrow(() -> new ApiMessageException("가입 신청한 회원이 아닙니다."));

        // 승인 요청을 보낸 회원이 리더인지 확인
        if (getAuth(clubCrew.getClub().getId(), crewId) == AuthCode.LEADER) {
            // 이미 가입되었는지 확인
            if (clubCrew.getAuth() == AuthCode.NONE) {
                clubCrewRepository.delete(clubCrew);
                return clubCrew;
            } else {
                throw new ApiMessageException("이미 가입된 회원입니다.");
            }
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 가입 신청 리스트 조회
     * @param clubId, crewId, pageable
     */
    public Page<ClubCrew> getRequestClubCrews(long clubId, long crewId, Pageable pageable) {
        if (getAuth(clubId, crewId) == AuthCode.LEADER) {
            return clubCrewRepository.findRequestsByClubId(clubId, pageable);
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 모임별 회원 리스트 조회
     * @param clubId, crewId, authCode, pagealbe
     */
    public Page<ClubCrew> getClubCrews(long clubId, Long crewId, AuthCode authCode, Pageable pageable) {
        // 해당 모임 회원인지 확인
        if (getAuth(clubId, crewId) != AuthCode.NONE) {
            if (authCode == AuthCode.ALL) {
                return clubCrewRepository.findAllByClubId(clubId, pageable);
            } else {
                return clubCrewRepository.findByClubIdAndAuthCode(clubId, authCode, pageable);
            }
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 권한 수정
     * @param clubCrewId, crewId
     */
    @Transactional(readOnly = false)
    public void updateAuth(long clubCrewId, Long crewId, AuthCode authCode) {
        ClubCrew clubCrew = clubCrewRepository.findById(clubCrewId)
                .orElseThrow(() -> new ApiMessageException("모임에 가입된 회원이 아닙니다."));

        // 요청을 보낸 회원이 리더인지 확인
        if (getAuth(clubCrew.getClub().getId(), crewId) == AuthCode.LEADER) {
            switch (authCode) {
                case LEADER:
                    toLeader(clubCrew, crewId);
                    break;
                case MANAGER:
                    toManager(clubCrew);
                    break;
                case NORMAL:
                    toNormal(clubCrew);
                    break;
                default:
                    throw new ApiMessageException("지원하지 않는 권한입니다.");
            }
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 관리자 권한 부여
     * @param clubCrew, crewId
     */
    @Transactional(readOnly = false)
    public void toManager(ClubCrew clubCrew) {
        // 대상 회원이 일반 회원인지 확인
        if (clubCrew.getAuth() == AuthCode.NORMAL) {
            clubCrew.updateAuth(AuthCode.MANAGER);
            clubCrewRepository.save(clubCrew);
        } else {
            throw new ApiMessageException("변경할 수 없는 회원입니다.");
        }
    }

    /**
     * 관리자 권한 박탈
     * @param clubCrew, crewId
     */
    @Transactional(readOnly = false)
    public void toNormal(ClubCrew clubCrew) {
        // 대상 회원이 관리자 회원인지 확인
        if (clubCrew.getAuth() == AuthCode.MANAGER) {
            clubCrew.updateAuth(AuthCode.NORMAL);
            clubCrewRepository.save(clubCrew);
        } else {
            throw new ApiMessageException("변경할 수 없는 회원입니다.");
        }
    }

    /**
     * 리더 위임
     * @param targetClubCrew, crewId
     */
    @Transactional(readOnly = false)
    public void toLeader(ClubCrew targetClubCrew, Long crewId) {
        ClubCrew requestClubCrew = clubCrewRepository.findByClubIdAndCrewId(targetClubCrew.getClub().getId(), crewId)
                .orElseThrow(() -> new AccessDeniedException(""));

        // 대상 회원이 일반 회원 이상인지 확인
        if (targetClubCrew.getAuth() != AuthCode.NONE) {
            requestClubCrew.updateAuth(AuthCode.NORMAL);
            targetClubCrew.updateAuth(AuthCode.LEADER);
            clubCrewRepository.save(requestClubCrew);
            clubCrewRepository.save(targetClubCrew);
        } else {
            throw new ApiMessageException("변경할 수 없는 회원입니다.");
        }
    }

    /**
     * 모임 탈퇴
     * @param clubId, crewId
     */
    @Transactional(readOnly = false)
    public void deleteClubCrew(long clubId, Long crewId) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewId(clubId, crewId)
                .orElseThrow(() -> new ApiMessageException("가입된 모임이 아닙니다."));

        if (clubCrew.getAuth() == AuthCode.LEADER) {
            throw new ApiMessageException("탈퇴할 수 없는 회원입니다.");
        } else if (clubCrew.getAuth() == AuthCode.NONE) {
            throw new ApiMessageException("가입된 모임이 아닙니다.");
        } else {
            clubCrewRepository.delete(clubCrew);
        }
    }

    /**
     * 모임 강퇴
     * @param clubCrewId, crewId
     */
    @Transactional(readOnly = false)
    public void kickClubCrew(long clubCrewId, Long crewId) {
        ClubCrew clubCrew = clubCrewRepository.findById(clubCrewId)
                .orElseThrow(() -> new ApiMessageException("모임에 가입된 회원이 아닙니다."));

        // 요청을 보낸 회원이 리더인지 확인
        if (getAuth(clubCrew.getClub().getId(), crewId) == AuthCode.LEADER) {
            // 대상 회원이 본인이 아니고 일반회원 이상인지 확인
            if (clubCrew.getCrew().getId() != crewId && clubCrew.getAuth() != AuthCode.NONE) {
                clubCrewRepository.delete(clubCrew);
            } else {
                throw new ApiMessageException("변경할 수 없는 회원입니다.");
            }
        } else {
            throw new AccessDeniedException("");
        }
    }
}
