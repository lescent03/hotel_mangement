package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.model.BookedRoom;
import com.dailycodework.lakesidehotel.model.Surcharge;
import com.dailycodework.lakesidehotel.response.SurchargeResponse;
import com.dailycodework.lakesidehotel.service.IBookingService;
import com.dailycodework.lakesidehotel.service.ISurchargeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/surcharges")
public class SurchargesController {
    private final ISurchargeService iSurchargeService;
    private final IBookingService iBookingService;

    @DeleteMapping("/{surchargeId}/surcharge/delete")
    public SurchargeResponse cancelSurcharge(@PathVariable Long surchargeId){
        Surcharge surchargeCancel = iSurchargeService.CancelSurcharge(surchargeId);
        return GetSurchargeResponse(surchargeCancel);
    }

    @PutMapping("/surcharge/update/{surchargeId}")
    public SurchargeResponse UpdateSurchargeOfBooking(@PathVariable Long surchargeId,
                                                      @RequestBody Surcharge surchargeUpdate){
        Surcharge surcharge1 = iSurchargeService.UpdateSurchargeOfBooking(surchargeId, surchargeUpdate);
        return GetSurchargeResponse(surcharge1);
    }

    @PostMapping("/{bookingId}/surcharge")
    public SurchargeResponse CreateSurchargeForBooking(@PathVariable Long bookingId,
                                               @RequestBody Surcharge surcharge){
        BookedRoom bookedRoom = iBookingService.GetBookingById(bookingId).orElse(null);
        Surcharge surcharge1 = iSurchargeService.CreateSurchargeForBooking(bookedRoom, surcharge);
        return GetSurchargeResponse(surcharge1);
    }

    @GetMapping("/surcharge/{surchargeId}")
    public SurchargeResponse GetSurchargeById(@PathVariable Long surchargeId){
        Surcharge surcharge = iSurchargeService.GetSurchargeById(surchargeId);
        if(surcharge != null)
            return GetSurchargeResponse(surcharge);
        return null;
    }

    @GetMapping("/booking/{bookingId}")
    public List<SurchargeResponse> GetSurchargeOfBooking(@PathVariable Long bookingId){
        List<Surcharge> surcharges = iSurchargeService.GetSurchargeOfBooking(bookingId);
        List<SurchargeResponse> surchargeResponses = new ArrayList<>();
        for(Surcharge surcharge: surcharges){
            surchargeResponses.add(GetSurchargeResponse(surcharge));
        }
        return surchargeResponses;
    }

    public SurchargeResponse GetSurchargeResponse(Surcharge surcharge){
        return new SurchargeResponse(surcharge.getId(), surcharge.getContent(), surcharge.getQuantity(),
                surcharge.getPrice(), surcharge.getTotal(), surcharge.getStatus());
    }
}
