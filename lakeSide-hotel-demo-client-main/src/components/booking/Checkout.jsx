import React, { useCallback, useEffect, useState } from "react"
import BookingForm from "../booking/BookingForm"

import { useBeforeUnload, useLocation, useNavigate, useParams } from "react-router-dom"
import { CancelReservationRoom, getRoomById, ReservationRoom } from "../utils/ApiRoomFunction"
import RoomCarousel from "../common/RoomCarousel"
import RoomModel from "../../model/Room"
import { Carousel } from "react-bootstrap"
import { MdDoneAll } from "react-icons/md"
import "./checkout.css";

const Checkout = () => {
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [roomInfo, setRoomInfo] = useState(new RoomModel())

	const { roomId } = useParams()

	const location = useLocation()
	const { checkInDate, checkOutDate, adults, children, numRoom, childrenAges } = location.state || 
    {checkInDate:null, checkOutDate:null, adults:null, children:null, numRoom:null, childrenAges:null}

	useEffect(() => {
		
		return () => {
			console.log("hủy giữ chỗ đã!");
			console.log("hủy giữ chỗ trong unmount");
			try {
				const bCancelReservation = CancelReservationRoom(roomId, numRoom);
				if(bCancelReservation) {
					console.log("gọi api hủy giữ chỗ thành công");
				} else {
					console.log("gọi api hủy giữ chỗ thất bại");
				}
			} catch(e) {
				console.log("lỗi gọi api hủy giữ chỗ: ", e);
			}
		};
	}, []);

	useEffect(() => {
		setTimeout(() => {
			getRoomById(roomId)
				.then((response) => {
					setRoomInfo(response)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error)
					setIsLoading(false)
				})
		}, 1000)
	}, [roomId])

	const waittingTime = 15 * 60; // 15 phút (giây)
	const [timeLeft, setTimeLeft] = useState(waittingTime); 
    const [isCounting, setIsCounting] = useState(false); // Trạng thái bộ đếm
    const navigate = useNavigate();

	useBeforeUnload(
		useCallback(() => {
			if (isCounting) {
				try {
					console.log("hủy giữ chỗ trong useBeforeUnload");
					
					const bCancelReservation = CancelReservationRoom(roomId, numRoom);
					if(bCancelReservation) {
						console.log("gọi api hủy giữ chỗ thành công");
					} else {
						console.log("gọi api hủy giữ chỗ thất bại");
					}
				} catch(e) {
					console.log("lỗi gọi api hủy giữ chỗ: ", e);
				}
			}
		}, [isCounting])
	);

    // Khi đồng hồ bắt đầu
    const handleCountdownStart = useCallback(() => {
        console.log("Bộ đếm bắt đầu!");
		try{
			const bReservation = ReservationRoom(roomId, numRoom)
			if(bReservation){
				console.log("gọi api giữ chỗ thành công");
			}
			else{
				console.log("gọi api giữ chỗ thất bại");
			}
		}catch(e){
			console.log("lỗi gọi api giữ chỗ: ", e);
		}
        setIsCounting(true);		
    }, []);

    // Khi đồng hồ kết thúc
    const handleCountdownEnd = useCallback(() => {
        console.log("Hết thời gian giữ chỗ!");
		try {
			const bCancelReservation = CancelReservationRoom(roomId, numRoom);
			if(bCancelReservation) {
				console.log("gọi api hủy giữ chỗ thành công");
			} else {
				console.log("gọi api hủy giữ chỗ thất bại");
			}
		} catch(e) {
			console.log("lỗi gọi api hủy giữ chỗ: ", e);
		}
        setIsCounting(false);
        navigate("/"); // Quay lại trang chính hoặc bất kỳ trang nào khác
    }, [navigate]);

    useEffect(() => {
        if (timeLeft === waittingTime) {
            handleCountdownStart(); // Kích hoạt khi bộ đếm bắt đầu
        }

        if (timeLeft === 0) {
            handleCountdownEnd(); // Kích hoạt khi bộ đếm kết thúc
        }

        // Bộ đếm giảm dần
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); // Dọn dẹp khi unmount
    }, [timeLeft, handleCountdownEnd, handleCountdownStart]);

    // Định dạng thời gian
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

	return (
		<div>
			<section className="container">
				<div className="row">
					<div className="col-md-4 mt-5 mb-5">
						{isLoading ? (
							<p>Loading room information...</p>
						) : error ? (
							<p>{error}</p>
						) : (
							<div className="room-info">
								<Carousel>
									{roomInfo.roomDetails && roomInfo.roomDetails.map((detail, index) => {
										if (detail.photo_url || detail.photo) {
											return (
												<Carousel.Item key={index}>
													<img
														src={detail.photo_url || `data:image/png;base64, ${detail.photo || ""}`}
														alt={`Room Photo ${index + 1}`}
														className="img-fluid"
													/>
												</Carousel.Item>
											);
										}
										return null;
									})}
								</Carousel>
								<table className="table table-bordered">
									<tbody>
										<tr>
											<th>Room Type:</th>
											<td>{roomInfo.category?.type}</td>
										</tr>
										<tr>
											<th>Người lớn:</th>
											<td>{roomInfo.adults}</td>
										</tr>
										<tr>
											<th>Trẻ em:</th>
											<td>{roomInfo.childrents}</td>
										</tr>
										<tr>
											<th>Price per night:</th>
											<td>{roomInfo.price?.toLocaleString('vi-VN')} VND/Đêm</td>
										</tr>
										{/* <tr>
											<th>Room Service:</th>
											<td>
												<ul className="list-unstyled">
												{roomInfo.services && roomInfo.services.map(service =>(
													<li
													key={service.id}
													className="text-left text-break"><MdDoneAll /> {service.serviceName}
													</li>
												))}
												</ul>
											</td>
										</tr> */}
										<tr>
											<td colSpan="2">
												<div className="highlight-container">
													<p>
														Chúng tôi đang giữ phòng:{" "}
														{timeLeft > 0 ? (
															<span className="countdown">{formatTime(timeLeft)}</span>
														) : (
															<span className="expired">Hết thời gian giữ phòng</span>
														)}
													</p>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						)}
					</div>
					<div className="col-md-8">
						<BookingForm checkInDate={checkInDate} checkOutDate={checkOutDate} 
						adults = {adults} children = {children} numRoom = {numRoom} childrenAges = {childrenAges}/>
					</div>
				</div>
			</section>
			<div className="container">
				<RoomCarousel />
			</div>
		</div>
	)
}
export default Checkout
