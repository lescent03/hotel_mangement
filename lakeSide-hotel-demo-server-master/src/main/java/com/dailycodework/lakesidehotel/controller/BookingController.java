package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.exception.InvalidBookingRequestException;
import com.dailycodework.lakesidehotel.exception.ResourceNotFoundException;
import com.dailycodework.lakesidehotel.model.*;
import com.dailycodework.lakesidehotel.repository.BookedRoomRepository;
import com.dailycodework.lakesidehotel.response.*;
import com.dailycodework.lakesidehotel.service.IBookingService;
import com.dailycodework.lakesidehotel.service.IRoomService;
import com.dailycodework.lakesidehotel.service.PaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/bookings")
public class BookingController {
    private final RoomController roomController;
    private final BillController billController;
    private final SurchargesController surchargesController;
    private final UserController userController;

    private final IBookingService iBookingService;
    private final IRoomService iRoomService;
    private final PaypalService paypalService;

    @PutMapping("/{bookingId}/services/update")
    public Boolean UpdateUsedServiceOfBooking(@PathVariable Long bookingId, @RequestBody List<Service> services){
        return iBookingService.UpdateUsedServiceOfBooking(bookingId, services);
    }

    @PutMapping("/booking/{bookingId}/update")
    public BookedRoomResponse updateBooking(@PathVariable Long bookingId, @RequestBody BookedRoom bookingUpdate){
        BookedRoom updateBooking = iBookingService.UpdateBooking(bookingId, bookingUpdate);
        return getBookingResponse(updateBooking);
    }

    public String statusEarlyCheckinBefor5h = "checkin sớm trước 5h";
    public String statusEarlyCheckin5_9h = "checkin sớm 5-9h";
    public String statusEarlyCheckin9_14h = "checkin sớm 9-14h";
    public BigDecimal feeEarlyCheckinBefor5h = BigDecimal.valueOf(1.0); // 100%
    public BigDecimal feeEarlyCheckin5_9h = BigDecimal.valueOf(0.5); // 50%
    public BigDecimal feeEarlyCheckin9_14h = BigDecimal.valueOf(0.3); // 30%

    @PutMapping("/booking/{bookingId}/checkin")
    public ResponseEntity<String> checkinBooking(@PathVariable Long bookingId){

        BookedRoom bookedRoom = iBookingService.GetBookingById(bookingId).orElse(null);
        String status =  iBookingService.checkinBooking(bookingId, statusEarlyCheckinBefor5h,
                statusEarlyCheckin5_9h, statusEarlyCheckin9_14h);

        if(bookedRoom != null){
            if(status.equals(statusEarlyCheckinBefor5h)){
                Surcharge surcharge = new Surcharge();
                surcharge.setContent(statusEarlyCheckinBefor5h);
                surcharge.setQuantity(1);
                surcharge.setPrice(bookedRoom.getRoom().getPrice().multiply(feeEarlyCheckinBefor5h));
                SurchargeResponse surcharge1 = surchargesController.CreateSurchargeForBooking(bookingId, surcharge);
                if(surcharge1 == null)
                    status = "Lỗi tạo phụ thu nhận phòng sớm trước 5h";
            }

            if(status.equals(statusEarlyCheckin5_9h)){
                Surcharge surcharge = new Surcharge();
                surcharge.setContent(statusEarlyCheckin5_9h);
                surcharge.setQuantity(1);
                surcharge.setPrice(bookedRoom.getRoom().getPrice().multiply(feeEarlyCheckin5_9h));
                SurchargeResponse surcharge1 = surchargesController.CreateSurchargeForBooking(bookingId, surcharge);
                if(surcharge1 == null)
                    status = "Lỗi tạo phụ thu nhận phòng sớm 5-9h";
            }

            if(status.equals(statusEarlyCheckin9_14h)){
                Surcharge surcharge = new Surcharge();
                surcharge.setContent(statusEarlyCheckin9_14h);
                surcharge.setQuantity(1);
                surcharge.setPrice(bookedRoom.getRoom().getPrice().multiply(feeEarlyCheckin9_14h));
                SurchargeResponse surcharge1 = surchargesController.CreateSurchargeForBooking(bookingId, surcharge);
                if(surcharge1 == null)
                    status = "Lỗi tạo phụ thu nhận phòng sớm 9-14h";
            }

            if(!status.toLowerCase().contains("lỗi")){
                iBookingService.SaveCheckinBooking(bookingId, status);
            }
        }

        return ResponseEntity.ok(status);
    }

    public String statusLateCheckout13_15h = "checkout trễ 13-15h";
    public String statusLateCheckout15_18h = "checkout trễ 15-18h";
    public String statusLateCheckoutAfter18h = "checkout trễ sau 18h";

    @PutMapping("/booking/{bookingId}/checkout")
    public ResponseEntity<String> checkoutBooking(@PathVariable Long bookingId){

        BookedRoom bookedRoom = iBookingService.GetBookingById(bookingId).orElse(null);
        String status =  iBookingService.checkoutBooking(bookingId, statusLateCheckout13_15h,
                statusLateCheckout15_18h, statusLateCheckoutAfter18h);

        if(!status.toLowerCase().contains("lỗi")){
            iBookingService.SaveCheckoutBooking(bookingId, status);
        }


        return ResponseEntity.ok(status);
    }

    @PutMapping("/booking/{bookingId}/cancel")
    public ResponseEntity<Boolean> cancelBooking(@PathVariable Long bookingId){

        boolean cancel =  iBookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(cancel);
    }

    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<List<BookedRoomResponse>> getBookingsByUserEmail(@PathVariable String email) {
        List<BookedRoom> bookings = iBookingService.getBookingsByUserEmail(email);
        List<BookedRoomResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookedRoomResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @GetMapping("/id/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable Long bookingId){
        try{
            BookedRoom booking = iBookingService.findByBookingId(bookingId);
            BookedRoomResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch (ResourceNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode){
        try{
            BookedRoom booking = iBookingService.findByBookingConfirmationCode(confirmationCode);
            BookedRoomResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch (ResourceNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping("/room/{roomId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long roomId, @RequestBody BookedRoom bookingRequest){

        try{
            System.out.println("dữ liệu booking nhận được: " +
                    ReflectionToStringBuilder.toString(bookingRequest, ToStringStyle.MULTI_LINE_STYLE));
            String confirmationCode = iBookingService.saveBooking(roomId, bookingRequest);
            return ResponseEntity.ok(confirmationCode);

        }catch (InvalidBookingRequestException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all-bookings")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BookedRoomResponse>> getAllBookings(){
        List<BookedRoom> bookings = iBookingService.getAllBookings();
        List<BookedRoomResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings){
            BookedRoomResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @GetMapping("/{bookingId}/service")
    public List<ServiceResponse> GetAllServiceResponseOfBooking(@PathVariable Long bookingId){
        Optional<BookedRoom> optionalBookedRoom = iBookingService.GetBookingById(bookingId);
        if (optionalBookedRoom.isPresent()){
            BookedRoom bookedRoom = optionalBookedRoom.get();
            return bookedRoom.getServices().stream()
                    .map(service -> new ServiceResponse(service.getId(), service.getServiceName(), service.getDescription(), service.getStatus()))
                    .toList();
        } else {
            // Xử lý trường hợp không tìm thấy Room (ví dụ: trả về một danh sách rỗng hoặc ném ngoại lệ)
            return Collections.emptyList();
        }
    }

    public BookedRoomResponse getBookingResponse(BookedRoom booking) {
        Room theRoom = iRoomService.getRoomById(booking.getRoom().getId()).orElse(new Room());
        RoomResponse room = roomController.GetRoomResponse(theRoom);

        List<ServiceResponse> serviceResponses = GetAllServiceResponseOfBooking(booking.getId());

        UserResponse userResponse = userController.GetUserResponse(booking.getUser());

        //BillResponse billResponse = billController.GetBillResponse(booking.getBill());
        BillResponse billResponse = new BillResponse();

        List<Surcharge> surcharges = booking.getSurcharges();
        List<SurchargeResponse> surchargeResponses = new ArrayList<>();
        if(surcharges != null){
            for(Surcharge surcharge : surcharges){
                surchargeResponses.add(surchargesController.GetSurchargeResponse(surcharge));
            }
        }

        return new BookedRoomResponse(
                booking.getId(), booking.getBookingDateTime(), booking.getCheckInDate(),
                booking.getCheckOutDate(),booking.getGuestFullName(),
                booking.getGuestEmail(), booking.getNumOfAdults(),
                booking.getNumOfChildren(), booking.getChildren5_11(), booking.getTotalNumOfGuest(),
                booking.getNumOfRoom(),
                booking.getBookingConfirmationCode(), booking.getStatus(), room, serviceResponses,
                userResponse, billResponse, surchargeResponses);
    }
}
