package com.ieung.receipt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EntityScan("com.ieung.receipt")
public class ReceiptApplication {
	public static void main(String[] args) {
		SpringApplication.run(ReceiptApplication.class, args);
	}

}
