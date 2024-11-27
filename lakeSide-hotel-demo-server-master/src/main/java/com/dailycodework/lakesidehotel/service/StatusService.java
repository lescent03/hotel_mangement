package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.Status;
import com.dailycodework.lakesidehotel.repository.StatusRepository;
import com.dailycodework.lakesidehotel.response.RoomResponse;
import com.dailycodework.lakesidehotel.response.StatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StatusService implements IStatusService {
    private final StatusRepository statusRepository;

    @Transactional
    @Override
    public Status UpdateStatus(Long statusId, Status statusUpdate){
        Status status = statusRepository.findById(statusId).orElse(null);
        if(status != null){
            status.setEndDate(LocalDate.now());
            status = statusRepository.save(status);
            String newStatusString = statusUpdate.getStatus();
            statusUpdate.setStatus("Update status id "+statusId+": "+newStatusString);
            statusUpdate.setEndDate(null);
            return AddNewStatus(status.getRoom(), statusUpdate);
        }
        else
            return new Status();
    }

    @Override
    public Optional<Status> GetById(Long statusId){
        return statusRepository.findById(statusId);
    }

    @Transactional
    @Override
    public Status AddNewStatus(Room room, Status status){
        Status newStatus = new Status(status.getStartDate(), status.getEndDate(), status.getStatus(), status.getDescription());
        Status saveStatus = new Status();
        if(room.getId() != null)
        {
            saveStatus = statusRepository.save(newStatus);
            room.AddStatus(saveStatus);
        }
        return saveStatus;
    }

    @Override
    public List<Status> getAllStatusByRoomId(Long roomId) {
        return statusRepository.findAllStatusByRoomId(roomId);
    }

    public Optional<Status> GetRoomStatusById(Long id){
        return statusRepository.findById(id);
    }

    public Status SetBasicInfoRoomStatus(Status roomStatus, StatusResponse roomStatusResponse) {
        roomStatus.setStartDate(roomStatusResponse.getStartDate());
        roomStatus.setEndDate(roomStatusResponse.getEndDate());
        roomStatus.setStatus(roomStatusResponse.getStatus());
        roomStatus.setDescription(roomStatusResponse.getDescription());
        return roomStatus;
    }

    public Room SetStatus(Room currentRoom, RoomResponse newRoom) {
        List<StatusResponse> roomStatusResponses = newRoom.getStatuses();
        List<Status> roomStatuses = currentRoom.getStatuses();
        if(roomStatusResponses != null){
            for (StatusResponse roomStatusResponse : roomStatusResponses) {
                Status roomStatus1;
                if(roomStatusResponse.getId() == null){
                    roomStatus1 = new Status();
                }
                else{
                    roomStatus1 = GetRoomStatusById(roomStatusResponse.getId()).orElse(new Status());
                }
                roomStatus1 = SetBasicInfoRoomStatus(roomStatus1, roomStatusResponse);
                roomStatus1.setRoom(currentRoom);
                if(roomStatusResponse.getId() == null){
                    roomStatuses.add(roomStatus1);
                }
            }
        }
        currentRoom.setStatuses(roomStatuses);

        return currentRoom;
    }
}
