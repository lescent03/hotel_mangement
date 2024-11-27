import React, { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container } from "react-bootstrap"
import moment from "moment"
import RoomSearchResults from "./RoomSearchResult"
import RoomTypeSelector from "./RoomTypeSelector"
import { getAvailableRooms } from "../utils/ApiRoomFunction"
import Category from "../../model/Category"
import NumGuestInput from "./NumGuestInput"

const RoomSearch = () => {
	const [searchQuery, setSearchQuery] = useState(()=>{
		const saved = localStorage.getItem('searchQuery');
		return (saved && saved !== "null") ? JSON.parse(saved) : {
			checkInDate: "",
			checkOutDate: ""};
	})

	const [numRoom, setNumRoom] = useState(()=>{
		const saved = localStorage.getItem('numRoom');
		return (saved && saved !== "null") ? JSON.parse(saved) : 1;
	});
	const [adults, setAdults] = useState(()=>{
		const saved = localStorage.getItem('adults');
		return (saved && saved !== "null") ? JSON.parse(saved) : 1;
	});
	const [children, setChildren] = useState(()=>{
		const saved = localStorage.getItem('children');
		return (saved && saved !== "null") ? JSON.parse(saved) : 0;
	});
	const [childrenAges, setChildrenAges] = useState(()=>{
		const saved = localStorage.getItem('childrenAges');
		let ages = (saved && saved !== "null") ? JSON.parse(saved) : [];
		// Nếu thiếu phần tử, bổ sung thêm 8 cho đủ
		if (ages.length < children) {
			ages = [...ages, ...Array(children - ages.length).fill(8)];
		}
		return ages;
	});

	useEffect(()=>{
		localStorage.setItem('searchQuery', JSON.stringify(searchQuery));
	},[searchQuery])
	useEffect(()=>{
		localStorage.setItem('numRoom', JSON.stringify(numRoom));
	},[numRoom])
	useEffect(()=>{
		localStorage.setItem('adults', JSON.stringify(adults));
	},[adults])
	useEffect(()=>{
		localStorage.setItem('children', JSON.stringify(children));
	},[children])
	useEffect(()=>{
		localStorage.setItem('childrenAges', JSON.stringify(childrenAges));
	},[childrenAges])

	const [errorMessage, setErrorMessage] = useState("")
	const [availableRooms, setAvailableRooms] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const GetAvailableRoom = () => {
		if(searchQuery.checkInDate && searchQuery.checkOutDate){
			// Tính toán children_0_4 và children_5_11 từ childrenAges trước khi gọi getAvailableRooms
			const validChildrenAges = childrenAges
				.map(age => age === "" ? 8 : age) // Thay thế các phần tử "" bằng 8
				.concat(Array(Math.max(0, children - childrenAges.length)).fill(8));

			const children_0_4 = validChildrenAges.filter(age => age >= 0 && age <= 4).length;
			const children_5_11 = validChildrenAges.filter(age => age >= 5 && age <= 11).length;
			setChildrenAges(validChildrenAges)

			getAvailableRooms(searchQuery.checkInDate, searchQuery.checkOutDate, numRoom, adults, children_0_4, children_5_11)
			.then((response) => {
				if(response){
					setAvailableRooms(response)
				}
					
				else{
					setAvailableRooms([])
				}
					
				setTimeout(() => setIsLoading(false), 2000)
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				setIsLoading(false)
				setErrorMessage("")
			})
		}
	}

	useEffect(()=>{
		GetAvailableRoom()
	},[])

	const handleSearch = (e) => {
		e.preventDefault()
		const checkInMoment = moment(searchQuery.checkInDate)
		const checkOutMoment = moment(searchQuery.checkOutDate)
		if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
			setErrorMessage("Please enter valid dates")
			setAvailableRooms([])
			return
		}
		if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
			setErrorMessage("Check-out date must be after check-in date")
			setAvailableRooms([])
			return
		}
		setIsLoading(true)
		GetAvailableRoom()
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setSearchQuery({ ...searchQuery, [name]: value })
		const checkInDate = moment(searchQuery.checkInDate)
		const checkOutDate = moment(searchQuery.checkOutDate)
		if (checkInDate.isValid() && checkOutDate.isValid()) {
			setErrorMessage("")
		}
	}
	const handleClearSearch = () => {
		setSearchQuery({
			checkInDate: "",
			checkOutDate: ""
		})
		setAvailableRooms([])
		setNumRoom(1)
		setAdults(1)
		setChildren(0)
		setChildrenAges([])
	}

	return (
		<>
			<Container className="shadow mt-n5 mb-5 py-5">
				<Form onSubmit={handleSearch}>
					<Row className="justify-content-center">
						<Col xs={6} md={3}>
							<Form.Group controlId="checkInDate">
								<Form.Label>Check-in Date</Form.Label>
								<Form.Control
									type="date"
									name="checkInDate"
									value={searchQuery.checkInDate}
									onChange={handleInputChange}
									min={moment().format("YYYY-MM-DD")}
								/>
							</Form.Group>
						</Col>
						<Col xs={6} md={3}>
							<Form.Group controlId="checkOutDate">
								<Form.Label>Check-out Date</Form.Label>
								<Form.Control
									type="date"
									name="checkOutDate"
									value={searchQuery.checkOutDate}
									onChange={handleInputChange}
									min={moment().format("YYYY-MM-DD")}
								/>
							</Form.Group>
						</Col>
						<Col xs={6} md={3}>
							<Form.Group controlId="roomType">
								<Form.Label>Number guests</Form.Label>
								<div className="d-flex w-100">
									<NumGuestInput
										numRoom={numRoom}
										setNumRoom={setNumRoom}
										adults={adults}
										setAdults={setAdults}
										children={children}
										setChildren={setChildren}
										childrenAges={childrenAges}
										setChildrenAges={setChildrenAges}></NumGuestInput>
								</div>
							</Form.Group>
						</Col>
						<Col xs={6} md={1}>
							<Form.Group controlId="search">
								<Form.Label></Form.Label>
								<div className="d-flex pt-2">
									<Button variant="secondary" type="submit" className="ml-2">
										Search
									</Button>
								</div>
							</Form.Group>
						</Col>
					</Row>
				</Form>

				{isLoading ? (
					<p className="mt-4">Finding availble rooms....</p>
				) : availableRooms ? (
					<RoomSearchResults results={availableRooms} onClearSearch={handleClearSearch}
						checkInDate={searchQuery.checkInDate} checkOutDate={searchQuery.checkOutDate} 
						adults = {adults} children = {children} numRoom = {numRoom} childrenAges = {childrenAges}/>
				) : (
					<p className="mt-4">No rooms available for the selected dates.</p>
				)}
				{errorMessage && <p className="text-danger">{errorMessage}</p>}
			</Container>
		</>
	)
}

export default RoomSearch
