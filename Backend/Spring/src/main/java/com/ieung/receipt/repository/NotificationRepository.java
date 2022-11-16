package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long>, NotificationRepoCommon {
}
