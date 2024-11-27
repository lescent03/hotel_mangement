class BookedRoom {
    constructor(
        id = null,
        bookingDateTime = null,
        checkInDate = null,
        checkOutDate = null,
        guestFullName = null,
        guestEmail = null,
        NumOfAdults = null,
        NumOfChildren = null,
        children5_11 = null,
        totalNumOfGuest = null,
        numOfRoom = null,
        bookingConfirmationCode = null,
        status = null,
        room = null, // Đối tượng của class RoomModel
        services = null, // Mảng các đối tượng của class Service
        user = null, // Đối tượng của class User
        bill = null, // Đối tượng của class Bill
        surcharges = null // Mảng các đối tượng của class Surcharge
    ) {
        this.id = id;
        this.bookingDateTime = bookingDateTime;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.guestFullName = guestFullName;
        this.guestEmail = guestEmail;
        this.NumOfAdults = NumOfAdults;
        this.NumOfChildren = NumOfChildren;
        this.children5_11 = children5_11;
        this.totalNumOfGuest = totalNumOfGuest;
        this.numOfRoom = numOfRoom;
        this.bookingConfirmationCode = bookingConfirmationCode;
        this.status = status;
        this.room = room;
        this.services = services;
        this.user = user;
        this.bill = bill;
        this.surcharges = surcharges;
    }
}

export default BookedRoom;