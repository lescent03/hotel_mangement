package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Bill;
import com.dailycodework.lakesidehotel.model.BookedRoom;
import com.dailycodework.lakesidehotel.model.User;
import com.dailycodework.lakesidehotel.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BillService implements  IBillService{
    private final BillRepository billRepository;

    public Optional<Bill> FindBillById(Long id){
        return billRepository.findById(id);
    }

    public Bill UpdateBillOfBooking(Long billId, String status){
        Bill bill = billRepository.findById(billId).orElse(null);
        if(bill != null){
            bill.setTotal(CalculateTotalPriceOfBooking(bill.getBookedRoom()));
            if(!Objects.equals(status, "")){
                bill.setStatus(status);
            }
            return billRepository.save(bill);
        }
        else return new Bill();
    }

    public Bill CreateBillPaymentOfBooking(BookedRoom bookingRoom, User user){
        Bill bill = new Bill();
        bill.setContent("Thanh toán tiền phòng");
        bill.setDate(LocalDate.now());

        bill.setTotal(CalculateTotalPriceOfBooking(bookingRoom));
        bill.setStatus("da thanh toan");

        bill.setBookedRoom(bookingRoom);
        bookingRoom.AddBill(bill);

        bill.setUser(user);
        user.AddBookingRoom(bookingRoom);
        user.AddBill(bill);
        return billRepository.save(bill);
    }

    public BigDecimal CalculateTotalPriceOfBooking(BookedRoom bookingRoom){
        //BigDecimal total = bookingRoom.getRoom().GetTotalRoomPrice();
        BigDecimal total = bookingRoom.getRoom().getPrice();
        long diffInDays = ChronoUnit.DAYS.between(bookingRoom.getCheckInDate(), bookingRoom.getCheckOutDate());
//        List<com.dailycodework.lakesidehotel.model.Service> services = bookingRoom.getServices();
//        if(services != null){
//            for(com.dailycodework.lakesidehotel.model.Service service:services){
//                total = total.add(service.getPrice());
//            }
//        }
        return total.multiply(BigDecimal.valueOf(diffInDays)).multiply(BigDecimal.valueOf(bookingRoom.getNumOfRoom()));
    }
}
