package com.ieung.receipt.service;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.dto.req.RequestReqDTO;
import com.ieung.receipt.entity.ClubCrew;
import com.ieung.receipt.entity.Request;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.ClubCrewRepository;
import com.ieung.receipt.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RequestService {
    private final RequestRepository requestRepository;
    private final ClubCrewRepository clubCrewRepository;

    /**
     * 청구 요청 등록
     * @param clubId, crewId, requestReqDTO
     */
    @Transactional(readOnly = false)
    public Request createRequest(Long clubId, Long crewId, RequestReqDTO requestReqDTO) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewIdWithCrew(clubId, crewId)
                .orElseThrow(() -> new ApiMessageException("가입된 모임이 아닙니다."));

        Request request = Request.builder()
                .crewId(crewId)
                .crewName(clubCrew.getCrew().getName())
                .club(clubCrew.getClub())
                .payDate(requestReqDTO.getDate())
                .receiptUrl(requestReqDTO.getReceiptUrl())
                .state(StateCode.REQUEST)
                .price(requestReqDTO.getPrice())
                .build();

        return requestRepository.save(request);
    }

    /**
     * 청구 요청 목록 조회
     * @param clubId, crewId, stateCode, pageable
     */
    public Page<Request> getRequests(long clubId, Long crewId, StateCode stateCode, Pageable pageable) {
        Page<Request> result;

        AuthCode authCode = clubCrewRepository.findAuthCodeByClubIdAndCrewId(clubId, crewId);
        if (authCode == null) {
            throw new ApiMessageException("가입된 모임이 아닙니다.");

        // 리더 혹은 관리자일 경우 모두 출력
        } else if (authCode == AuthCode.LEADER || authCode == AuthCode.MANAGER) {
            if (stateCode == StateCode.ALL) {
                result = requestRepository.findByClubId(clubId, pageable);
            } else {
                result = requestRepository.findByClubIdAndState(clubId, stateCode, pageable);
            }

        // 일반 회원 일 경우 자신의 청구 목록만 출력
        } else if (authCode == AuthCode.NORMAL) {
            if (stateCode == StateCode.ALL) {
                result = requestRepository.findByClubIdAndCrewId(clubId, crewId, pageable);
            } else {
                result = requestRepository.findByClubIdAndCrewIdAndState(clubId, crewId, stateCode, pageable);
            }

        // 가입 승인 대기자일 경우
        } else {
            throw new AccessDeniedException("");
        }

        return result;
    }

    /**
     * 특정 청구 요청 조회
     * @param requestId, crewIdCode, pageable
     */
    public Request getRequest(long requestId, Long crewId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiMessageException("해당하는 청구 내역이 없습니다."));

        AuthCode authCode = clubCrewRepository.findAuthCodeByClubIdAndCrewId(request.getClub().getId(), crewId);
        if (authCode == null) {
            throw new ApiMessageException("가입된 모임이 아닙니다.");
        } else if (request.getCrewId() != crewId && (authCode == AuthCode.NONE || authCode == AuthCode.NORMAL)) {
            throw new AccessDeniedException("");
        }

        if (!clubCrewRepository.findExistByClubIdAndCrewId(request.getClub().getId(), crewId)) {
            throw new ApiMessageException("가입된 모임이 아닙니다.");
        }

        return request;
    }

    /**
     * 특정 청구 요청 수정
     * @param requestId, crewId, requestReqDTO
     */
    @Transactional(readOnly = false)
    public void updateRequest(long requestId, Long crewId, RequestReqDTO requestReqDTO) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiMessageException("해당하는 청구 내역이 없습니다."));

        // 작성한 회원의 요청인지 확인
        if (request.getCrewId() == crewId) {
            // 신청 상태 확인
            if (request.getState() == StateCode.REQUEST) {
                request.updateRequest(requestReqDTO);
                requestRepository.save(request);
            } else {
                throw new ApiMessageException("이미 처리된 청구 내역입니다.");
            }
        } else {
            throw new ApiMessageException("작성자만 수정할 수 있습니다.");
        }
    }

    /**
     * 특정 청구 요청 삭제
     * @param requestId, crewId
     */
    @Transactional(readOnly = false)
    public void deleteRequest(long requestId, Long crewId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiMessageException("해당하는 청구 내역이 없습니다."));

        // 작성한 회원의 요청인지 확인
        if (request.getCrewId() == crewId) {
            // 신청 상태 확인
            if (request.getState() == StateCode.REQUEST) {
                requestRepository.delete(request);
            } else {
                throw new ApiMessageException("이미 처리된 청구 내역입니다.");
            }
        } else {
            throw new ApiMessageException("작성자만 삭제할 수 있습니다.");
        }
    }

    /**
     * 특정 청구 요청 거절
     * @param requestId, crewId
     */
    @Transactional(readOnly = false)
    public Request refusalRequest(long requestId, Long crewId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiMessageException("해당하는 청구 내역이 없습니다."));

        AuthCode authCode = clubCrewRepository.findAuthCodeByClubIdAndCrewId(request.getClub().getId(), crewId);
        if (authCode == null) {
            throw new ApiMessageException("가입된 모임이 아닙니다.");
        }

        // 요청 권한 확인
        if (authCode == AuthCode.LEADER || authCode == AuthCode.MANAGER) {
            // 신청 상태 확인
            if (request.getState() == StateCode.REQUEST) {
                request.updateState(StateCode.REFUSAL);
                return requestRepository.save(request);
            } else {
                throw new ApiMessageException("이미 처리된 청구 내역입니다.");
            }
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 영수증 사진 조회
     * @param requestId
     */
    public String getReceiptUrl(Long requestId) {
        String receiptUrl = requestRepository.findReceiptUrlById(requestId)
                .orElse(null);

        return receiptUrl;
    }
}