package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.exception.InvalidBookingRequestException;
import com.dailycodework.lakesidehotel.exception.ResourceNotFoundException;
import com.dailycodework.lakesidehotel.model.Bill;
import com.dailycodework.lakesidehotel.model.BookedRoom;
import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.Surcharge;
import com.dailycodework.lakesidehotel.repository.BookedRoomRepository;
import com.dailycodework.lakesidehotel.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService implements  IBookingService{
    private final BookedRoomRepository bookedRoomRepository;
    private final ServiceRepository serviceRepository;
    private final RoomService roomService;
    private final BillService billService;
    private final ServiceService serviceService;
    private final SurchargeService surchargeService;

    @Override
    public List<BookedRoom> getAllBookings(){
        return bookedRoomRepository.findAll();
    }

    @Override
    public Optional<BookedRoom> GetBookingById(Long id){
        return  bookedRoomRepository.findById(id);
    }

    @Override
    public Boolean UpdateUsedServiceOfBooking(Long bookingId, List<com.dailycodework.lakesidehotel.model.Service> services){
        BookedRoom booking = findByBookingId(bookingId);
        if(booking != null){
            booking = serviceService.SetServiceForBooking(booking, services);
            bookedRoomRepository.save(booking);
            return true;
        }
        return false;
    }

    @Override
    public BookedRoom UpdateBooking(Long bookingId, BookedRoom bookedRoomUpdate){
        BookedRoom bookedRoom = bookedRoomRepository.findById(bookingId).orElse(null);
        if(bookedRoom != null){
            bookedRoom.setRoom(bookedRoomUpdate.getRoom());
            bookedRoom.setServices(bookedRoomUpdate.getServices());
            //Bill newBill = billService.FindBillById(bookedRoom.getBill().getId()).orElse(null);
//            if(newBill != null){
//                newBill.setTotal(billService.CalculateTotalPriceOfBooking(bookedRoomUpdate));
//                bookedRoom.setBill(newBill);
//            }
            return bookedRoomRepository.save(bookedRoom);
        }
        else return new BookedRoom();
    }

    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest){
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }
        Room room = roomService.getRoomById(roomId).orElse(new Room());
        List<BookedRoom> existingBookings = room.getBookings();
        room.addBooking(bookingRequest);
        Bill bill = billService.CreateBillPaymentOfBooking(bookingRequest, bookingRequest.getUser());
        if (bookingRequest.getServices() != null && !bookingRequest.getServices().isEmpty()) {
            List<Long> serviceIds = bookingRequest.getServices().stream()
                    .map(com.dailycodework.lakesidehotel.model.Service::getId)
                    .collect(Collectors.toList());

            List<com.dailycodework.lakesidehotel.model.Service> managedServices = serviceRepository.findAllById(serviceIds);
            bookingRequest.setServices(managedServices);
        }
        bookingRequest.calculateTotalNumberOfGuest();

        bookingRequest.setStatus("đặt thành công");
        bookingRequest.setBookingDateTime(LocalDateTime.now());
        BookedRoom saveBooking = bookedRoomRepository.save(bookingRequest);
//        boolean roomIsAvailable = roomIsAvailable(bookingRequest,existingBookings);
//        if (roomIsAvailable){
//
//        }else{
//            throw  new InvalidBookingRequestException("Sorry, This room is not available for the selected dates;");
//        }
        return bookingRequest.getBookingConfirmationCode();
    }

    @Override
    public BookedRoom findByBookingId(Long bookingId){
        return bookedRoomRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with booking id :"+bookingId));
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode){
        return bookedRoomRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with booking code :"+confirmationCode));
    }

    @Override
    public List<BookedRoom> getBookingsByUserEmail(String email){
        return bookedRoomRepository.findByGuestEmail(email);
    }

    @Override
    public boolean cancelBooking(Long bookingId) {
        BookedRoom bookedRoom = GetBookingById(bookingId).orElse(null);
        if(bookedRoom != null){
            LocalDateTime date =  bookedRoom.getBookingDateTime();
            LocalDateTime now = LocalDateTime.now();
            long daysBetween = ChronoUnit.DAYS.between(date, now); // Số ngày giữa ngày đặt và hiện tại
            String status;
            if (daysBetween <= 1) {
                status = "Hủy trong vòng 24 giờ";
            } else if (daysBetween <= 3) {
                status = "Hủy trong vòng 1-3 ngày";
            } else if (daysBetween <= 6) {
                status = "Hủy trong vòng 3-6 ngày";
            } else if (daysBetween <= 15) {
                status = "Hủy trong vòng 7-15 ngày";
            } else {
                status = "Hủy trên 15 ngày";
            }

            bookedRoom.setStatus(status); // Cập nhật trạng thái
            bookedRoomRepository.save(bookedRoom);
            return true;
        }
        return false;
    }

    @Override
    public String checkoutBooking(Long bookingId, String statusLateCheckout13_15h,
                                  String statusLateCheckout15_18h, String statusLateCheckoutAfter18h) {
        // quy định trả về dạng chuỗi phải chứa "Lỗi" bên trong nếu có lỗi để frontend nhận biết

        BookedRoom bookedRoom = GetBookingById(bookingId).orElse(null);
        if(bookedRoom != null){
            LocalDateTime now = LocalDateTime.now();
            LocalTime currentTime = now.toLocalTime();

            LocalTime checkoutLate1 = LocalTime.of(13, 0); // 14:00
            LocalTime checkoutLate2 = LocalTime.of(15, 0);   // 22:00
            LocalTime checkoutLate3 = LocalTime.of(18, 0);

            if(currentTime.isAfter(checkoutLate3))
                return  statusLateCheckoutAfter18h;
            else if(currentTime.isAfter(checkoutLate2))
                return statusLateCheckout15_18h;
            else if(currentTime.isAfter(checkoutLate1))
                return statusLateCheckout13_15h;
            else
                return "checkout thành công";
        }
        return "Lỗi! Không tìm thấy booking";
    }

    @Override
    public String checkinBooking(Long bookingId, String statusEarlyCheckinBefor5h,
                                 String statusEarlyCheckin5_9h, String statusEarlyCheckin9_14h) {
        // quy định trả về dạng chuỗi phải chứa "Lỗi" bên trong nếu có lỗi để frontend nhận biết

        BookedRoom bookedRoom = GetBookingById(bookingId).orElse(null);
        if(bookedRoom != null){
            LocalDateTime now = LocalDateTime.now();
            LocalTime currentTime = now.toLocalTime();

            LocalTime checkInStart = LocalTime.of(14, 0); // 14:00
            LocalTime checkInEnd = LocalTime.of(22, 0);   // 22:00

            if (currentTime.isBefore(checkInStart)) {
                if (currentTime.isBefore(LocalTime.of(5, 0))) {
                    return statusEarlyCheckinBefor5h;
                } else if (currentTime.isBefore(LocalTime.of(9, 0))) {
                    return statusEarlyCheckin5_9h;
                } else {
                    return statusEarlyCheckin9_14h;
                }
            } else if (currentTime.isAfter(checkInEnd)) {
                return "Late checkin";
            } else {
                return "Checkin thành công";
            }

        }
        return "Lỗi! Không tìm thấy booking";
    }

    @Override
    public void SaveCheckinBooking(Long bookingId, String status){
        BookedRoom bookedRoom = GetBookingById(bookingId).orElse(null);
        if(bookedRoom != null){
            bookedRoom.setStatus(status); // Cập nhật trạng thái
            bookedRoomRepository.save(bookedRoom);
        }
    }

    @Override
    public void SaveCheckoutBooking(Long bookingId, String status){
        BookedRoom bookedRoom = GetBookingById(bookingId).orElse(null);
        if(bookedRoom != null){
            bookedRoom.getSurcharges().forEach(surcharge -> {
                if(!surcharge.getStatus().toLowerCase().contains("hủy")){
                    surcharge.setStatus("Đã thanh toán");
                    surchargeService.UpdateSurchargeOfBooking(surcharge.getId(), surcharge);
                }
            });
            bookedRoom.setStatus(status); // Cập nhật trạng thái
            bookedRoomRepository.save(bookedRoom);
        }
    }

    public boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream()
            .noneMatch(existingBooking -> {
                // Kiểm tra xem có sự chồng chéo về thời gian hay không
                boolean timeOverlap = bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()) &&
                        bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckInDate());

                // Cho phép check-in vào ngày check-out của booking khác
                boolean isCheckInOnCheckOut = bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate());

                // Cho phép check-out vào ngày check-in của booking khác
                boolean isCheckOutOnCheckIn = bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate());

                System.out.println("Time overlap: " + timeOverlap);
                System.out.println("Is check-in on check-out: " + isCheckInOnCheckOut);
                System.out.println("Is check-out on check-in: " + isCheckOutOnCheckIn);

                // Trả về true nếu có chồng chéo thời gian và không phải các trường hợp đặc biệt
                return timeOverlap && !isCheckInOnCheckOut && !isCheckOutOnCheckIn;
            });
    }
}
