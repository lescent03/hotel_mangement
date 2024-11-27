class RoomModel {
  constructor(id = null, codeRoom = null, price = null, adults = null, childrents = null, numOfRoom = null,
    description = null, category = null, roomDetails = null, statuses = null, services = null, bookings = null) {
      this.id = id;
      this.codeRoom = codeRoom;
      this.price = price; 
      this.adults = adults;
      this.childrents = childrents;
      this.numOfRoom = numOfRoom;
      this.description = description;
      this.category = category;
      this.roomDetails = roomDetails;
      this.statuses = statuses;
      this.services = services;
      this.bookings = bookings;
  }
}
export default RoomModel;