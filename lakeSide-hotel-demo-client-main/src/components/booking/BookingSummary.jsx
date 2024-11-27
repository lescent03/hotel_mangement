import React, { useState, useEffect } from "react"
import moment from "moment"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"
import { Form } from "react-bootstrap"

const BookingSummary = ({ booking, payment, onConfirm, selectedPaymentMethod, setSelectedPaymentMethod, isProcessing }) => {
	const [validated, setValidated] = useState(false)
	
	const checkInDate = moment(booking.checkInDate)
	const checkOutDate = moment(booking.checkOutDate)
	const numberOfDays = checkOutDate.diff(checkInDate, "days")
	const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const navigate = useNavigate()

	const handleConfirmBooking = () => {
		setIsProcessingPayment(true)
		setTimeout(() => {
			setIsProcessingPayment(false)
			setIsBookingConfirmed(true)
			onConfirm()
		}, 3000)
	}

	// useEffect(() => {
	// 	if (isBookingConfirmed) {
	// 		navigate("/booking-success")
	// 	}
	// }, [isBookingConfirmed, navigate])

	const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
		setValidated(true)
    };

	return (
		<div className="row">
			<div className="col-md-6"></div>
			<div className="card card-body mt-5">
				<h4 className="card-title hotel-color">Reservation Summary</h4>
				<p>
					Name: <strong>{booking.user ? `${booking.user.firstName || ''} ${booking.user.lastName || ''}` : ''}</strong>
				</p>
				<p>
					Email: <strong>{booking.user?booking.user.email : ""}</strong>
				</p>
				<p>
					Check-in: <strong>{moment(booking.checkInDate).format("DD/MM/YYYY")}</strong>
				</p>
				<p>
					Check-out: <strong>{moment(booking.checkOutDate).format("DD/MM/YYYY")}</strong>
				</p>
				<p>
					Number of Days Booked: <strong>{numberOfDays}</strong>
				</p>

				<div>
					<h6 className="hotel-color">Number of Guest</h6>
					<strong>
						Adult{booking.NumOfAdults > 1 ? "s" : ""} : {booking.NumOfAdults}
					</strong>
					<strong>
						<p>Children : {booking.NumOfChildren}</p>
					</strong>
				</div>

				{payment > 0 ? (
					<>
						<p>
							Total payment: <strong>{payment.toLocaleString('vi-VN')} VND</strong>
						</p>
						<h6>Phương thức thanh toán</h6>
						<Form.Check
							type="radio"
							id="credit-card"
							label="Thẻ tín dụng/ghi nợ (Paypal)"
							value="credit-card"
							checked={selectedPaymentMethod === 'credit-card'}
							onChange={handlePaymentMethodChange}/>
						{/* <Form.Check
							type="radio"
							id="momo"
							label="Momo"
							value="momo"
							checked={selectedPaymentMethod === 'momo'}
							onChange={handlePaymentMethodChange}/> */}
						<Form.Check
							type="radio"
							id="vnpay"
							label="VNPay"
							value="vnpay"
							checked={selectedPaymentMethod === 'vnpay'}
							onChange={handlePaymentMethodChange}/>

						{validated && !isBookingConfirmed ? (
							<Button variant="success" onClick={handleConfirmBooking} disabled={isProcessing}>
								{isProcessingPayment ? (
									<>
										<span
											className="spinner-border spinner-border-sm mr-2"
											role="status"
											aria-hidden="true"></span>
										Booking Confirmed, redirecting to payment...
									</>
								) : (
									"Confirm Booking & proceed to payment"
								)}
							</Button>
						) : isBookingConfirmed ? (
							<div className="d-flex justify-content-center align-items-center">
								<div className="spinner-border text-primary" role="status">
									<span className="sr-only"></span>
								</div>
							</div>
						) : null}
					</>
				) : (
					<p className="text-danger">Check-out date must be after check-in date.</p>
				)}
			</div>
		</div>
	)
}

export default BookingSummary
