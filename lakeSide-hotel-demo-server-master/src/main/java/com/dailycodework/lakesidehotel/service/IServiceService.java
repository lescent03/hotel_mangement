package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Service;
import com.dailycodework.lakesidehotel.model.Surcharge;

import java.util.List;
import java.util.Optional;

public interface IServiceService {

    List<Service> getUsedServicesOfBooking(Long bookingId);

    Optional<Service> findById(Long serviceId);

    List<Service> GetAllService();

    Service CreateService(Service service);

    Service UpdateService(Long serviceId, Service serviceUpdate);

}
