import {api, getHeader} from "./axios"

import RoomModel from "../../model/Room"

/* This function adds a new room room to the database */
export async function addRoom(newRoom) {
	console.log("dữ liệu nhận được khi gọi backend: ", newRoom)

	const response = await api.post("/rooms/add/new-room", newRoom,{
		headers: getHeader()
	})
	if (response.status === 201) {
		return true
	} else {
		return false
	}
}

export async function CancelReservationRoom(roomId, numRoom){
	try{
		const response = await api.put(`rooms/room/cancelReservation/${roomId}?numRoom=${numRoom}`)
		return response.data;
	}catch (error) {
		console.log(error);
		throw new Error("Error reservation room");
	  }
}

export async function ReservationRoom(roomId, numRoom){
	try{
		const response = await api.put(`rooms/room/reservation/${roomId}?numRoom=${numRoom}`)
		return response.data;
	}catch (error) {
		console.log(error);
		throw new Error("Error reservation room");
	  }
}

/* This function gets all availavle rooms from the database with a given date and a room type */
export async function getAvailableRooms(checkInDate, checkOutDate,  numRoom, adults, children_0_4, children_5_11) {
	try {
		const response = await api.get(
			`rooms/available-rooms?checkInDate=${checkInDate}
			&checkOutDate=${checkOutDate}&required_rooms=${numRoom}&required_adults=${adults}
			&required_children_0_4=${children_0_4}&required_children_5_11=${children_5_11}`
		)
		if(response.data){
			// Map qua response.data để tạo danh sách các đối tượng RoomModel
			const roomsList = response.data.map(roomData => new RoomModel(
			roomData.id,
			roomData.codeRoom,
			roomData.price,
			roomData.adults,
			roomData.childrents,
			roomData.numOfRoom,
			roomData.description,
			roomData.category,
			roomData.roomDetails,
			roomData.statuses,
			roomData.services,
			roomData.bookings
			));
			console.log("response all room available: ", roomsList);
			
			return roomsList;
		}
		else
			return null
		
	  } catch (error) {
		console.log(error);
		throw new Error("Error fetching rooms available");
	  }
}

export async function getAllRooms() {
	try {
	  const response = await api.get("/rooms/all-rooms");
	  	  
	  // Map qua response.data để tạo danh sách các đối tượng RoomModel
	  const roomsList = response.data.map(roomData => new RoomModel(
		roomData.id,
		roomData.codeRoom,
		roomData.price,
		roomData.adults,
		roomData.childrents,
		roomData.numOfRoom,
		roomData.description,
		roomData.category,
		roomData.roomDetails,
		roomData.statuses,
		roomData.services,
		roomData.bookings
	  ));
	  console.log("response all room: ", roomsList);
	  
	  return roomsList;
	} catch (error) {
	  console.log(error);
	  throw new Error("Error fetching rooms");
	}
  }

/* This function deletes a room by the Id */
export async function deleteRoom(roomId) {
	try {
		const result = await api.delete(`/rooms/delete/room/${roomId}`, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error deleting room ${error.message}`)
	}
}
/* This function update a room */
export async function updateRoom(roomId, roomData) {
	console.log("dữ liệu nhận được để gọi backend sửa: ", roomData)
	const response = await api.put(`/rooms/update/${roomId}`, roomData,{
		headers: getHeader()
	})
	return response
}

/* This funcction gets a room by the id */
export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/room/${roomId}`)
		
		const roomData = result.data;
		console.log("response dữ liệu phòng theo id: ", result)
		const room = new RoomModel(
			roomData.id,
			roomData.codeRoom,
			roomData.price,
			roomData.adults,
			roomData.childrents,
			roomData.numOfRoom,
			roomData.description,
			roomData.category,
			roomData.roomDetails,
			roomData.statuses,
			roomData.services,
			roomData.bookings
		  );
		return room;
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}