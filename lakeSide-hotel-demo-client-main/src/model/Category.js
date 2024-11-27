class Category {
    constructor(id = null, type = null, description = null, rooms = null) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.rooms = rooms; // Mảng các đối tượng RoomModel
    }
}

export default Category;