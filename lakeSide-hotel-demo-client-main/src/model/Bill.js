class Bill {
    constructor(id = null, content = null, date = null, total = null, bookedRoom = null, user = null, status = null) {
        this.id = id;
        this.content = content;
        this.date = date;
        this.total = total;
        this.bookedRoom = bookedRoom;
        this.user = user;
        this.status = status;
    }
}

export default Bill;