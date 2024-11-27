import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Category from "../../model/Category";
import { getCategoryById, UpdateCategory } from "../utils/ApiCategoryFunction";

const EditCategory = () => {
    const { categoryId } = useParams()

    const [category, setCategory] = useState(new Category())

    const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

    useEffect(()=>{
        const fetchCategory = async () => {
			try {
				const categoryData = await getCategoryById(categoryId)
				setCategory(categoryData)
				
			} catch (error) {
				console.error(error)
			}
		}

		fetchCategory()
    },[categoryId])

    const handleCategoryInputChange = (e) => {
        
		const name = e.target.name
		let value = e.target.value
		
		// Cập nhật thuộc tính trong newRoom
		setCategory((prevCategory) => ({
			...prevCategory,
			[name]: value, // Cập nhật thuộc tính tương ứng dựa trên name
		  }));
	}

    const handleSubmit = async (e) => {
		e.preventDefault();
        try{
            console.log("new category hoàn chỉnh: ", category);

            // Lúc này updatedRoom đã được cập nhật, truyền nó vào addRoom
            const categoryUpdate = await UpdateCategory(categoryId, category);

            if (categoryUpdate.id) {
                setSuccessMessage("A category was updated successfully!");
                setErrorMessage("");
            } else {
                setErrorMessage("Error updating category");
            }                       
        } catch (error) {
            setErrorMessage(error.message);
        }

        // Sau khi hoàn thành, cuộn lên đầu trang
		window.scrollTo({
			top: 0,
			behavior: 'smooth' // Tạo hiệu ứng cuộn mượt mà (tùy chọn)
		});
	
		setTimeout(() => {
			setSuccessMessage("");
			setErrorMessage("");
		}, 3000);
	};

    return(
        <>
        <section className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                <h2 className="mt-5 mb-2">Edit category</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="status" className="form-label">
									Type
								</label>
								<input
									required
									className="form-control"
									id="type"
									name="type"
									placeholder="Nhập thể loại"
									value={category?.type || ""}
									onChange={handleCategoryInputChange}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="codeRoom" className="form-label">
                                    Description
								</label>
								<input
									required
									className="form-control"
									id="description"
									name="description"
									placeholder="Nhập chi tiết thể loại"
									value={category?.description || ""}
									onChange={handleCategoryInputChange}
								/>
							</div>
                            <div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/categories"} className="btn btn-outline-info">
									Back
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save category
								</button>
							</div>
                        </form>
                </div>
            </div>
        </section>
        </>
    )
}
export default EditCategory;