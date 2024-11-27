package com.dailycodework.lakesidehotel.service;

import com.mservice.allinone.models.CaptureMoMoResponse;
import com.mservice.allinone.processor.allinone.CaptureMoMo;
import com.mservice.shared.sharedmodels.Environment;
import com.mservice.shared.sharedmodels.PartnerInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MomoService {

    @Value("${momo.DEV_MOMO_ENDPOINT}")
    private String momoEndpoint;

    @Value("${momo.DEV_ACCESS_KEY}")
    private String accessKey;

    @Value("${momo.DEV_PARTNER_CODE}")
    private String partnerCode;

    @Value("${momo.DEV_SECRET_KEY}")
    private String secretKey;

    private String encodeUrl(String url) {
        return UriUtils.encode(url, StandardCharsets.UTF_8.toString());
    }

    private String generateSignature(String message) throws Exception {
        try {
            Mac hmacSha256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSha256.init(secretKeySpec);
            byte[] hmacBytes = hmacSha256.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hmacBytes);
        } catch (Exception e) {
            log.error("Error generating signature", e);
            throw e;
        }
    }

    private String buildRawSignature(String requestId, String orderId, String amount,
                                     String orderInfo, String returnUrl, String notifyUrl,
                                     String extraData) {
        // Theo tài liệu MoMo, chuỗi trước khi ký phải theo thứ tự như sau
        return "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + notifyUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + returnUrl +
                "&requestId=" + requestId +
                "&requestType=captureWallet";
    }

    public String CreatePayment(BigDecimal total, String cancelUrl, String successUrl) throws Exception {
        log.info("========== STARTING MOMO PAYMENT CREATION ==========");

        // Validate parameters
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid payment amount");
        }
        if (successUrl == null || successUrl.isEmpty()) {
            throw new IllegalArgumentException("Invalid return URL");
        }

        try {
            // Encode URLs
            String encodedReturnUrl = encodeUrl(successUrl);
            String encodedNotifyUrl = encodeUrl(successUrl); // Sử dụng success URL làm notify URL

            // Tạo thông tin thanh toán
            String requestId = UUID.randomUUID().toString();
            String orderId = "ORDER_" + System.currentTimeMillis();
            String amount = String.valueOf(total.setScale(0, RoundingMode.HALF_UP).longValue());
            String orderInfo = "Thanh toan don hang #" + orderId;
            String extraData = "";

            // Build và tạo signature
            String rawSignature = buildRawSignature(
                    requestId, orderId, amount, orderInfo,
                    encodedReturnUrl, encodedNotifyUrl, extraData
            );

            log.info("Raw Signature: {}", rawSignature);
            String signature = generateSignature(rawSignature);
            log.info("Generated Signature: {}", signature);

            // Log request parameters
            log.info("Request Parameters:");
            log.info("Endpoint: {}", momoEndpoint);
            log.info("Partner Code: {}", partnerCode);
            log.info("Access Key: {}", accessKey);
            log.info("Request ID: {}", requestId);
            log.info("Order ID: {}", orderId);
            log.info("Amount: {}", amount);
            log.info("Return URL: {}", encodedReturnUrl);
            log.info("Notify URL: {}", encodedNotifyUrl);
            log.info("Order Info: {}", orderInfo);
            log.info("Extra Data: {}", extraData);

            // Khởi tạo môi trường
            Environment environment = new Environment(
                    momoEndpoint,
                    new PartnerInfo(partnerCode, accessKey, secretKey),
                    Environment.ProcessType.PAY_GATE.toString()
            );

            // Gọi API MoMo
            CaptureMoMoResponse momoResponse = CaptureMoMo.process(
                    environment,
                    orderId,
                    requestId,
                    amount,
                    orderInfo,
                    successUrl,
                    successUrl,
                    extraData
            );

            log.info("========== MOMO RESPONSE ==========");
            if (momoResponse != null) {
                log.info("Response Code: {}", momoResponse.getErrorCode());
                log.info("Message: {}", momoResponse.getMessage());
                log.info("Pay URL: {}", momoResponse.getPayUrl());

                if (momoResponse.getErrorCode() == 0 && momoResponse.getPayUrl() != null) {
                    return momoResponse.getPayUrl();
                } else {
                    throw new Exception("MoMo Error: " + momoResponse.getMessage());
                }
            }

            return "no link";
        } catch (Exception e) {
            log.error("Error in CreatePayment", e);
            throw new Exception("Lỗi tạo thanh toán MoMo: " + e.getMessage());
        }
    }
}