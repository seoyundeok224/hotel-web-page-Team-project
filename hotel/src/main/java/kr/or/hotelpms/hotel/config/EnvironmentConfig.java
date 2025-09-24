package kr.or.hotelpms.hotel.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

import java.util.Properties;

@Configuration
public class EnvironmentConfig {

    @Bean
    public Dotenv dotenv(ConfigurableEnvironment environment) {
        Dotenv dotenv = Dotenv.configure()
                .directory(".")
                .ignoreIfMissing()
                .load();
        
        // .env 파일의 값들을 Spring Environment에 추가
        Properties props = new Properties();
        dotenv.entries().forEach(entry -> {
            props.setProperty(entry.getKey(), entry.getValue());
        });
        
        environment.getPropertySources().addFirst(
            new PropertiesPropertySource("dotenv", props)
        );
        
        return dotenv;
    }
}