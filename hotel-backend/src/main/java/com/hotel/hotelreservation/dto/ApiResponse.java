package com.hotel.hotelreservation.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    
    private String status;
    private T data;
    private String message;
    
    // 성공 응답 생성 메서드
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status("success")
                .data(data)
                .build();
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status("success")
                .data(data)
                .message(message)
                .build();
    }
    
    // 에러 응답 생성 메서드
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status("error")
                .message(message)
                .build();
    }
    
    public static <T> ApiResponse<T> error(T data, String message) {
        return ApiResponse.<T>builder()
                .status("error")
                .data(data)
                .message(message)
                .build();
    }
}
