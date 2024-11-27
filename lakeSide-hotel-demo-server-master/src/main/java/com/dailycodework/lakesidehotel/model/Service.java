package com.dailycodework.lakesidehotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.*;

/**
 * @author Simpson Alfred
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique ID for the service

    private String serviceName; // Name of the service

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;

    @JsonIgnore  // Đặt @JsonIgnore ở đây để tránh circular reference
    @ManyToMany(mappedBy = "services")
    private List<BookedRoom> bookedRooms;

    @ManyToMany(fetch = FetchType.EAGER,
            cascade = {CascadeType.PERSIST,
                    CascadeType.MERGE, CascadeType.DETACH})
    @JoinTable(name = "room_service",
            joinColumns = @JoinColumn(name = "service_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "room_id", referencedColumnName = "id"))
    private List<Room> rooms;

    public Service(){
        this.bookedRooms = new ArrayList<>();
        this.rooms = new ArrayList<>();
    }

    public void AddBookedRoom(BookedRoom bookedRoom){
        this.bookedRooms.add(bookedRoom);
    }

    public void AddRoom(Room room){
        this.rooms.add(room);
    }

    public void RemoveRoom(Room room){
        this.rooms.remove(room);
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Service service = (Service) o;
        return Objects.equals(id, service.id) &&
                Objects.equals(serviceName, service.serviceName) &&
                Objects.equals(description, service.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, serviceName, description);
    }
}
