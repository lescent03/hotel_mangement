package com.dailycodework.lakesidehotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
public class BookedRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    private LocalDateTime bookingDateTime;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private String guestFullName; 

    private String guestEmail;

    @JsonProperty("NumOfAdults")
    private int NumOfAdults;

    @JsonProperty("NumOfChildren")
    private int NumOfChildren;

    private  int children5_11;

    private int totalNumOfGuest;

    private int numOfRoom;

    private String bookingConfirmationCode;

    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "used_service",
            joinColumns = @JoinColumn(name = "booking_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "service_id", referencedColumnName = "id"))
    private List<Service> services;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy="bookedRoom", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bill> bills;

    @OneToMany(mappedBy="bookedRoom", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Surcharge> surcharges;

    public BookedRoom() {
        this.surcharges = new ArrayList<>();
        this.services = new ArrayList<>();
        this.bills = new ArrayList<>();
    }

    public void calculateTotalNumberOfGuest(){
        this.totalNumOfGuest = this.NumOfAdults + NumOfChildren;
    }

    public void setNumOfAdults(int numOfAdults) {
        NumOfAdults = numOfAdults;
        calculateTotalNumberOfGuest();
    }

    public void setNumOfChildren(int numOfChildren) {
        NumOfChildren = numOfChildren;
        calculateTotalNumberOfGuest();
    }

    public void setBookingConfirmationCode(String bookingConfirmationCode) {
        this.bookingConfirmationCode = bookingConfirmationCode;
    }

    public void AddSurcharges(Surcharge surcharge){
        if(this.surcharges == null){
            this.surcharges = new ArrayList<>();
        }
        this.surcharges.add(surcharge);
        surcharge.setBookedRoom(this);
    }

    public void AddBill(Bill bill){
        if(this.bills == null){
            this.bills = new ArrayList<>();
        }
        this.bills.add(bill);
        bill.setBookedRoom(this);
    }
}
