import React, { useEffect, useReducer } from "react"
import moment from "moment"
import { useState } from "react"
import BookingSummary from "./BookingSummary"
import {  CreateMomoPayment, CreatePaypalPayment, CreateVNPayPayment} from "../utils/ApiPaymentFunction";
import { useNavigate, useParams } from "react-router-dom"
import { getAvailableRooms, getRoomById } from "../utils/ApiRoomFunction"
import BookedRoom from "../../model/BookedRoom"
import { getUserByEmail } from "../utils/ApiUserFunction"
import RoomModel from "../../model/Room"

const BookingForm = ({checkInDate, checkOutDate, adults, children, numRoom, childrenAges}) => {
	// const [validated, setValidated] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(true)
	const [errorMessage, setErrorMessage] = useState("")
	const [roomPrice, setRoomPrice] = useState(0)
	const [totalPrice, setTotalPrice] = useState(()=>{
		const saved = localStorage.getItem('totalPrice');
		return (saved && saved !== "null") ? JSON.parse(saved) : 0;
	});
	useEffect(()=>{
		localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
	},[totalPrice])
	const [room, setRoom] = useState(new RoomModel())
	const [isProcessing, setIsProcessing] = useState(false)

	const currentUser = localStorage.getItem("userId")//đây là email

	const [booking, setBooking] = useState(()=>{
		const saved = localStorage.getItem('booking');
		return (saved && saved !== "null") ? JSON.parse(saved) : new BookedRoom();
	});
	useEffect(()=>{
		localStorage.setItem('booking', JSON.stringify(booking));
	},[booking])
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
	const [servicesNoShow, setServicesNoShow] = useState([])
	const [selectedServices, setSelectedServices] = useState([])
	const [disableContinue, setDisableContinue] = useState(true)
	const [messageRoomAvailable, setMessageRoomAvailable] = useState("")

	const { roomId } = useParams() // đây là id của room
	localStorage.setItem('roomId', roomId);
	const navigate = useNavigate()

	const handleInputChange = (e) => {
		const { name, value } = e.target
		if(name === "NumOfAdults" || name ==="NumOfChildren"){
			setBooking({ ...booking, [name]: parseInt(value) })
		}
		else{
			setBooking({ ...booking, [name]: value })
		}
		setErrorMessage("")
	}

	useEffect(() => {
		// Tính toán lại `totalPrice` khi `booking`, `room`, hoặc `numRoom` thay đổi
		calculatePayment();
	}, [booking, room, numRoom]);

	const getRoomPriceById = async (roomId) => {
		try {
			const response = await getRoomById(roomId)
			setRoom(response)
			setServicesNoShow(response.services)
			setRoomPrice(response.roomPrice)
		} catch (error) {
			throw new Error(error)
		}
	}

	const GetUserByEmail = async (currentUser) => {
		try {
			const response = await getUserByEmail(currentUser)
			setBooking((prevBooking) => ({...prevBooking, user : response, guestEmail: response.email}))
		} catch (error) {
			throw new Error(error)
		}
	}

	useEffect(() => {
		getRoomPriceById(roomId)
		GetUserByEmail(currentUser)
		if(checkInDate && checkOutDate && adults && numRoom ){
			setDisableContinue(false)
			setBooking((prevBooking) => ({...prevBooking, checkInDate : checkInDate}))
			setBooking((prevBooking) => ({...prevBooking, checkOutDate : checkOutDate}))
			setBooking((prevBooking) => ({...prevBooking, NumOfAdults : adults}))
			setBooking((prevBooking) => ({...prevBooking, NumOfChildren : children}))
			setBooking((prevBooking) => ({...prevBooking, numOfRoom : numRoom}))
			setBooking((prevBooking) => ({...prevBooking, children5_11 : childrenAges.filter(age => age >= 5 && age <= 11).length}))
		}
		
	}, [roomId])

	useEffect(() => {
		setBooking((prevBooking) => ({...prevBooking, services : selectedServices}))
	}, [selectedServices])

	useEffect(() => {
		if(booking.checkInDate){
			if(booking.checkOutDate){
				try{
					getAvailableRooms(booking.checkInDate, booking.checkOutDate, room.category?.type)
					.then((response) => {
						if(response.some(room => room.id === parseInt(roomId))){
							setDisableContinue(false)
							setMessageRoomAvailable("")
						}
							
						else{
							setDisableContinue(true)
							setMessageRoomAvailable("Phòng hiện không sẵn sàng cho ngày check in và check out này!")
						}
							
					})
					.catch((error) => {
						console.log(error)
					})
				}catch(e) {
					console.log(e)
					setDisableContinue(true)
					setMessageRoomAvailable("Phòng hiện tại không sẵn sàng !")
				}
				
			}
			
		}
	},[booking.checkInDate, booking.checkOutDate])

	const calculatePayment = () => {
		const checkInDate = moment(booking.checkInDate)
		const checkOutDate = moment(booking.checkOutDate)
		const diffInDays = checkOutDate.diff(checkInDate, "days")
		let paymentPerDay = room.price ? room.price : 0
		if(booking.services){
			booking.services.map(service => {
				paymentPerDay = paymentPerDay + service.price
			})
		}
		const total = diffInDays * paymentPerDay * numRoom
		setTotalPrice(total)
	}

	const isGuestCountValid = () => {
		const adultCount = parseInt(booking.NumOfAdults)
		const childrenCount = parseInt(booking.NumOfChildren)
		const totalCount = adultCount + childrenCount
		return totalCount >= 1 && adultCount >= 1
	}

	const isCheckOutDateValid = () => {
		if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
			setErrorMessage("Check-out date must be after check-in date")
			return false
		} else {
			setErrorMessage("")
			return true
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const form = e.currentTarget
		if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
			e.stopPropagation()
		} else {
			setIsSubmitted(true)
		}
		setValidated(true)
	}

	const handleFormSubmit = async () => {
		// Disable form/button ngay lập tức
		setIsProcessing(true);
		switch(selectedPaymentMethod) {
			case "credit-card":				
				try {
					// Đợi lấy payment URL
					const paymentUrl = await CreatePaypalPayment(totalPrice, selectedPaymentMethod);
					
					// Return early nếu không có URL
					if (!paymentUrl) {
						console.error("No payment URL received");
						// return;
					}
					else{
						// Log để debug
						console.log("Redirecting to payment URL:", paymentUrl);
						
						// Thực hiện redirect trong callback của setTimeout
						setTimeout(() => {
							window.location.replace(paymentUrl);
						}, 0);
						
						// // Prevent any further code execution
						// return;
					}
					
				} catch (error) {
					console.error("Payment failed:", error);
					setIsProcessing(false);
				}
			  break;
			case "momo":
				try {
					// Đợi lấy payment URL
					const paymentUrl = await CreateMomoPayment(totalPrice, selectedPaymentMethod);
					
					// Return early nếu không có URL
					if (!paymentUrl) {
						console.error("No payment URL received");
						
					}
					else{
						// Log để debug
						console.log("Redirecting to payment URL:", paymentUrl);
						
						// Thực hiện redirect trong callback của setTimeout
						// setTimeout(() => {
						// 	window.location.replace(paymentUrl);
						// }, 0);
						
						// // Prevent any further code execution
						// return;
					}	
				} catch (error) {
					console.error("Payment failed:", error);
					setIsProcessing(false);
				}
			  break;
			case "vnpay":
			try {
				// Đợi lấy payment URL
				const paymentUrl = await CreateVNPayPayment(totalPrice, selectedPaymentMethod);
				
				// Return early nếu không có URL
				if (!paymentUrl) {
					console.error("No payment URL received");
					
				}
				else{
					// Log để debug
					console.log("Redirecting to payment URL:", paymentUrl);
					
					// Thực hiện redirect trong callback của setTimeout
					setTimeout(() => {
						window.location.replace(paymentUrl);
					}, 0);
					
					// Prevent any further code execution
					
				}				
			} catch (error) {
				console.error("Payment failed:", error);
				setIsProcessing(false);
			}
			break;
			default:
				setIsProcessing(false);
		  }
		
		
	}

	return (
		<>
			<div className="container mb-5">
				<div className="row">
					{/* <div className="col-md-6">
						<div className="card card-body mt-5">
							<h4 className="card-title">Reserve Room</h4>

							<Form noValidate validated={validated} onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label htmlFor="guestFullName" className="hotel-color">
										Fullname
									</Form.Label>
									<FormControl
										disabled
										required
										type="text"
										id="guestFullName"
										name="guestFullName"
										value={booking.user ? `${booking.user.firstName || ''} ${booking.user.lastName || ''}` : ''}
										placeholder="Enter your fullname"
										onChange={handleInputChange}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter your fullname.
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group>
									<Form.Label htmlFor="guestEmail" className="hotel-color">
										Email
									</Form.Label>
									<FormControl
										required
										type="email"
										id="guestEmail"
										name="guestEmail"
										value={booking.user?booking.user.email : ""}
										placeholder="Enter your email"
										onChange={handleInputChange}
										disabled
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a valid email address.
									</Form.Control.Feedback>
								</Form.Group>

								<fieldset style={{ border: "2px" }}>
									<div className="row">
										<div className="col-6">
											<Form.Label htmlFor="checkInDate" className="hotel-color">
												Check-in
											</Form.Label>
											<FormControl
												disabled
												required
												type="date"
												id="checkInDate"
												name="checkInDate"
												value={checkInDate || ""}
												placeholder="check-in-date"
												min={moment().format("MMM Do, YYYY")}
												onChange={handleInputChange}
											/>
											<Form.Control.Feedback type="invalid">
												Please select a check in date.
											</Form.Control.Feedback>
										</div>

										<div className="col-6">
											<Form.Label htmlFor="checkOutDate" className="hotel-color">
												Check-out
											</Form.Label>
											<FormControl
												disabled
												required
												type="date"
												id="checkOutDate"
												name="checkOutDate"
												value={checkOutDate || ""}
												placeholder="check-out-date"
												min={moment().format("MMM Do, YYYY")}
												onChange={handleInputChange}
											/>
											<Form.Control.Feedback type="invalid">
												Please select a check out date.
											</Form.Control.Feedback>
										</div>
										{errorMessage && <p className="error-message text-danger">{errorMessage}</p>}
									</div>
								</fieldset>

								<fieldset style={{ border: "2px" }}>
									<div className="row">
										<div className="col-6">
											<Form.Label htmlFor="numOfAdults" className="hotel-color">
												Adults
											</Form.Label>
											<FormControl
												disabled
												required
												type="number"
												id="NumOfAdults"
												name="NumOfAdults"
												value={adults?adults:0}
												min={1}
												placeholder="0"
												onChange={handleInputChange}
											/>
											<Form.Control.Feedback type="invalid">
												Please select at least 1 adult.
											</Form.Control.Feedback>
										</div>
										<div className="col-6">
											<Form.Label htmlFor="numOfChildren" className="hotel-color">
												Children
											</Form.Label>
											<FormControl
												disabled
												required
												type="number"
												id="NumOfChildren"
												name="NumOfChildren"
												value={children?children:0}
												placeholder="0"
												min={0}
												onChange={handleInputChange}
											/>
											<Form.Control.Feedback type="invalid">
												Select 0 if no children
											</Form.Control.Feedback>
										</div>
										<div className="col-6">
											<Form.Label htmlFor="numOfRoom" className="hotel-color">
												Number of rooms
											</Form.Label>
											<FormControl
												disabled
												required
												type="number"
												id="numOfRoom"
												name="numOfRoom"
												value={numRoom?numRoom:0}
												placeholder="0"
												min={0}
												onChange={handleInputChange}
											/>
											<Form.Control.Feedback type="invalid">
												Select 0 if no children
											</Form.Control.Feedback>
										</div>
									</div>
								</fieldset>

								<Form.Group>
									<Form.Label htmlFor="guestEmail" className="hotel-color">
										Thêm dịch vụ
									</Form.Label>
									<div>
										<RoomServiceSelector
										selectedServices={selectedServices} 
										setSelectedServices={setSelectedServices}
										servicesNoShow={servicesNoShow}/>
									</div>
								</Form.Group> 

								<div className="fom-group mt-2 mb-2">
								{messageRoomAvailable && <h6>{messageRoomAvailable}</h6>}
									<button disabled={disableContinue} type="submit" className="btn btn-hotel">
										Continue
									</button>
								</div>
							</Form>
						</div>
					</div> */}

					<div className="col-md-6">
						{isSubmitted && (
							<BookingSummary
								booking={booking}
								payment={totalPrice}
								onConfirm={handleFormSubmit}
								selectedPaymentMethod={selectedPaymentMethod}
    							setSelectedPaymentMethod={setSelectedPaymentMethod}
								isProcessing={isProcessing}
								// isFormValid={validated}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
export default BookingForm
