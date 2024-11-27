import React, { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Header from "../common/Header"
import { PaypalSuccess } from "../utils/ApiPaymentFunction"
import BookedRoom from "../../model/BookedRoom"
import { sendEmail } from "../utils/ApiSendEmailFunction"
import { bookRoom } from "../utils/ApiBookingFunction"

const BookingSuccess = () => {
	const location = useLocation()
	const [message, setMessage] = useState(location.state?.message)
	const [error, setError] = useState(location.state?.error)

	const [booking, setBooking] = useState(()=>{
		const saved = localStorage.getItem('booking');
		return saved ? JSON.parse(saved) : new BookedRoom();
	});
	const [totalPrice, setTotalPrice] = useState(()=>{
		const saved = localStorage.getItem('totalPrice');
		return (saved && saved !== "null") ? JSON.parse(saved) : 0;
	});
	const roomId = localStorage.getItem("roomId")

	const ClearLocalStorage = () => {
		localStorage.removeItem('searchQuery');
		localStorage.removeItem('numRoom');
		localStorage.removeItem('adults');
		localStorage.removeItem('children');
		localStorage.removeItem('childrenAges');
		localStorage.removeItem('totalPrice');
		localStorage.removeItem('booking');
		localStorage.removeItem('roomId');
	}

	const isBookingConfirmed = useRef(false)
	const isEffectExecuted = useRef(false)
	const handleBooking = async () => {
		try {
		  if (!isBookingConfirmed.current) {
			console.log("room id để lưu booking: ", roomId)
			const confirmationCode = await bookRoom(roomId, booking)
			setMessage(confirmationCode)
			handleSendEmail(confirmationCode)
			isBookingConfirmed.current = true
		  }
		} catch (e) {
		  console.log(e)
		  setError(e.message)
		} finally {
		  ClearLocalStorage()
		}
	  }

	  const handleSendEmail = (confirmationCode) => {
		// Lấy dữ liệu cần thiết từ booking và totalPrice
		const { guestFullName, checkInDate, checkOutDate, NumOfAdults, NumOfChildren, children5_11, numOfRoom } = booking;
		const formattedTotalPrice = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
	
		// Tạo chuỗi body HTML cho email
		const emailBody = `
			<div style="font-family: Arial, sans-serif; color: #333;">
				<h2 style="color: #2c3e50;">Cảm ơn ${guestFullName || "Quý khách"}!</h2>
				<p>Đặt phòng của bạn đã được xác nhận. Dưới đây là chi tiết đặt phòng của bạn:</p>
				<div style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
					<h3 style="color: #2c3e50;">Chi tiết đặt phòng</h3>
					<h3><strong>Mã xác nhận:</strong> ${confirmationCode}</h3>
					<p><strong>khách hàng:</strong> ${booking.user.firstName} ${booking.user.lastName}</p>
					<p><strong>Số lượng phòng:</strong> ${numOfRoom}</p>
					<p><strong>Ngày nhận phòng:</strong> ${checkInDate}</p>
					<p><strong>Ngày trả phòng:</strong> ${checkOutDate}</p>
					<p><strong>Số lượng người lớn:</strong> ${NumOfAdults}</p>
					<p><strong>Số lượng trẻ em:</strong> ${NumOfChildren} (trong đó ${children5_11 || 0} trẻ từ 5 đến 11 tuổi)</p>
				</div>
				<div style="margin-top: 10px;">
					<p><strong>Tổng giá đặt phòng:</strong> ${formattedTotalPrice}</p>
				</div>
				<p style="margin-top: 20px;">Xin cảm ơn bạn đã chọn dịch vụ của chúng tôi. Chúc bạn có một trải nghiệm tuyệt vời!</p>
				<p style="color: #7f8c8d;">Trân trọng,<br>Đội ngũ hỗ trợ</p>
			</div>
		`;
	
		// Thông tin email cần gửi
		const emailData = {
			to: 'ducanh1142003@gmail.com', // Địa chỉ người nhận
			subject: 'Cảm ơn! Đặt phòng của bạn đã được xác nhận', // Chủ đề email
			body: emailBody // Nội dung HTML của email
		};
	
		// Gọi hàm gửi email
		sendEmail(emailData);
	};
	
	
	useEffect(() => {
		const handlePayment = async () => {
			if (isEffectExecuted.current) return
				isEffectExecuted.current = true
			if (!roomId || roomId === "null" || roomId === "") {
				console.error('Vui lòng thử lại')
				setError('Vui lòng thử lại')
				return
			}

			const params = new URLSearchParams(location.search)
			const paymentId = params.get('paymentId')
			const payerId = params.get('PayerID')
			const vnp_TransactionStatus = params.get('vnp_TransactionStatus')
			const token = params.get('token')

			if (paymentId && payerId) {
				try {
					const response = await PaypalSuccess(paymentId, payerId)
					console.log("xác nhận thanh toán: ", response)
					await handleBooking()
					setMessage(prev => `${response}. ${prev}`)
				} catch (error) {
					console.error('Lỗi khi xác nhận thanh toán:', error)
					setError(error)
				}
			} else if (vnp_TransactionStatus === "00") {
				await handleBooking()
			} else if (token || vnp_TransactionStatus === "02") {
				console.log('Thanh toán đã bị hủy.')
				setError('Thanh toán đã bị hủy.')
			} else {
				console.log('Lỗi thanh toán.')
				setError('Lỗi thanh toán.')
			}
		}

		handlePayment()
	}, [roomId, location.search])
	
	return (
		<div className="container">
			<Header title="Booking Info" />
			<div className="mt-5">
				{message ? (
					<div>
						<h3 className="text-success"> Booking Info!</h3>
						<p className="text-success">Room booked successfully, Your booking confirmation code is: {message}</p>
						<p className="text-success">Xác nhận đặt phòng của bạn sẽ được gửi tới email của bạn!</p>
					</div>
				) : error? (
					<div>
						<h3 className="text-danger"> Error Booking Room!</h3>
						<p className="text-danger">{error}</p>
						
					</div>
				): <h3>Loading...</h3>}
			</div>
		</div>
	)
}

export default BookingSuccess
