package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.BookedRoom;
import com.dailycodework.lakesidehotel.model.Surcharge;
import com.dailycodework.lakesidehotel.repository.SurchargeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurchargeService implements  ISurchargeService{
    private final SurchargeRepository surchargeRepository;

    @Override
    public  Surcharge CancelSurcharge(Long surchargeId){
        Surcharge surchargeCancel = surchargeRepository.findById(surchargeId).orElse(null);
        if(surchargeCancel != null){
            surchargeCancel.setPrice(BigDecimal.valueOf(0));
            surchargeCancel.setQuantity(0);
            surchargeCancel.SetTotal();
            surchargeCancel.setStatus("đã hủy");
            return surchargeRepository.save(surchargeCancel);
        }
        else
            return new Surcharge();
    }

    @Override
    public Surcharge UpdateSurchargeOfBooking(Long surchargeId, Surcharge surchargeUpdate){
        Surcharge surcharge = surchargeRepository.findById(surchargeId).orElse(null);
        if(surcharge != null) {
            surcharge = UpdateSurcharge(surcharge, surchargeUpdate);
            return surchargeRepository.save(surcharge);
        }
        else
            return new Surcharge();
    }

    public Surcharge UpdateSurcharge(Surcharge surcharge, Surcharge surchargeUpdate){
        surcharge.setContent(surchargeUpdate.getContent());
        surcharge.setQuantity(surchargeUpdate.getQuantity());
        surcharge.setPrice(surchargeUpdate.getPrice());
        surcharge.SetTotal();
        surcharge.setStatus(surchargeUpdate.getStatus());
        return surcharge;
    }

    @Override
    public Surcharge CreateSurchargeForBooking(BookedRoom bookedRoom, Surcharge surcharge){

        if(bookedRoom != null){
            surcharge.SetTotal();
            surcharge.setStatus("chưa thanh toán");
            bookedRoom.AddSurcharges(surcharge);
            return surchargeRepository.save(surcharge);
        }
        return null;
    }

    @Override
    public Surcharge GetSurchargeById(Long surchargeId){
        return surchargeRepository.findById(surchargeId).orElse(null);
    }

    @Override
    public List<Surcharge> GetSurchargeOfBooking(Long bookingId){
        return surchargeRepository.findByBookedRoomId(bookingId);
    }
}
