import BookedRoom from "../../model/BookedRoom"
import {api, getHeader} from "./axios"

export async function AddUsedServiceOfBooking(bookingId, services) {
	try{
	const response = await api.put(`/bookings/${bookingId}/services/update`, services,{
		headers: getHeader()
	})
	if (response.data) {
		return true
	} else {
		return false
	}
	}catch(err){
		console.log("looix rooif: ",err);
	  	throw new Error("Error adding surcharge");
	}
}

/* This function saves a new booking to the databse */
export async function bookRoom(roomId, booking) {
	try {
		console.log("dữ liệu booking nhận được: ", booking)
		const response = await api.post(`/bookings/room/${roomId}/booking`, booking)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

/* This function gets alll bokings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings", {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}

/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
	try {
		const result = await api.put(`/bookings/booking/${bookingId}/cancel`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

export async function getBookingById(bookingId) {
	try {
		const result = await api.get(`/bookings/id/${bookingId}`)
		if(result.data){
			const booking = result.data
			const bookingInfo = new BookedRoom(
				booking.id,
				booking.bookingDateTime,
				booking.checkInDate,
				booking.checkOutDate,
				booking.guestFullName,
				booking.guestEmail,
				booking.numOfAdults,
				booking.numOfChildren,
				booking.children5_11,
				booking.totalNumOfGuest,
				booking.numOfRoom,
				booking.bookingConfirmationCode,
				booking.status,
				booking.room,
				booking.services,
				booking.user,
				booking.bill,
				booking.surcharges
			);
			console.log("booking info nhận được ở api: ", booking);
			
			return bookingInfo;
		}
		else
			return null
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}

/* This function get booking by the cnfirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
	try {
		const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
		if(result.data){
			const booking = result.data
			const bookingInfo = new BookedRoom(
				booking.id,
				booking.bookingDateTime,
				booking.checkInDate,
				booking.checkOutDate,
				booking.guestFullName,
				booking.guestEmail,
				booking.numOfAdults,
				booking.numOfChildren,
				booking.children5_11,
				booking.totalNumOfGuest,
				booking.numOfRoom,
				booking.bookingConfirmationCode,
				booking.status,
				booking.room,
				booking.services,
				booking.user,
				booking.bill,
				booking.surcharges
			);
			console.log("booking info nhận được ở api: ", booking);
			
			return bookingInfo;
		}
		else
			return null
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
    //id này được lưu là email trong localstorage. Nên là getByEmail ở backend
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		if(response.data){
			const bookingList = response.data.map(booking => new BookedRoom(
				booking.id,
				booking.bookingDateTime,
				booking.checkInDate,
				booking.checkOutDate,
				booking.guestFullName,
				booking.guestEmail,
				booking.numOfAdults,
				booking.numOfChildren,
				booking.children5_11,
				booking.totalNumOfGuest,
				booking.numOfRoom,
				booking.bookingConfirmationCode,
				booking.status,
				booking.room,
				booking.services,
				booking.user,
				booking.bill,
				booking.surcharges
			));
			return bookingList;
		}
		else
			return null
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}

export async function checkinBooking(bookingId) {
	try {
		const result = await api.put(`/bookings/booking/${bookingId}/checkin`)
		return result.data
	} catch (error) {
		throw new Error(`Error check in booking :${error.message}`)
	}
}

export async function checkoutBooking(bookingId) {
	try {
		const result = await api.put(`/bookings/booking/${bookingId}/checkout`)
		return result.data
	} catch (error) {
		throw new Error(`Error check out booking :${error.message}`)
	}
}