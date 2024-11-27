import React, { useState, useEffect } from "react"
import { getAllCategories } from "../utils/ApiCategoryFunction"

const RoomTypeSelector = ({ setNewRoom, newRoom }) => {
	const [roomTypes, setRoomTypes] = useState([])
	const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false)
	const [newRoomType, setNewRoomType] = useState("")

	useEffect(() => {
		getAllCategories().then((data) => {
			console.log("tất cả category nhận được: ", data);
			
			setRoomTypes(data)
		})
	}, [])

	const handleNewRoomTypeInputChange = (e) => {
		setNewRoomType(e.target.value)
	}

	const handleAddNewRoomType = () => {
		if (newRoomType !== "") {
			setRoomTypes([...roomTypes, newRoomType])
			setNewRoomType("")
			setShowNewRoomTypeInput(false)
		}
	}

	const handleRoomInputCategoryChange = (e) => {
		const id = e.target.value
		const category = roomTypes.find(category => category.id === Number(id));
		if (category) {
			// Cập nhật state mới cho newRoom
			setNewRoom(prevRoom => ({
				...prevRoom,
				category: category
			}));	
				
		}
	}

	return (
		<>
			{roomTypes.length > 0 && (
				<div>
					<select
						required
						className="form-select"
						name="type"
						onChange={(e) => {
							if (e.target.value === "Add New") {
								setShowNewRoomTypeInput(true)
							} else {
								handleRoomInputCategoryChange(e)
							}
						}}
						value={newRoom?.category?.id || ""}>
						<option value="">Select a room type</option>
						{roomTypes.map((category, index) => (
							<option key={category.id} value={category.id}>
								{category.type}
							</option>
						))}
					</select>
				</div>
			)}
		</>
	)
}

export default RoomTypeSelector
