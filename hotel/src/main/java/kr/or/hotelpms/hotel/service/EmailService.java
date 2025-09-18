package kr.or.hotelpms.hotel.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Autowired
    private SendGrid sendGrid;

    public void sendTemporaryPassword(String toEmail, String tempPassword) throws IOException {
        Email from = new Email("noreply@devhotel.com"); // Make sure this email is a verified sender in your SendGrid account
        String subject = "[Dev Hotel] 임시 비밀번호 안내";
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", "안녕하세요. Dev Hotel입니다. 임시 비밀번호는 " + tempPassword + " 입니다.");
        Mail mail = new Mail(from, subject, to, content);

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            throw ex;
        }
    }
}
