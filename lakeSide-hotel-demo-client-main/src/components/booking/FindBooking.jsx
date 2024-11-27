import React, { useEffect, useState } from "react"
import moment from "moment"
import BookedRoom from "../../model/BookedRoom"
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiBookingFunction"

const FindBooking = () => {
	const [confirmationCode, setConfirmationCode] = useState("")
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [bookingInfo, setBookingInfo] = useState(new BookedRoom())

	const emptyBookingInfo = new BookedRoom()

	const [isDeleted, setIsDeleted] = useState(false)

	const handleInputChange = (event) => {
		setConfirmationCode(event.target.value)
	}

	useEffect(()=>{
		console.log("booking info nhận được: ", bookingInfo);
		
	},[bookingInfo])

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)

		try {
			const data = await getBookingByConfirmationCode(confirmationCode)
			setBookingInfo(data)
			setError(null)
		} catch (error) {
			setBookingInfo(emptyBookingInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}

		setTimeout(() => setIsLoading(false), 2000)
	}

	const handleBookingCancellation = async (bookingId) => {
		try {
			await cancelBooking(bookingInfo.id).then((rs)=>{
				if(rs){
					setIsDeleted(true)
					setSuccessMessage("Booking has been cancelled successfully!")
					setBookingInfo(emptyBookingInfo)
					setConfirmationCode("")
					setError(null)
				}
				else{
					setError("Lỗi không thể hủy đặt phòng!")
				}
			})
			
		} catch (error) {
			setError(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setIsDeleted(false)
		}, 2000)
	}

	return (
		<>
			<div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
				<h2 className="text-center mb-4">Find My Booking</h2>
				<form onSubmit={handleFormSubmit} className="col-md-6">
					<div className="input-group mb-3">
						<input
							className="form-control"
							type="text"
							id="confirmationCode"
							name="confirmationCode"
							value={confirmationCode}
							onChange={handleInputChange}
							placeholder="Enter the booking confirmation code"
						/>

						<button type="submit" className="btn btn-hotel input-group-text">
							Find booking
						</button>
					</div>
				</form>

				{isLoading ? (
					<div>Finding your booking...</div>
				) : error ? (
					<div className="text-danger">Error: {error}</div>
				) : bookingInfo.bookingConfirmationCode ? (
					<div className="col-md-6 mt-4 mb-5">
						<h3>Booking Information</h3>
						<p className="text-success">Confirmation Code: {bookingInfo.bookingConfirmationCode}</p>
						<p>
							Booking time: {(() => {
								const bookingDateTime = bookingInfo.bookingDateTime;
								const formattedDateTime = new Date(bookingDateTime).toLocaleString("vi-VN", {
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
								});
								return formattedDateTime;
							})()}
						</p>
						<p>Number of room: {bookingInfo.numOfRoom}</p>
						<p>Room Number: {bookingInfo.room.codeRoom}</p>
						<p>Room Type: {bookingInfo.room.category.type}</p>
						<p>
							Check-in Date:{" "}
							{moment(bookingInfo.checkInDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p> 
							Check-out Date:{" "}
							{moment(bookingInfo.checkOutDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p>Full Name: {bookingInfo.guestName || `${bookingInfo.user.firstName} ${bookingInfo.user.lastName}`}</p>
						<p>Email Address: {bookingInfo.user.email}</p>
						<p>Adults: {bookingInfo.NumOfAdults}</p>
						<p>Children: {bookingInfo.NumOfChildren}</p>
						<p>Total Guest: {bookingInfo.totalNumOfGuest}</p>
						<p>Status: {bookingInfo.status}</p>

						{!isDeleted && !/hủy/i.test(bookingInfo.status) && (
							<button
								onClick={() => handleBookingCancellation(bookingInfo.id)}
								className="btn btn-danger">
								Cancel Booking
							</button>
						)}
					</div>
				) : (
					<div>find booking...</div>
				)}

				{isDeleted && <div className="alert alert-success mt-3 fade show">{successMessage}</div>}
			</div>
		</>
	)
}

export default FindBooking
