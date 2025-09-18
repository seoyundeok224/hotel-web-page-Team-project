package kr.or.hotelpms.hotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sendgrid.SendGrid;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class SendGridConfig {

    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure()
                .directory(".")
                .ignoreIfMissing()
                .load();
    }

    @Bean
    public SendGrid sendGrid(Dotenv dotenv) {
        return new SendGrid(dotenv.get("SENDGRID_API_KEY"));
    }
}
