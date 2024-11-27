package com.dailycodework.lakesidehotel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Surcharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String content;
    private int quantity;
    private BigDecimal price;
    private BigDecimal total;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookedRoom_id")
    private BookedRoom bookedRoom;

    public void SetTotal(){
        this.total = price.multiply(BigDecimal.valueOf(quantity));
    }
}
