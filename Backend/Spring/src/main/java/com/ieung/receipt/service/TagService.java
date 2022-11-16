package com.ieung.receipt.service;

import com.ieung.receipt.dto.req.TagReqDTO;
import com.ieung.receipt.dto.res.TagResDTO;
import com.ieung.receipt.entity.Tag;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.ClubRepository;
import com.ieung.receipt.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final ClubRepository clubRepository;

    /**
     * 태그 생성
     * @param tagReqDTO
     */
    @Transactional
    public void createTag(TagReqDTO tagReqDTO){
        Tag tag = Tag.builder()
                .club(clubRepository.getById(tagReqDTO.getClubId()))
                .parentTag(tagReqDTO.getParentTag())
                .tagName(tagReqDTO.getTagName())
                .tagLevel(tagReqDTO.getParentTag()==null?1:2)
                .build();
        int checkDuplicate = tagRepository.countTagByClubAndParentTagAndTagName(tag.getClub(), tag.getParentTag(), tag.getTagName());
        if(checkDuplicate!=0){
            throw new ApiMessageException("태그가 이미 존재합니다.");
        }
        Tag resTag = tagRepository.save(tag);
        if(resTag == null){
            throw new ApiMessageException("태그 생성에 실패했습니다. 다시 시도해 주세요.");
        }
    }

    /**
     * 1차 태그 검색
     * @param clubId
     */
    public List<TagResDTO> getFirstTag(Long clubId){
        return tagRepository.findByClubAndTagLevel(clubRepository.getById(clubId), 1);
    }

    /**
     * 2차 태그 검색
     * @param clubId, parentTag
     */
    public List<TagResDTO> getSecondTag(Long clubId, String parentTag){
        return tagRepository.findByClubAndParentTag(clubRepository.getById(clubId), parentTag);
    }

    /**
     * 태그 수정
     * @param tagReqDTO, tagId
     */
    @Transactional
    public void updateTag(TagReqDTO tagReqDTO, Long tagId){
        Tag originTag = tagRepository.getById(tagId);
        Tag newTag = Tag.builder()
                .club(clubRepository.getById(tagReqDTO.getClubId()))
                .parentTag(tagReqDTO.getParentTag())
                .tagName(tagReqDTO.getTagName())
                .tagLevel(tagReqDTO.getParentTag()==null?1:2)
                .build();
        int checkDuplicate = tagRepository.countTagByClubAndParentTagAndTagName(newTag.getClub(), newTag.getParentTag(), newTag.getTagName());
        if(checkDuplicate!=0){
            throw new ApiMessageException("태그가 이미 존재합니다.");
        }
        originTag.updateTag(newTag);
        tagRepository.save(originTag);
    }

    /**
     * 태그 삭제
     * @param tagId
     */
    @Transactional
    public void deleteTag(Long tagId){
        tagRepository.deleteById(tagId);
    }
}
