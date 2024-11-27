
import Role from "../../model/Role";
import {api, getHeader} from "./axios"

export async function UpdateRole(roleId, role) {
	console.log("dữ liệu nhận được để gọi backend sửa: ", role)
	try{
		const response = await api.put(`/roles/role/update/${roleId}`, role,{
			headers: getHeader()
		})
		console.log("update role: ", response)
		if(response.status == 200){
			const role = response.data
			return new Role(
				role.id,
				role.name,
			)
		}
		return new Role()
	}catch(error){
		throw new Error("Error updating role: ", error)
	}
}

export async function getRoleById(roleId) {
	try{
		const response = await api.get(`/roles/role/${roleId}`)
		const role = response.data
		return new Role(
			role.id,
			role.name,
		)
	}catch (error) {
		throw new Error("Error fetching role: ", error)
	}
	
}

export async function addRole(role) {
	console.log("dữ liệu nhận được khi gọi backend: ", role)
	try{
	const response = await api.post(`/roles/create-new-role`, role,{
		headers: getHeader()
	})
	console.log("response create role: ", response)
	if (response.status === 201) {
		return true
	} else {
		return false
	}
	}catch(err){
		console.log("looix rooif: ",err);
	  	throw new Error("Error adding category");
	}
}

export async function getAllRoles() {
	try {
	  const response = await api.get("/roles/all-roles");
	  	  
	  const rolesList = response.data.map(role => new Role(
		role.id,
		role.name,
	  ));
	  console.log("response all role: ", rolesList);
	  
	  return rolesList;
	} catch (error) {
	  console.log(error);
	  throw new Error("Error fetching roles");
	}
}