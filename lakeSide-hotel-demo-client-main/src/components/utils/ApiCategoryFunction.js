import Category from "../../model/Category";
import {api, getHeader} from "./axios"

export async function UpdateCategory(categoryId, category) {
	console.log("dữ liệu nhận được để gọi backend sửa: ", category)
	try{
		const response = await api.put(`/categories/category/update/${categoryId}`, category,{
			headers: getHeader()
		})
		console.log("update category: ", response)
		if(response.status == 200){
			const category = response.data
			return new Category(
				category.id,
				category.type,
				category.description,
			)
		}
		return new Category()
	}catch(error){
		throw new Error("Error updating category: ", error)
	}
}

export async function getCategoryById(categoryId) {
	try{
		const response = await api.get(`/categories/category/${categoryId}`)
		const category = response.data
		return new Category(
			category.id,
			category.type,
			category.description,
		)
	}catch (error) {
		throw new Error("Error fetching category: ", error)
	}
	
}

export async function getAllCategories() {
	try {
	  const response = await api.get("/categories/all-category");
	  	  
	  // Map qua response.data để tạo danh sách các đối tượng RoomModel
	  const catogoriesList = response.data.map(categoryData => new Category(
		categoryData.id,
		categoryData.type,
		categoryData.description,
	  ));
	  console.log("response all category: ", catogoriesList);
	  
	  return catogoriesList;
	} catch (error) {
	  console.log(error);
	  throw new Error("Error fetching categories");
	}
}

export async function addCategory(category) {
	console.log("dữ liệu nhận được khi gọi backend: ", category)
	try{
	const response = await api.post(`/categories/category/new-category`, category,{
		headers: getHeader()
	})
	console.log("response create category: ", response)
	if (response.status === 201) {
		return true
	} else {
		return false
	}
	}catch(err){
		console.log(err);
	  	throw new Error("Error adding category");
	}
}