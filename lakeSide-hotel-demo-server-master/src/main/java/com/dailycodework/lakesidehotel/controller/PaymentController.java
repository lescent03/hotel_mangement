package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.service.MomoService;
import com.dailycodework.lakesidehotel.service.PaypalService;
import com.dailycodework.lakesidehotel.service.VNPAYService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/payment")
public class PaymentController {
    private final PaypalService paypalService;
    private final MomoService momoService;
    private final VNPAYService vnpayService;

    private static final BigDecimal EXCHANGE_RATE_VND_TO_USD = new BigDecimal("0.00003922"); // Tỷ giá ví dụ: 1 VND = 0.000041 USD

    @PostMapping("/vnpay/create/{paymentMethod}/{payment}")
    public String CreatePaymentVNPay(@PathVariable String paymentMethod, @PathVariable BigDecimal payment,
                                     HttpServletRequest request) {
        try {
            String successUrl = "http://localhost:5173/booking-success";
            return vnpayService.CreatePayment(
                    payment, "", successUrl, request
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/momo/create/{paymentMethod}/{payment}")
    public String CreatePaymentMomo(@PathVariable String paymentMethod, @PathVariable BigDecimal payment) {
        try {
            String cancelUrl = "http://localhost:5173/booking-success";
            String successUrl = "http://localhost:5173/booking-success";
            String payment1 = momoService.CreatePayment(
                    payment, cancelUrl, successUrl
            );
            return payment1;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/paypal/create/{paymentMethod}/{payment}")
    public String CreatePayment(@PathVariable String paymentMethod, @PathVariable BigDecimal payment) {
        try {
            // Chuyển đổi từ VND sang USD
            BigDecimal paymentInUSD = payment.multiply(EXCHANGE_RATE_VND_TO_USD).setScale(2, RoundingMode.HALF_UP);

            String cancelUrl = "http://localhost:5173/booking-success";
            String successUrl = "http://localhost:5173/booking-success";
            Payment payment1 = paypalService.CreatePayment(
                    paymentInUSD, "USD", "paypal", "sale",
                    "payment description", cancelUrl, successUrl
            );
            for (Links links : payment1.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    return links.getHref();
                }
            }
        } catch (PayPalRESTException e) {
            log.error("error paypal:: ", e);
        }
        return "http://localhost:5173/booking-success";
    }

    @GetMapping("/success/{paymentId}/{payerId}")
    public String PaymentSuccess(@PathVariable("paymentId") String paymentId,
                                 @PathVariable("payerId") String payerId){
        try{
            Payment payment = paypalService.excutePayment(paymentId, payerId);
            if(payment.getState().equals("approved")){
                return "payment success";
            }
        }catch (PayPalRESTException e){
            log.error("error: ", e);
        }
        return "payment success";
    }

    @GetMapping("/cancel")
    public String CancelPayment(){
        return "payment cancel";
    }

    @GetMapping("/error")
    public String ErrorPayment(){
        return "payment error";
    }
}
