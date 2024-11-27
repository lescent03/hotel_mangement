class Surcharge {
    constructor(id = null, content = null, quantity = null, price = null, 
        total = null, bookedRoom = null, status = null) {
        this.id = id; // Mặc định là null (kiểu bigint)
        this.content = content; // Chuỗi (String), mặc định là null
        this.quantity = quantity; // Số (number), mặc định là null
        this.price = price; // Số (number), mặc định là null
        this.total = total; // Số (number), mặc định là null
        this.bookedRoom = bookedRoom; // Đối tượng của class BookedRoom, mặc định là null
        this.status = status; // Chuỗi (String), mặc định là null
    }
}

export default Surcharge;