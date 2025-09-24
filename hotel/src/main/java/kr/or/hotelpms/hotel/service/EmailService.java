package kr.or.hotelpms.hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendTemporaryPassword(String toEmail, String tempPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("[Dev Hotel] 임시 비밀번호 안내");
            message.setText("안녕하세요. Dev Hotel입니다.\n\n임시 비밀번호: " + tempPassword + "\n\n로그인 후 반드시 비밀번호를 변경해 주세요.");
            
            javaMailSender.send(message);
            System.out.println("이메일 전송 성공: " + toEmail);
        } catch (Exception ex) {
            System.err.println("이메일 전송 실패: " + ex.getMessage());
            throw new RuntimeException("이메일 전송에 실패했습니다.", ex);
        }
    }
}
