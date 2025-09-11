
package com.hotel.hotelreservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

import com.hotel.hotelreservation.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
=======
import org.springframework.stereotype.Repository;
import com.hotel.hotelreservation.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 사용자명으로 사용자 찾기
    Optional<User> findByUsername(String username);
    
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);
    
    // 사용자명 존재 여부 확인
    boolean existsByUsername(String username);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 활성화된 사용자 찾기
    Optional<User> findByUsernameAndEnabled(String username, Boolean enabled);
>>>>>>> sjh
}
