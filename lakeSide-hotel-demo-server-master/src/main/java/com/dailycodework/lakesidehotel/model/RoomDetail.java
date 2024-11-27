package com.dailycodework.lakesidehotel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Simpson Alfred
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
public class RoomDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String info;
    @Lob
    private Blob photo;
    private String photo_url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    public RoomDetail() {};
}
