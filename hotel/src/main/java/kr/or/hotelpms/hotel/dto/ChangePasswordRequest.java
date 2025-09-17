package kr.or.hotelpms.hotel.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ChangePasswordRequest {
    
    @NotBlank(message = "현재 비밀번호는 필수입니다")
    private String currentPassword;
    
    @NotBlank(message = "새 비밀번호는 필수입니다")
    @Size(min = 6, max = 100, message = "비밀번호는 6자 이상 100자 이하여야 합니다")
    private String newPassword;
    
    @NotBlank(message = "비밀번호 확인은 필수입니다")
    private String confirmPassword;
}