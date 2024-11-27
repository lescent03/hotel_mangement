package com.dailycodework.lakesidehotel.service;
import com.dailycodework.lakesidehotel.Config.VNPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPAYService {
    private final VNPayConfig vnPayConfig;

    public String CreatePayment(
            BigDecimal amount,
            String orderInfo,
            String returnUrl,
            HttpServletRequest request
    ) throws UnsupportedEncodingException {
        // Validate input
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền không hợp lệ");
        }

        // Initialize parameters
        Map<String, String> vnpParams = new HashMap<>();

        // Convert amount to VND (amount should be multiplied by 100 and no decimal points)
        long amountInVND = amount.multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        // Basic parameters
        vnpParams.put("vnp_Version", VNPayConstant.VERSION);
        vnpParams.put("vnp_Command", VNPayConstant.COMMAND);
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amountInVND));
        vnpParams.put("vnp_CurrCode", "VND");

        // Generate unique transaction reference
        String txnRef = generateTransactionNo();
        vnpParams.put("vnp_TxnRef", txnRef);

        // Order info - ensure it's not empty
        orderInfo = (orderInfo == null || orderInfo.trim().isEmpty())
                ? "Thanh toan don hang " + txnRef
                : normalizeString(orderInfo, 255);
        vnpParams.put("vnp_OrderInfo", orderInfo);

        vnpParams.put("vnp_OrderType", "250000"); // Using proper order type code
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_IpAddr", VNPayConfig.getIpAddress(request));

        // Create timestamp in Vietnam timezone
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
        ZonedDateTime now = ZonedDateTime.now(vietnamZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        vnpParams.put("vnp_CreateDate", now.format(formatter));
        // Set expire date 15 minutes from now
        vnpParams.put("vnp_ExpireDate", now.plusMinutes(15).format(formatter));

        // Build query URL and create secure hash
        String queryUrl = buildQueryUrl(vnpParams);
        String vnpSecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), queryUrl);

        // Return full payment URL
        return vnPayConfig.getPayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
    }

    private String buildQueryUrl(Map<String, String> params) throws UnsupportedEncodingException {
        // Sắp xếp các tham số theo thứ tự a-z trước khi ký
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);

            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Xây dựng chuỗi hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.name()));

                // Build query
                query.append(fieldName);
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.name()));

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        return query.toString();
    }

    private String generateTransactionNo() {
        return String.format("%d_%s",
                System.currentTimeMillis(),
                VNPayConfig.getRandomNumber(5));
    }

    private String normalizeString(String input, int maxLength) {
        if (input == null) {
            return "";
        }
        // Remove special characters and extra spaces
        String normalized = input.replaceAll("[^\\p{L}\\p{N}\\s-_]", "")
                .trim()
                .replaceAll("\\s+", " ");

        return normalized.length() > maxLength ?
                normalized.substring(0, maxLength) :
                normalized;
    }

    // Rest of the methods remain the same...
}

// Add a constant class for VNPAY parameters
class VNPayConstant {
    public static final String VERSION = "2.1.0";
    public static final String COMMAND = "pay";
    public static final String ORDER_TYPE = "250000"; // Default order type for payment
}