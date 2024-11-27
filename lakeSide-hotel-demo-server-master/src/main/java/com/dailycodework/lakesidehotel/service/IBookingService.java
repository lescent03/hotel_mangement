package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.BookedRoom;
import com.dailycodework.lakesidehotel.model.Service;

import java.util.List;
import java.util.Optional;

public interface IBookingService {
    List<BookedRoom> getAllBookings();

    Optional<BookedRoom> GetBookingById(Long bookingId);

    String saveBooking(Long roomId, BookedRoom bookingRequest);

    Boolean UpdateUsedServiceOfBooking(Long bookingId, List<Service> services);

    BookedRoom UpdateBooking(Long bookingId, BookedRoom bookedRoomUpdate);

    BookedRoom findByBookingId(Long bookingId);

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> getBookingsByUserEmail(String email);

    boolean cancelBooking(Long bookingId);

    String checkinBooking(Long bookingId, String statusEarlyCheckinBefor5h,
                          String statusEarlyCheckin5_9h, String statusEarlyCheckin9_14h);

    String checkoutBooking(Long bookingId, String statusLateCheckout13_15h,
                          String statusLateCheckout15_18h, String statusLateCheckoutAfter18h);

    void SaveCheckinBooking(Long bookingId, String status);

    void SaveCheckoutBooking(Long bookingId, String status);
}
