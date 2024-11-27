import React from "react"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "/node_modules/bootstrap/dist/js/bootstrap.min.js"
import ExistingRooms from "./components/room/ExistingRooms"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/home/Home"
import RoomDetail from "./components/room/RoomDetail"
import EditRoom from "./components/room/EditRoom"
import AddRoom from "./components/room/AddRoom"
import NavBar from "./components/layout/NavBar"
import Footer from "./components/layout/Footer"
import RoomListing from "./components/room/RoomListing"
import Admin from "./components/admin/Admin"
import Checkout from "./components/booking/Checkout"
import BookingSuccess from "./components/booking/BookingSuccess"
import Bookings from "./components/booking/Bookings"
import FindBooking from "./components/booking/FindBooking"
import Login from "./components/auth/Login"
import Registration from "./components/auth/Registration"
import Profile from "./components/auth/Profile"
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
import RoomStatus from "./components/roomStatus/RoomStatus"
import AddStatus from "./components/roomStatus/AddStatus"
import EditStatus from "./components/roomStatus/EditStatus"
import Categories from "./components/Category/Categories"
import AddCategory from "./components/Category/AddCategory"
import EditCategory from "./components/Category/EditCategory"
import Roles from "./components/role/Roles"
import AddRole from "./components/role/AddRole"
import EditRole from "./components/role/EditRole"
import Users from "./components/users/Users"
import GrandRoleToUser from "./components/users/GrandRoleToUser"
import Checkin from "./components/checkin/Checkin"
import Surcharge from "./components/surchrage/Surchrage"
import AddSurcharge from "./components/surchrage/AddSurcharge"
import EditSurcharge from "./components/surchrage/EditSurcharge"
import UsedService from "./components/usedService/UsedService"
import AddUsedService from "./components/usedService/AddUsedService"
import Services from "./components/services/Services"
import AddService from "./components/services/AddService"
import EditService from "./components/services/EditService"
//import EditService from "./components/services/EditService"

function App() {
	return (
		<AuthProvider>
			<main>
				<Router>
					<NavBar />
					<Routes>
						<Route path="/" element={<Home />} />

						<Route path="/edit-room/:roomId" element={<EditRoom />} />
						<Route path="/existing-rooms" element={<ExistingRooms />} />
						<Route path="/add-room" element={<AddRoom />} />
						<Route path="/detail-room/:roomId" element={<RoomDetail/>}/>

						<Route path="/status-rooms" element={<RoomStatus/>}/>
						<Route path="/add-status/:roomId" element={<AddStatus/>}/>
						<Route path="/edit-status/:statusId" element={<EditStatus/>}/>

						<Route path="/categories" element={<Categories/>}/>
						<Route path="/add-category" element={<AddCategory />} />
						<Route path="/edit-category/:categoryId" element={<EditCategory/>}/>

						<Route path="/roles" element={<Roles/>}/>
						<Route path="/add-role" element={<AddRole />} />
						<Route path="/edit-role/:roleId" element={<EditRole/>}/>

						<Route path="/users" element={<Users/>}/>
						<Route path="/grand-permission/:userId" element={<GrandRoleToUser/>}/>

						<Route path="/services" element={<Services/>}/>
						<Route path="/add-service" element={<AddService />} />
						<Route path="/edit-service/:serviceId" element={<EditService/>}/>

						<Route path="/checkin-checkout" element={<Checkin/>}/>

						<Route path="/surcharge/:bookingId" element={<Surcharge/>}/>
						<Route path="/add-surcharge/:bookingId" element={<AddSurcharge />} />
						<Route path="/edit-surcharge/:surchargeId" element={<EditSurcharge />} />

						<Route path="/used-service/:bookingId" element={<UsedService/>}/>
						<Route path="/add-used-service/:bookingId" element={<AddUsedService/>}/>
{/* 
						<Route path="/bill/:bookingId" element={<Bill/>}/> */}

						<Route
							path="/book-room/:roomId"
							element={
								// <RequireAuth>
								// 	<Checkout />
								// </RequireAuth>
								<Checkout />
							}
						/>
						<Route path="/browse-all-rooms" element={<RoomListing />} />

						<Route path="/admin" element={<Admin />} />
						<Route path="/booking-success" element={<BookingSuccess />} />
						<Route path="/existing-bookings" element={<Bookings />} />
						<Route path="/find-booking" element={<FindBooking />} />

						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Registration />} />

						<Route path="/profile" element={<Profile />} />
						<Route path="/logout" element={<FindBooking />} />
					</Routes>
				</Router>
				<Footer />
			</main>
		</AuthProvider>
	)
}

export default App
