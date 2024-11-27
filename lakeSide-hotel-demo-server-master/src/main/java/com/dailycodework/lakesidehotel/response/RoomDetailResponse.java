package com.dailycodework.lakesidehotel.response;

import lombok.*;
import org.apache.tomcat.util.codec.binary.Base64;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomDetailResponse {
    private  Long id;
    private String info;
    private String photo;
    private String photo_url;
    private RoomResponse room;

    public RoomDetailResponse(Long id, String info, byte[] photoBytes, String photoUrl) {
        this.id = id;
        this.info = info;
        this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
        this.photo_url = photoUrl;
    }

}
