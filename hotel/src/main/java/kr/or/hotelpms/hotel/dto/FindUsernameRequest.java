package kr.or.hotelpms.hotel.dto;

import lombok.Data;

@Data
public class FindUsernameRequest {
    private String email;
    private String name;
}