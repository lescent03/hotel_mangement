import {api, getHeader} from "./axios"
import Service from "../../model/Service"

export async function getUsedServicesOfBooking(bookingId) {
	try{
		const response = await api.get(`/services/booking/${bookingId}`)
		console.log("api nhaanj services: ", response)
		const serviceList = response.data.map(service => 
			new Service(
				service.id, 
				service.serviceName, 
				service.description,
				service.bookedRooms,
				service.rooms,
				service.status
			)
		)
		return serviceList
	}
	catch(err){
		throw new Error(`Error fetching services ${error.message}`)
	}
}

export async function UpdateService(serviceId,service) {
	try{
		const response = await api.put(`/services/service/update/${serviceId}`, service,{
			headers: getHeader()
		})
		console.log("update service: ", response)
		if(response.status == 200){
			const service = response.data
			return new Service(
				service.id, 
				service.serviceName, 
				service.description,
				service.bookedRooms,
				service.rooms,
				service.status
			)
		}
		return new Service()
	}catch(error){
		throw new Error("Error updating service: ", error)
	}
}

export async function getServiceById(serviceId) {
	try{
		const response = await api.get(`/services/service/${serviceId}`)
		const service = response.data
		return new Service(
			service.id, 
			service.serviceName, 
			service.description,
			service.bookedRooms,
			service.rooms,
			service.status
		)
	}catch (error) {
		throw new Error("Error fetching service: ", error)
	}
	
}

export async function addService(service) {
	try{
	const response = await api.post(`/services/service/create`, service,{
		headers: getHeader()
	})
	console.log("response create service: ", response)
	if (response.data) {
		return true
	} else {
		return false
	}
	}catch(err){
		console.log("looix rooif: ",err);
	  	throw new Error("Error adding service");
	}
}

export async function GetAllService() {
	try{
		const response = await api.get(`/services/all-services`)
		const serviceList = response.data.map(service => 
			new Service(
				service.id, 
				service.serviceName, 
				service.description,
				service.bookedRooms,
				service.rooms,
				service.status
			)
		)
		return serviceList
	}
	catch(err){
		throw new Error(`Error fetching services ${error.message}`)
	}
}