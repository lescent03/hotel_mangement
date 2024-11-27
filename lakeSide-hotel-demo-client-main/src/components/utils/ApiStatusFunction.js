import Status from "../../model/Status"
import {api, getHeader} from "./axios"

export async function UpdateStatus(statusId, statusUpdate) {
	console.log("dữ liệu nhận được để gọi backend sửa: ", statusUpdate)
	const response = await api.put(`/statuses/status/update/${statusId}`, statusUpdate,{
		headers: getHeader()
	})
	console.log("update status: ", response)
	if(response.status == 200){
		const status = response.data
		return new Status(
			status.id,
			status.startDate,
			status.endDate,
			status.status,
			status.description,
		)
	}
	return new Status()
}

export async function getStatusById(statusId) {
	try{
		const response = await api.get(`/statuses/id/${statusId}`)
		const status = response.data
		return new Status(
			status.id,
			status.startDate,
			status.endDate,
			status.status,
			status.description,
		)
	}catch (error) {
		throw new Error("Error fetching status: ", error)
	}
	
}

export async function addStatus(roomId, newStatus) {
	console.log("dữ liệu nhận được khi gọi backend: ", newStatus)

	const response = await api.post(`/statuses/add/room/${roomId}`, newStatus,{
		headers: getHeader()
	})
	if (response.status === 201) {
		return true
	} else {
		return false
	}
}