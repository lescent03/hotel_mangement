import React, { useEffect, useState } from "react"
import moment from "moment"
import BookedRoom from "../../model/BookedRoom"
import { cancelBooking, checkinBooking, checkoutBooking, getBookingByConfirmationCode, getBookingsByUserId } from "../utils/ApiBookingFunction"
import { useNavigate } from "react-router-dom"
import { Alert } from "react-bootstrap"

const Checkin = () => {
    const navigate = useNavigate()

    // trong đây đang sử dụng email để tìm booking
    const [customerEmail, setCustomerEmail] = useState(()=>{
		const saved = localStorage.getItem('customerEmail');
		return (saved && saved !== "null") ? JSON.parse(saved) : "";
	});
	useEffect(()=>{
		localStorage.setItem('customerEmail', JSON.stringify(customerEmail));
	},[customerEmail])
    const [bookings, setBookings] = useState([])
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const emptyBookingInfo = new BookedRoom()

	const [isDeleted, setIsDeleted] = useState(false)

	const handleInputChange = (event) => {
		setCustomerEmail(event.target.value)
	}

    useEffect(()=>{
        const FetchData = async () => {
            await GetData()
        }
        if(customerEmail && customerEmail !== "null" && customerEmail !== "")
            FetchData()
    },[])

    const GetData = async () =>{
        try {
			const data = await getBookingsByUserId(customerEmail,"")
            if(data){
                // Sắp xếp theo ngày gần nhất trước
                const sortedData = data.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
                
                setBookings(sortedData);
			    setError(null)
            }
            else{
                setError("Không tìm thấy booking")
            }
			
		} catch (error) {
			// setBookingInfo(emptyBookingInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}
    }

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)

		await GetData()

		setTimeout(() => setIsLoading(false), 2000)
	}

	const handleCheckin = async (bookingId) => {
		try {
            // Cuộn lên đầu trang
            window.scrollTo({ top: 0, behavior: "smooth" });
			await checkinBooking(bookingId).then(async (rs)=>{
                console.log("check in: ", rs);
                
				if(!rs.toLowerCase().includes("lỗi")){
                    console.log("không có lỗi");
                    
					setIsDeleted(true)
					setSuccessMessage(rs)
					setError(null)
                    await GetData()
				}
				else{
					setError(rs)
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

	const handleCheckout = async (bookingId) => {
		try {
            // Cuộn lên đầu trang
            window.scrollTo({ top: 0, behavior: "smooth" });
			await checkoutBooking(bookingId).then(async (rs)=>{
                console.log("check out: ", rs);
                
				if(!rs.toLowerCase().includes("lỗi")){
                    console.log("không có lỗi");
                    
					setIsDeleted(true)
					setSuccessMessage(rs)
					setError(null)
                    await GetData()
				}
				else{
					setError(rs)
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
				<h2 className="text-center mb-1">Find Booking by email</h2>
				<form onSubmit={handleFormSubmit} className="col-md-6">
					<div className="input-group mb-3">
						<input
							className="form-control"
							type="text"
							id="customerEmail"
							name="customerEmail"
							value={customerEmail}
							onChange={handleInputChange}
							placeholder="Enter your email ..."
						/>

						<button type="submit" className="btn btn-hotel input-group-text">
							Find booking
						</button>
					</div>
				</form>

                {isDeleted && <div className="alert alert-success mt-1 fade show">{successMessage}</div>}

				{isLoading ? (
					<div>Finding your booking...</div>
				) : error ? (
					<div className="text-danger">Error: {error}</div>
				) : bookings ? (
					<>
					<section className="mt-1 mb-5 container">
						<div className="d-flex justify-content-between mb-3 mt-5">
							<h2>Existing booking</h2>
						</div>

						<table className="table table-bordered table-hover">
							<thead>
								<tr className="text-center">
									<th>Ngày đặt phòng</th>
                                    <th>Phòng</th>
									<th>Checkin</th>
									<th>Checkout</th>
									<th>Người lớn</th>
									<th>Trẻ em</th>
									<th>Số lượng phòng</th>
									<th>Mã xác nhận</th>
                                    <th>Trạng thái</th>
								</tr>
							</thead>

							<tbody>
								{bookings.map((booking) => (
									<tr key={booking.id} className="text-center">
                                        <td>
                                        {(() => {
                                            const bookingDateTime = booking.bookingDateTime;
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
                                        </td>
										<td>{booking.room.codeRoom}</td>
										<td>{booking.checkInDate}</td>
										<td>{booking.checkOutDate}</td>
										<td>{booking.NumOfAdults}</td>
										<td>{booking.NumOfChildren}</td>
										<td>{booking.numOfRoom}</td>
                                        <td>{booking.bookingConfirmationCode}</td>
                                        <td>{booking.status}</td>
										<td className="gap-2">
                                            {(!booking.status.toLowerCase().includes("checkin") && 
                                            !booking.status.toLowerCase().includes("checkout") && 
                                            !booking.status.toLowerCase().includes("hủy")) ? (
                                                <button
                                                    className="btn btn-primary btn-sm m-1"
                                                    onClick={() => handleCheckin(booking.id)}
                                                >
                                                    Checkin
                                                </button>
                                            ) : booking.status.toLowerCase().includes("checkin") ? (
                                                <button
                                                    className="btn btn-secondary btn-sm m-1"
                                                    onClick={() => handleCheckout(booking.id)}
                                                >
                                                    Checkout
                                                </button>
                                            ) : null}
                                            <button
                                                className="btn btn-primary btn-sm m-1"
                                                onClick={() => navigate(`/surcharge/${booking.id}`)}
                                            >
                                                Phụ thu
                                            </button>
                                            <button
                                                className="btn btn-primary btn-sm m-1"
                                                onClick={() => navigate(`/used-service/${booking.id}`)}
                                            >
                                                Dịch vụ
                                            </button>
											{/* <button
                                                className="btn btn-primary btn-sm m-1"
                                                onClick={() => navigate(`/bill/${booking.id}`)}
                                            >
                                                Hóa đơn
                                            </button> */}
                                        </td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
				</>
				) : (
					<div>find booking...</div>
				)}
			</div>
		</>
	)
}

export default Checkin
