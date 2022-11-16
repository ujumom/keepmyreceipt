package com.ieung.receipt.repository;

import com.ieung.receipt.dto.res.TagResDTO;
import com.ieung.receipt.entity.Club;
import com.ieung.receipt.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<TagResDTO> findByClubAndTagLevel(Club club, int tagLevel);
    List<TagResDTO> findByClubAndParentTag(Club club, String parentTag);
    int countTagByClubAndParentTagAndTagName(Club club, String parentTag, String tagName);
    void deleteTagByClubAndTagName(Club club, String tagName);
    Optional<Tag> findTagByIdAndClub(Long id, Club club);
}
