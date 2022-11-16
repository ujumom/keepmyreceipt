package com.ieung.receipt.service;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.dto.req.AssetSCategoryReqDTO;
import com.ieung.receipt.dto.req.BudgetSCategoryReqDTO;
import com.ieung.receipt.dto.req.ClubReqDTO;
import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.entity.Club;
import com.ieung.receipt.entity.ClubCrew;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.ClubCrewRepository;
import com.ieung.receipt.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClubService {
    private final ClubRepository clubRepository;
    private final ClubCrewRepository clubCrewRepository;
    private final CategoryService categoryService;

    /**
     * 모임 생성
     * @param crew, clubReqDTO
     */
    @Transactional(readOnly = false)
    public void createClub(Crew crew, ClubReqDTO clubReqDTO) {
        // DB에 저장할 Group Entity 세팅
        Club group = Club.builder()
                .name(clubReqDTO.getName())
                .description(clubReqDTO.getDescription())
                .isActiveCategory(YNCode.Y)
                .image(clubReqDTO.getImage())
                .build();

        Club resGroup = clubRepository.save(group);
        if (resGroup == null) {
            throw new ApiMessageException("모임 생성에 실패했습니다. 다시 시도해 주세요.");
        }

        // DB에 저장할 Crew (Leader) Entity 세팅
        ClubCrew clubCrew = ClubCrew.builder()
                .club(resGroup)
                .crew(crew)
                .auth(AuthCode.LEADER) // 리더
                .build();

        ClubCrew resClubCrew = clubCrewRepository.save(clubCrew);
        if (resClubCrew == null) {
            throw new ApiMessageException("모임 생성에 실패했습니다. 다시 시도해 주세요.");
        }

        // 기본 소분류 등록
        Long clubId = resGroup.getId();
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("전기예산").bscName("전기예산").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("활동지원금").bscName("활동지원금").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("회비").bscName("회비").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("복리후생비").bscName("회식").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("복리후생비").bscName("식비").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("복리후생비").bscName("MT").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("여가교통비").bscName("교통비").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("소모품비").bscName("사무용품").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("소모품비").bscName("생활용품").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("기타비용").bscName("미분류 비용").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("수입").bscName("상금수익").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("수입").bscName("부스수익").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("수입").bscName("이자수익").build());
        categoryService.createBudgetSCategory(BudgetSCategoryReqDTO.builder().clubId(clubId).lcName("기타수입").bscName("미분류 수입").build());
        categoryService.createAssetSCategory(AssetSCategoryReqDTO.builder().clubId(clubId).lcName("현금 및 현금성자산").ascName("현금").balance(0).build());
        categoryService.createAssetSCategory(AssetSCategoryReqDTO.builder().clubId(clubId).lcName("유형자산").ascName("비품").balance(0).build());
        categoryService.createAssetSCategory(AssetSCategoryReqDTO.builder().clubId(clubId).lcName("유형자산").ascName("차량").balance(0).build());
        categoryService.createAssetSCategory(AssetSCategoryReqDTO.builder().clubId(clubId).lcName("선급금").ascName("회원권").balance(0).build());
        categoryService.createAssetSCategory(AssetSCategoryReqDTO.builder().clubId(clubId).lcName("기타자산").ascName("미분류자산").balance(0).build());
    }

    /**
     * 특정 모임 조회
     * @param clubId
     */
    public Club getClub(Long clubId) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new ApiMessageException("존재하지 않는 모임입니다."));

        return club;
    }

    /**
     * 모임 목록 검색
     * @param name, pageable
     */
    public Page<Club> getClubs(String name, Pageable pageable) {
        return clubRepository.findAllByName(name, pageable);
    }

    /**
     * 모임 삭제
     * @param crewId, clubId
     */
    @Transactional(readOnly = false)
    public void deleteClub(Long crewId, Long clubId) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewId(clubId, crewId)
                                                 .orElseThrow(() -> new AccessDeniedException(""));

        if (clubCrew.getAuth() == AuthCode.LEADER) {
            Long clubCrewCnt = clubCrewRepository.findCountByClubId(clubId);

            if (clubCrewCnt > 1) {
                throw new ApiMessageException("회원 수가 1일때만 삭제할 수 있습니다.");
            } else {
                clubCrewRepository.delete(clubCrew);
                clubRepository.delete(clubCrew.getClub());
            }
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 모임 정보 수정
     * @param crewId, clubId, clubReqDTO
     */
    @Transactional(readOnly = false)
    public void updateClub(Long crewId, Long clubId, ClubReqDTO clubReqDTO) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewId(clubId, crewId)
                                                 .orElseThrow(() -> new AccessDeniedException(""));

        if (clubCrew.getAuth() == AuthCode.LEADER) {
            Club club = clubCrew.getClub();
            club.updateName(clubReqDTO.getName());
            club.updateDescription(clubReqDTO.getDescription());
            club.updateImage(clubReqDTO.getImage());
            clubRepository.save(club);
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 가입한 모임 조회
     * @param crewId, pageable
     */
    @Transactional(readOnly = false)
    public Page<Club> getJoinedClubs(Long crewId, Pageable pageable) {
        return clubRepository.findJoinedClubByCrewId(crewId, pageable);
    }

    /**
     * 가입 신청한 모임 조회
     * @param crewId, pageable
     */
    @Transactional(readOnly = false)
    public Page<Club> getRequestedClubs(Long crewId, Pageable pageable) {
        return clubRepository.findRequestedClubByCrewId(crewId, pageable);
    }

    /**
     * 대분류 활성화 여부 조회
     * @param crewId, clubId
     */
    public YNCode getIsActiveCategory(Long crewId, Long clubId) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewId(clubId, crewId)
                .orElseThrow(() -> new AccessDeniedException(""));

        return clubCrew.getClub().getIsActiveCategory();
    }

    /**
     * 대분류 활성화
     * @param crewId, clubId
     */
    @Transactional(readOnly = false)
    public void activeCategory(Long crewId, long clubId) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewId(clubId, crewId)
                .orElseThrow(() -> new AccessDeniedException(""));

        if (clubCrew.getAuth() == AuthCode.LEADER) {
            Club club = clubCrew.getClub();
            if (club.getIsActiveCategory() == YNCode.Y) {
                throw new ApiMessageException("이미 활성화된 옵션입니다.");
            }

            club.updateIsActiveCategory(YNCode.Y);
            clubRepository.save(club);
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 대분류 비활성화
     * @param crewId, clubId
     */
    @Transactional(readOnly = false)
    public void inactiveCategory(Long crewId, long clubId) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewId(clubId, crewId)
                .orElseThrow(() -> new AccessDeniedException(""));

        if (clubCrew.getAuth() == AuthCode.LEADER) {
            Club club = clubCrew.getClub();
            if (club.getIsActiveCategory() == YNCode.N) {
                throw new ApiMessageException("이미 비활성화된 옵션입니다.");
            }

            club.updateIsActiveCategory(YNCode.N);
            clubRepository.save(club);
        } else {
            throw new AccessDeniedException("");
        }
    }
}
