class User {
    constructor(id = null, firstName = null, lastName = null, email = null, password = null, idNumber = null, roles = null, bookedRooms = null, bills = null) {
        this.id = id; // Mặc định là null (kiểu bigint)
        this.firstName = firstName; // Chuỗi (String), mặc định là null
        this.lastName = lastName; // Chuỗi (String), mặc định là null
        this.email = email; // Chuỗi (String), mặc định là null
        this.password = password; // Chuỗi (String), mặc định là null
        this.idNumber = idNumber; // Số (number), mặc định là null
        this.roles = roles; // Mảng các đối tượng Role, mặc định là null
        this.bookedRooms = bookedRooms; // Mảng các đối tượng BookedRoom, mặc định là null
        this.bills = bills; // Mảng các đối tượng Bill, mặc định là null
    }
}

export default User;