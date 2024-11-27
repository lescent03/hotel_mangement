import React, { useEffect, useState } from "react"
import RoomCard from "../room/RoomCard"
import { Button, Row } from "react-bootstrap"
import RoomPaginator from "./RoomPaginator"
import { Link } from "react-router-dom"

const RoomSearchResults = ({ results, onClearSearch, checkInDate, checkOutDate, adults, children, numRoom, childrenAges }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const resultsPerPage = 5
	const totalResults = results.length
	const totalPages = Math.ceil(totalResults / resultsPerPage)

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const startIndex = (currentPage - 1) * resultsPerPage
	const endIndex = startIndex + resultsPerPage
	const paginatedResults = results.slice(startIndex, endIndex)

	//const [selectedRooms, setSelectedRooms] = useState([]);
	const [selectedRooms, setSelectedRooms] = useState(()=>{
		const saved = localStorage.getItem('selectedRooms');
		return saved ? JSON.parse(saved) : [];
	});
	useEffect(()=>{
		localStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
	},[selectedRooms])

	const handleRoomSelect = (roomId, isChecked) => {
		if (isChecked) {
		// Thêm room.id vào mảng nếu được chọn
		setSelectedRooms(prev => [...prev, roomId]);
		} else {
		// Xóa room.id khỏi mảng nếu bỏ chọn
		setSelectedRooms(prev => prev.filter(id => id !== roomId));
		}
	};

	return (
		<>
			{results.length > 0 ? (
				<>
				{/* <div className="inline position-relative"> */}
				<div className="inline mb-4">
					<h5 className="text-center mt-5">Search Results</h5>
					{/* <div className="d-flex justify-content-end gap-2 position-absolute bottom-0 end-0 mb-2 me-2"
					>
						<Link 
							to="/book-room/"
							className="btn btn-hotel btn-sm"
							state={{
								checkInDate: checkInDate,
								checkOutDate: checkOutDate
							}}
						>
							Book Now
						</Link>
					</div> */}
				</div>
					
					<Row>
						{paginatedResults.map((room) => (
							<RoomCard key={room.id} room={room} 
							checkInDate={checkInDate} checkOutDate={checkOutDate}
							adults = {adults} children = {children} numRoom = {numRoom} childrenAges = {childrenAges}
							onRoomSelect={handleRoomSelect}
							selectedRooms={selectedRooms}/>
						))}
					</Row>
					<Row>
						{totalResults > resultsPerPage && (
							<RoomPaginator
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						)}
						<Button variant="secondary" onClick={()=>{onClearSearch(); setSelectedRooms([])}}>
							Clear Search
						</Button>
					</Row>
				</>
			) : (
				<div className="justify-content-center">
					<p>no result available</p>
				</div>
				
			)}
		</>
	)
}

export default RoomSearchResults
