package com.dailycodework.lakesidehotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

import java.math.BigDecimal;
import java.text.CollationElementIterator;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

/**
 * @author Simpson Alfred
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String codeRoom;
    private BigDecimal price;
    private int adults;
    private int childrents;
    private int numOfRoom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy="room", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomDetail> roomDetails;

    @OneToMany(mappedBy="room", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Status> statuses = new ArrayList<>();

    @ManyToMany(mappedBy = "rooms", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH})
    private List<Service> services;

    @OneToMany(mappedBy="room", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookedRoom> bookings;

    public Room() {
        this.roomDetails = new ArrayList<>();
        this.bookings = new ArrayList<>();
        this.services = new ArrayList<>();
    }
    public void addBooking(BookedRoom booking){
        if (bookings == null){
            bookings = new ArrayList<>();
        }
        bookings.add(booking);
        booking.setRoom(this);
        String bookingCode = RandomStringUtils.randomNumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
    }

    public void AddStatus(Status status){
        if (this.statuses == null){
            this.statuses = new ArrayList<>();
        }
        this.statuses.add(status);
        status.setRoom(this);
    }

    public BigDecimal GetTotalRoomPrice(){
        BigDecimal total = this.getPrice();
//        List<Service> services1 = this.getServices();
//        if(services1 != null){
//            for(Service service:services1){
//                total = total.add(service.getPrice());
//            }
//        }
        return total;
    }

}
