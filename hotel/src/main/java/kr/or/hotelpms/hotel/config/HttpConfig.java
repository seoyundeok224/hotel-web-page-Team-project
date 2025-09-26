package kr.or.hotelpms.hotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP 통신을 위한 설정
 */
@Configuration
public class HttpConfig {
    
    /**
     * RestTemplate 빈 등록
     * PortOne API 호출 등에 사용
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}