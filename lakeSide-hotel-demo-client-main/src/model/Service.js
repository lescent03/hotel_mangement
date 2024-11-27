class Service {
    constructor(id = null, serviceName = null, description = null, bookedRooms = null, rooms = null, status = null) {
        this.id = id;
        this.serviceName = serviceName;
        this.description = description;
        this.bookedRooms = bookedRooms; // Mảng các đối tượng BookedRoom
        this.rooms = rooms; // Đối tượng của class RoomModel
        this.status = status;
    }
}

export default Service;
