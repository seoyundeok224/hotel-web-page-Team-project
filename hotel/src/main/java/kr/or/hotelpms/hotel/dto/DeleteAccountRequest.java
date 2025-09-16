package kr.or.hotelpms.hotel.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class DeleteAccountRequest {
    
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
}