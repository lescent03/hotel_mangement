package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.model.Bill;
import com.dailycodework.lakesidehotel.model.User;
import com.dailycodework.lakesidehotel.response.BillResponse;
import com.dailycodework.lakesidehotel.response.UserResponse;
import com.dailycodework.lakesidehotel.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bills")
public class BillController {
    private final UserController userController;

    public BillResponse GetBillResponse(Bill bill){
        User user = bill.getUser();
        UserResponse userResponse = userController.GetUserResponse(user);
        return new BillResponse(bill.getId(), bill.getContent(), bill.getDate(), bill.getTotal(), userResponse, bill.getStatus());
    }
}
