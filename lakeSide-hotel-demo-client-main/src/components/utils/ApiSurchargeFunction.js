import Surcharge from "../../model/Surcharge";
import {api, getHeader} from "./axios"

export async function DeleteSurcharge(surchargeId) {
    try{
        const res = await api.delete(`/surcharges/${surchargeId}/surcharge/delete`)
        const surchargeData = res.data
        if(surchargeData.id){
            return new Surcharge(
                surchargeData.id,
                surchargeData.content,
                surchargeData.quantity,
                surchargeData.price,
                surchargeData.total,
                surchargeData.bookedRoom,
                surchargeData.status
              )
        }
			
		return new Surcharge()
    }catch(er){
        throw new Error("Error delete surcharge: ", error)
    }
}

export async function UpdateSurcharge(surchargeId,surcharge) {
	try{
		const response = await api.put(`/surcharges/surcharge/update/${surchargeId}`, surcharge,{
			headers: getHeader()
		})
		const surchargeData = response.data
        if(surchargeData.id){
            return new Surcharge(
                surchargeData.id,
                surchargeData.content,
                surchargeData.quantity,
                surchargeData.price,
                surchargeData.total,
                surchargeData.bookedRoom,
                surchargeData.status
              )
        }
			
		return new Surcharge()
	}catch(error){
		throw new Error("Error updating surcharge: ", error)
	}
}

export async function getSurchargeById(surchargeId) {
	try{
		const response = await api.get(`/surcharges/surcharge/${surchargeId}`)
		const surchargeData = response.data
        if(surchargeData){
            return new Surcharge(
            surchargeData.id,
            surchargeData.content,
            surchargeData.quantity,
            surchargeData.price,
            surchargeData.total,
            surchargeData.bookedRoom,
            surchargeData.status
          )
        }
        console.log("không tìm thấy surcharge bằng id");
        
        return null;
		
	}catch (error) {
		throw new Error("Error fetching surcharge: ", error)
	}
	
}

export async function CreateSurcharge(bookingId, surcharge) {
	try{
	const response = await api.post(`/surcharges/${bookingId}/surcharge`, surcharge,{
		headers: getHeader()
	})
	console.log("response create surcharge: ", response)
	if (response.data) {
		return true
	} else {
		return false
	}
	}catch(err){
		console.log("looix rooif: ",err);
	  	throw new Error("Error adding surcharge");
	}
}

export async function getSurchargeOfBooking(bookingId) {
	try {
	  const response = await api.get(`/surcharges/booking/${bookingId}`, {
        headers: getHeader()
    });
	  	  
	  // Map qua response.data để tạo danh sách các đối tượng RoomModel
	  const surchargeList = response.data.map(surchargeData => new Surcharge(
		surchargeData.id,
		surchargeData.content,
		surchargeData.quantity,
		surchargeData.price,
		surchargeData.total,
        surchargeData.bookedRoom,
		surchargeData.status
	  ));
	  console.log("response all surcharge: ", surchargeList);
	  
	  return surchargeList;
	} catch (error) {
	  console.log(error);
	  throw new Error("Error fetching surcharges");
	}
  }