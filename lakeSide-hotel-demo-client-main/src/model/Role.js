class Role {
    constructor(id = null, name = null, users = null) {
        this.id = id;
        this.name = name;
        this.users = users; // Mảng các đối tượng User
    }
}

export default Role;