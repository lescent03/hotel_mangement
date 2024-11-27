package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.Status;
import com.dailycodework.lakesidehotel.response.StatusResponse;
import com.dailycodework.lakesidehotel.service.IRoomService;
import com.dailycodework.lakesidehotel.service.IStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/statuses")
public class StatusController {
    private final IStatusService iStatusService;
    private final IRoomService iRoomService;

    @GetMapping("/id/{statusId}")
    public  ResponseEntity<StatusResponse> GetStatusById(@PathVariable Long statusId){
        Status status = iStatusService.GetById(statusId).orElse(new Status());
        return ResponseEntity.ok(GetStatusResponse(status));
    }

    @PutMapping("/status/update/{statusId}")
    public ResponseEntity<StatusResponse> UpdateStatus(@PathVariable Long statusId, @RequestBody Status statusUpdate){
        Status updateStatus = iStatusService.UpdateStatus(statusId, statusUpdate);
        if(updateStatus.getId() != null)
            return  ResponseEntity.status(HttpStatus.OK).body(GetStatusResponse(updateStatus));
        else
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new StatusResponse());
    }

    @PostMapping("/add/room/{roomId}")
    public ResponseEntity<StatusResponse> AddNewStatus (@PathVariable Long roomId, @RequestBody Status status){
        Room room = iRoomService.getRoomById(roomId).orElse(new Room());
        Status newStatus = iStatusService.AddNewStatus(room, status);
        if(newStatus.getId() != null)
            return  ResponseEntity.status(HttpStatus.CREATED).body(GetStatusResponse(newStatus));
        else
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new StatusResponse());
    }

    public StatusResponse GetStatusResponse(Status status){
        return new StatusResponse(status.getId(),  status.getStatus(),status.getDescription(),
                status.getStartDate(), status.getEndDate());
    }
}
