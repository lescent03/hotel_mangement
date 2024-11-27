package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.BookedRoom;
import com.dailycodework.lakesidehotel.model.Surcharge;

import java.util.List;

public interface ISurchargeService {
    Surcharge CreateSurchargeForBooking(BookedRoom bookedRoom, Surcharge surcharge);

    Surcharge UpdateSurchargeOfBooking(Long surchargeId, Surcharge surchargeUpdate);

    Surcharge CancelSurcharge(Long surchargeId);

    Surcharge GetSurchargeById(Long surchargeId);

    List<Surcharge> GetSurchargeOfBooking(Long bookingId);
}
