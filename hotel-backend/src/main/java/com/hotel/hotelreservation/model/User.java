
package com.hotel.hotelreservation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {
	@Id
	private Long id;
	private String name;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
}

// 사용자 테이블 엔티티 //
// 필수(중요)로 만들어야 함 //
// 난이도: 중급 (JPA 엔티티) //

