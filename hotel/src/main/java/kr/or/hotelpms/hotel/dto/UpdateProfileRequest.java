package kr.or.hotelpms.hotel.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class UpdateProfileRequest {
    
    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 50, message = "이름은 2자 이상 50자 이하여야 합니다")
    private String name;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 형식이어야 합니다")
    @Size(max = 100, message = "이메일은 100자 이하여야 합니다")
    private String email;
    
    @Size(max = 20, message = "전화번호는 20자 이하여야 합니다")
    private String phone;
}