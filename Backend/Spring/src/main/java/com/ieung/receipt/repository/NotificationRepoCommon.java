package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepoCommon {
    Page<Notification> findByCrewId(long crewId, Pageable pageable);
}
