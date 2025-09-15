package com.hotel.hotelreservation.repository;

import com.hotel.hotelreservation.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    // 권한 이름으로 찾기
    Optional<Role> findByName(String name);
    
    // 권한 이름 존재 여부 확인
    boolean existsByName(String name);
}
