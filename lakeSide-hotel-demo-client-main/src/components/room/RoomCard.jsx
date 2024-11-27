import React, { useContext } from "react"
import { Card, Col, Form, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

const RoomCard = ({ room, checkInDate, checkOutDate, onRoomSelect, selectedRooms, adults, children, numRoom, childrenAges }) => {
	// Kiểm tra xem room.id có trong danh sách selectedRooms không
	const isChecked = Boolean(selectedRooms?.includes(room.id));

	const handleCheckboxChange = (e) => {
		// Gọi callback function và truyền room.id và trạng thái checked
		onRoomSelect(room.id, e.target.checked);
	  };

	return (
		<Col key={room.id} className="mb-4" xs={12}>
			<Card>
				<Card.Body className="d-flex flex-wrap align-items-center">
					<div className="flex-shrrink-0 mb-3 mb-md-0 col-4">
						<Link to={`/detail-room/${room.id}`}
							state={{checkInDate:checkInDate, checkOutDate:checkOutDate, 
								adults:adults, children:children, numRoom:numRoom, childrenAges:childrenAges
								}}>
							<Card.Img
								variant="top"
								src={room.roomDetails?.[0]?.photo_url||`data:image/png;base64, ${room.roomDetails?.[0]?.photo || ""}`}
								alt="Room Photo"
								style={{ width: "100%", maxWidth: "200px", height: "auto" }}
							/>
						</Link>
					</div>
					<div className="flex-grow-1 px-5 col-8">
						<Card.Title className="hotel-color">{room.category?.type}</Card.Title>
						<Card.Title className="room-price">Giá : {room.price?.toLocaleString('vi-VN')} NVD/đêm</Card.Title>
						<Card.Text >{room.description||""}</Card.Text>
						<Card.Text className="text-muted">{room.adults} người lớn, {room.childrents} trẻ em</Card.Text>
					</div>
					<div className="flex-shrink-0 d-flex justify-content-end gap-2 position-absolute bottom-0 end-0 mb-2 me-2">
						<Link to={`/detail-room/${room.id}`} className="btn btn-hotel btn-sm"
							state={{checkInDate:checkInDate, checkOutDate:checkOutDate, adults:adults, 
							children:children, numRoom:numRoom, childrenAges:childrenAges}}>
								Detail
						</Link>
						{checkInDate && checkOutDate && adults && numRoom &&
						<Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm"
							state={{checkInDate:checkInDate, checkOutDate:checkOutDate, adults:adults, 
							children:children, numRoom:numRoom, childrenAges:childrenAges}}>
								Book Now
						</Link>
						}
						
					</div>
					{numRoom && 
						<div className="flex-shrink-0 d-flex justify-content-end gap-2 position-absolute top-0 end-0 mt-2 me-2">
							<label>Số lượng: {numRoom}</label>
						</div>}
					{/* <div className="flex-shrink-0 d-flex justify-content-end gap-2 position-absolute top-0 end-0 mt-2 me-2">
						<Form.Check aria-label="option 1" 
							onChange={handleCheckboxChange} 
							checked={isChecked||false}/>
					</div> */}
				</Card.Body>
			</Card>
		</Col>
	)
}

export default RoomCard
