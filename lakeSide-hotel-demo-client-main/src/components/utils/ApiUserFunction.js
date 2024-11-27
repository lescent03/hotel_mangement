import User from "../../model/User"
import {api, getHeader} from "./axios"

/*  This is function to get the user profile */
export async function getUserProfile(userId, token) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This isthe function to delete a user */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}

export async function updateUser(userId, userData) {
	console.log("dữ liệu nhận được để gọi backend sửa: ", userData)
	const response = await api.put(`/users/update/${userId}`, userData,{
		headers: getHeader()
	})
	return response
}

export async function getUserByEmail(userEmail) {
	try {
		const response = await api.get(`/users/${userEmail}`, {
			headers: getHeader()
		})
		console.log("get user by email: ", response)
		if(response.status === 200){
			const user = response.data
			return new User(
				user.id,
				user.firstName,
				user.lastName,
				user.email,
				user.password,
				user.idNumber,
				user.roles,
				user.bookedRooms,
				user.bills
			)
		}
		else
			console.log("lỗi lấy user bằng email: ", response)
	} catch (error) {
        console.log(error);
		throw error
	}
}

/* This is the function to get a single user */
export async function getUser(userId, token) {
	try {
		const response = await api.get(`/users/user/${userId}`, {
			headers: getHeader()
		})
		const user = response.data
		return new User(
			user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.password,
            user.idNumber,
            user.roles,
            user.bookedRooms,
            user.bills
		)
	} catch (error) {
        console.log(error);
		throw error
	}
}

export async function getAllUser() {
	try {
		const response = await api.get(`/users/all`, {
			headers: getHeader()
		})
		const userList = response.data.map(user => new User(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.password,
            user.idNumber,
            user.roles,
            user.bookedRooms,
            user.bills
          ));
          console.log("response all user: ", userList);
          
          return userList;
	} catch (error) {
        console.log(error);
		throw error
	}
}