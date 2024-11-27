import React from "react"
import { Link } from "react-router-dom"

const Admin = () => {
	return (
		<section className="container mt-5">
			<h2>Welcome to Adimin Panel</h2> <hr />
			<Link to={"/existing-rooms"}>Manage Rooms</Link> <br />
			<Link to={"/existing-bookings"}>Manage Bookings</Link> <br/>
			<Link to={"/status-rooms"}>Manage Room Status</Link> <br />
			<Link to={"/categories"}>Manage categorys</Link> <br />
			<Link to={"/roles"}>Manage roles</Link> <br />
			<Link to={"/users"}>Manage users</Link> <br />
			<Link to={"/services"}>Manage service</Link> <br />
			<Link to={"/checkin-checkout"}>Check in/Check out</Link> <br />
		</section>
	)
}

export default Admin
