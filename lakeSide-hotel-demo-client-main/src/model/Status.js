class Status {
    constructor(id = null, startDate = null, endDate = null, status = null, 
        description = null, room = null) {
        this.id = id;
        this.startDate = startDate; // Kiểu Date
        this.endDate = endDate; // Kiểu Date
        this.status = status; // Chuỗi (String)
        this.description = description; // Chuỗi (String)
        this.room = room; // Đối tượng của class RoomModel
    }
}

export default Status;