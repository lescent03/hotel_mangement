import React, { useEffect, useState } from "react"
import { getAllRooms } from "../utils/ApiRoomFunction"
import { Link } from "react-router-dom"
import { Card, Carousel, Col, Container, Row } from "react-bootstrap"
import RoomModel from "../../model/Room"

import{GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md"

const RoomCarousel = () => {
	const [rooms, setRooms] = useState([])
	const [errorMessage, setErrorMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		getAllRooms()
			.then((data) => {
				setRooms(data)
				setIsLoading(false)				
			})
			.catch((error) => {
				setErrorMessage(error.message)
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return <div className="mt-5">Loading rooms....</div>
	}
	if (errorMessage) {
		return <div className=" text-danger mb-5 mt-5">Error : {errorMessage}</div>
	}

	return (
		<section className="bg-light mb-5 mt-5 shadow">
			<Link to={"/browse-all-rooms"} className="hote-color text-center">
				Browse all rooms
			</Link>

			<Container>
				<Carousel indicators={false}
				
				>
					{[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
						<Carousel.Item key={index}>
							<Row>
								{rooms.slice(index * 4, index * 4 + 4).map((room) => (
									<Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
										<Card>
											<Link to={`/detail-room/${room.id}`}>
												<Card.Img
													variant="top"
													src={room.roomDetails?.[0]?.photo_url||`data:image/png;base64, ${room.roomDetails?.[0]?.photo || ""}`}
													alt="Room Photo"
													className="w-100"
													style={{ height: "200px" }}
												/>
											</Link>
											<Card.Body>
												<Card.Title className="hotel-color">{room.category?.type}</Card.Title>
												<Card.Title className="room-price">Giá : {room.price?.toLocaleString('vi-VN')} NVD/đêm</Card.Title>
												<Card.Text >{room.description?.length > 50 
                                                        ? `${room.description.slice(0, 50)}...` 
                                                        : room.description||""}</Card.Text>
												<Card.Text className="text-muted">{room.adults} người lớn, {room.childrents} trẻ em</Card.Text>
												<div className="d-flex justify-content-between flex-shrink-0">
													{/* <Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm">
														Book Now
													</Link> */}
													<label></label>
													<Link to={`/detail-room/${room.id}`} className="btn btn-hotel btn-sm">
														Detail
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						</Carousel.Item>
					))}
				</Carousel>
			</Container>
		</section>
	)
}

export default RoomCarousel
