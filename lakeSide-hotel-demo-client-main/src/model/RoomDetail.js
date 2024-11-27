class RoomDetail {
    constructor(id = null, info = null, photo = null, photo_url = null, room = null) {
        this.id = id;
        this.info = info;
        this.photo = photo; // Đây là Blob ở backend
        this.photo_url = photo_url; // URL của ảnh ở backend
        this.room = room; // Đối tượng của class RoomModel
    }
}

export default RoomDetail;