package com.dailycodework.lakesidehotel.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")  // Inject giá trị từ cấu hình
    private String fromEmail;

//    public void sendEmail(String to, String subject, String body) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(body);
//
//        mailSender.send(message);
//
//    }
    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        // Sử dụng MimeMessageHelper để dễ dàng thiết lập các thuộc tính của email
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);  // Sử dụng tham số đầu vào `to`
        helper.setSubject(subject);  // Sử dụng tham số đầu vào `subject`

        // Thiết lập nội dung là HTML
        //helper.setText(body, true);  // `true` để cho phép nội dung là HTML

        message.setContent(body, "text/html; charset=utf-8");
        mailSender.send(message);
    }
}
