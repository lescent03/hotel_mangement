package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.RoomDetail;
import com.dailycodework.lakesidehotel.repository.RoomDetailRepository;
import com.dailycodework.lakesidehotel.response.RoomDetailResponse;
import com.dailycodework.lakesidehotel.response.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RoomDetailService implements  IRoomDetailService{
    private final RoomDetailRepository roomDetailRepository;

    @Override
    public List<RoomDetail> getAllRoomDetailByRoomId(Long roomId) {
        return roomDetailRepository.findAllByRoomId(roomId);
    }

    public Optional<RoomDetail> GetRoomDetailById(Long id){
        return  roomDetailRepository.findById(id);
    }

    public void RemoveRoomDetailById(Long id){
        roomDetailRepository.deleteById(id);
    }

    public  RoomDetail SetBasicInfoRoomDetail(RoomDetail roomDetail, RoomDetailResponse roomDetailResponse) throws SQLException {
        roomDetail.setInfo(roomDetailResponse.getInfo());

        String photoString = roomDetailResponse.getPhoto();
        if(!Objects.equals(photoString, null)){
            byte[] photoByte = Base64.getDecoder().decode(photoString);
            Blob photoBlob = new SerialBlob(photoByte);
            roomDetail.setPhoto(photoBlob);
        }
        roomDetail.setPhoto_url(roomDetailResponse.getPhoto_url());
        return roomDetail;
    }

    public Room SetRoomDetail(Room currentRoom, RoomResponse newRoom) throws SQLException {
        List<RoomDetailResponse> roomDetailResponses = newRoom.getRoomDetails();
        List<RoomDetail> roomDetails = currentRoom.getRoomDetails();
        List<Long> idRoomDetailCurrents = new ArrayList<>();
        List<Long> idRoomDetailNews = new ArrayList<>();
        if(roomDetailResponses != null) {
            for (RoomDetailResponse roomDetailResponse : roomDetailResponses) {
                idRoomDetailNews.add(roomDetailResponse.getId());
            }
        }
        for(RoomDetail roomDetail : roomDetails){
            idRoomDetailCurrents.add(roomDetail.getId());
        }
        System.out.println("danh sách id hiện tại: " + idRoomDetailCurrents);
        System.out.println("danh sách id mới: " + idRoomDetailNews);
        if(roomDetailResponses != null){
            for (RoomDetailResponse roomDetailResponse : roomDetailResponses) {
                RoomDetail roomDetail;
                if(roomDetailResponse.getId() == null){
                    roomDetail = new RoomDetail();
                }
                else{
                    roomDetail = GetRoomDetailById(roomDetailResponse.getId()).orElse(new RoomDetail());
                }
                roomDetail = SetBasicInfoRoomDetail(roomDetail, roomDetailResponse);
                roomDetail.setRoom(currentRoom);
                if(roomDetailResponse.getId() == null){
                    roomDetails.add(roomDetail);
                }
            }
        }

        idRoomDetailNews.removeIf(Objects::isNull);
        List<Long> diffIds = new ArrayList<>(idRoomDetailCurrents);
        diffIds.removeAll(idRoomDetailNews);
        System.out.println("danh sách id cần xóa: " + diffIds);

        Iterator<RoomDetail> iterator = roomDetails.iterator();
        while (iterator.hasNext()) {
            RoomDetail roomDetail = iterator.next();
            Long id = roomDetail.getId();
            if (diffIds.contains(id)) {
                iterator.remove();
            }
        }
        currentRoom.setRoomDetails(roomDetails);

        return currentRoom;
    }
}
