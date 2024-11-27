package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.Service;
import com.dailycodework.lakesidehotel.response.ServiceResponse;
import com.dailycodework.lakesidehotel.service.IServiceService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceController {
    private final IServiceService iServiceService;

    @GetMapping("/booking/{bookingId}")
    public List<ServiceResponse> getUsedServicesOfBooking(@PathVariable Long bookingId){
        List<Service> services = iServiceService.getUsedServicesOfBooking(bookingId);
        List<ServiceResponse> serviceResponses = new ArrayList<>();
        for(Service service: services){
            serviceResponses.add(GetServiceResponse(service));
        }
        return serviceResponses;
    }

    public List<ServiceResponse> getAllServiceOfRoom(Room room){
        return room.getServices().stream()
            .map(service -> new ServiceResponse(service.getId(), service.getServiceName(), service.getDescription(), service.getStatus()))
            .toList();
    }

    @GetMapping("/all-services")
    public List<ServiceResponse> GetAllService(){
        List<Service> serviceList = iServiceService.GetAllService();
        List<ServiceResponse> serviceResponses = new ArrayList<>();
        if(serviceList != null){
            for(Service service : serviceList){
                serviceResponses.add(GetServiceResponse(service));
            }
        }
        return serviceResponses;
    }

    @GetMapping("/service/{serviceId}")
    public  ServiceResponse GetServiceById(@PathVariable Long serviceId){
        Service service = iServiceService.findById(serviceId).orElse(new Service());
        return GetServiceResponse((service));
    }

    @PostMapping("/service/create")
    public ServiceResponse CreateService(@RequestBody Service service){
        Service service1 = iServiceService.CreateService(service);
        return GetServiceResponse(service1);
    }

    @PutMapping("/service/update/{serviceId}")
    public ServiceResponse UpdateService(@PathVariable Long serviceId, @RequestBody Service serviceUpdate){
        Service service1 = iServiceService.UpdateService(serviceId, serviceUpdate);
        return GetServiceResponse(service1);
    }

    public ServiceResponse GetServiceResponse(Service service){
        ServiceResponse serviceResponse = new ServiceResponse();

        serviceResponse.setId(service.getId());
        serviceResponse.setServiceName(service.getServiceName());
        serviceResponse.setDescription(service.getDescription());
        serviceResponse.setStatus(service.getStatus());
        return serviceResponse;
    }
}
