package com.dailycodework.lakesidehotel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ManyToAny;

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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String idNumber;

    @ManyToMany(fetch = FetchType.EAGER,
            cascade = {CascadeType.PERSIST,
                    CascadeType.MERGE, CascadeType.DETACH})
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> roles;

    @OneToMany(mappedBy="user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedRoom> bookedRooms;

    @OneToMany(mappedBy="user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Bill> bills;

    public User() {
        this.bookedRooms = new ArrayList<>();
        this.bills = new ArrayList<>();
        this.roles = new ArrayList<>();
    }

    public void AddBill(Bill bill){
        if(this.bills == null)
            this.bills = new ArrayList<>();
        this.bills.add(bill);
    }

    public void AddBookingRoom(BookedRoom bookedRoom){
        if(this.bookedRooms == null)
            this.bookedRooms = new ArrayList<>();
        this.bookedRooms.add(bookedRoom);
    }

    public void AddRole(Role role){
        if(this.roles == null){
            roles = new ArrayList<>();
        }
        roles.add(role);

    }

}