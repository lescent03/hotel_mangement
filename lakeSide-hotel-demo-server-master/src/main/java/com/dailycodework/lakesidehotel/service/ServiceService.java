package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.BookedRoom;
import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.repository.RoomRepository;
import com.dailycodework.lakesidehotel.repository.ServiceRepository;
import com.dailycodework.lakesidehotel.response.RoomResponse;
import com.dailycodework.lakesidehotel.response.ServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ServiceService implements IServiceService{
    private final ServiceRepository serviceRepository;
    private final RoomRepository roomRepository;

    @Override
    public com.dailycodework.lakesidehotel.model.Service UpdateService(Long serviceId,
                           com.dailycodework.lakesidehotel.model.Service serviceUpdate){
        com.dailycodework.lakesidehotel.model.Service service =
                serviceRepository.findById(serviceId).orElse(
                        new com.dailycodework.lakesidehotel.model.Service());
        service.setServiceName(serviceUpdate.getServiceName());
        service.setDescription(serviceUpdate.getDescription());
        service.setStatus(serviceUpdate.getStatus());
        return serviceRepository.save(service);
    }

    @Override
    public com.dailycodework.lakesidehotel.model.Service CreateService(com.dailycodework.lakesidehotel.model.Service service){
        return serviceRepository.save(service);
    }

    @Override
    public List<com.dailycodework.lakesidehotel.model.Service> getUsedServicesOfBooking(Long bookingId){
        return serviceRepository.findByBookedRoomId(bookingId);
    }

    @Override
    public List<com.dailycodework.lakesidehotel.model.Service> GetAllService(){
        return serviceRepository.findAll();
    }

    @Override
    public Optional<com.dailycodework.lakesidehotel.model.Service> findById(Long serviceId){
        return serviceRepository.findById(serviceId);
    }

    public BookedRoom SetServiceForBooking(BookedRoom bookedRoom, List<com.dailycodework.lakesidehotel.model.Service> newServices){
        List<com.dailycodework.lakesidehotel.model.Service> oldServices = bookedRoom.getServices();
        for(com.dailycodework.lakesidehotel.model.Service service : newServices){
            if(oldServices.contains(service)){
                continue;
            }
            else{
                service.AddBookedRoom(bookedRoom);
            }
            oldServices.add(service);
        }
        newServices.removeIf(Objects::isNull);
        List<com.dailycodework.lakesidehotel.model.Service> diffService = new ArrayList<>(oldServices);
        diffService.removeAll(newServices);

        diffService.forEach(service -> {
            bookedRoom.getServices().remove(service);
            service.getBookedRooms().remove(bookedRoom);
        });

        return bookedRoom;
    }

    public Room SetServiceForRoom(Room currentRoom, RoomResponse newRoom){
        List<ServiceResponse> serviceResponses = newRoom.getServices();
        List<com.dailycodework.lakesidehotel.model.Service> services = currentRoom.getServices();
        List<Long> idRoomServiceCurrents = new ArrayList<>();
        List<Long> idRoomServiceNews = new ArrayList<>();
        if(serviceResponses != null){
            for(ServiceResponse serviceResponse : serviceResponses){
                idRoomServiceNews.add(serviceResponse.getId());
            }
        }
        for(com.dailycodework.lakesidehotel.model.Service service : services){
            idRoomServiceCurrents.add(service.getId());
        }
        System.out.println("danh sách id hiện tại: " + idRoomServiceCurrents);
        System.out.println("danh sách id mới: " + idRoomServiceNews);

        if(serviceResponses != null){
            for (ServiceResponse service : serviceResponses ){
                com.dailycodework.lakesidehotel.model.Service service1 =
                        findById(service.getId()).orElse(
                                new com.dailycodework.lakesidehotel.model.Service());
                if(services.contains(service1)){
                    continue;
                }
                else{
                    service1.AddRoom(currentRoom);
                }
                services.add(service1);
            }
        }

        idRoomServiceNews.removeIf(Objects::isNull);
        List<Long> diffIds = new ArrayList<>(idRoomServiceCurrents);
        diffIds.removeAll(idRoomServiceNews);
        System.out.println("danh sách id cần xóa: " + diffIds);

        // Xóa mối quan hệ từ cả hai phía
        diffIds.forEach(serviceId -> {
            com.dailycodework.lakesidehotel.model.Service service = serviceRepository.findById(serviceId).orElse(null);
            if (service != null) {
                currentRoom.getServices().remove(service);
                service.getRooms().remove(currentRoom);
            }
        });

        // Lưu thay đổi
        return roomRepository.save(currentRoom);
    }

}
