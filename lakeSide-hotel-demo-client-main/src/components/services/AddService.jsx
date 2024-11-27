import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import Service from "../../model/Service"
import { addService } from "../utils/ApiServiceFunction"

const AddService = () => {
    const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

    const [service, setService] = useState(new Service())

	const convertToHTML = (text) => {
		if (!text) return '';

		// 1. Escaping các ký tự đặc biệt trong HTML
		const escapedText = text
			.replace(/&/g, '&amp;') // Thay thế ký tự &
			.replace(/</g, '&lt;') // Thay thế ký tự <
			.replace(/>/g, '&gt;') // Thay thế ký tự >
			.replace(/"/g, '&quot;') // Thay thế ký tự "

		// 2. Thay thế xuống dòng thành <br>
		return escapedText.replace(/\n/g, '<br>');
	}

    const handleServiceInputChange = (e) => {
        
		const name = e.target.name
		let value = e.target.value

		setService((prevService) => ({
			...prevService,
			[name]: value, // Cập nhật thuộc tính tương ứng dựa trên name
		  }));
	}

    const handleSubmit = async (e) => {
		e.preventDefault();
        try{
			service.description = convertToHTML(service.description);
			
            const success = await addService(service);

            if (success !== undefined) {
                setSuccessMessage("A new service was added successfully!");
                setService(new Service())
                setErrorMessage("");
            } else {
                setErrorMessage("Error adding new service");
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
                <h2 className="mt-5 mb-2">Add a New service</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="serviceName" className="form-label">
									Tên dịch vụ
								</label>
								<input
									required
									className="form-control"
									id="serviceName"
									name="serviceName"
									placeholder="Nhập tên dịch vụ"
									value={service?.serviceName || ""}
									onChange={handleServiceInputChange}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="description" className="form-label">
									Chi tiết
								</label>
								<textarea
									style={{ height: '10.5rem' }}
									className="form-control"
									id="description"
									name="description"
									placeholder="Nhập chi tiết"
									value={service?.description || ""}
									onChange={handleServiceInputChange}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="status" className="form-label">
									Trạng thái
								</label>
								<input
									required
									className="form-control"
									id="status"
									name="status"
									placeholder="Nhập trạng thái"
									value={service?.status || ""}
									onChange={handleServiceInputChange}
								/>
							</div>
                            
                            <div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/services"} className="btn btn-outline-info">
									Back
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save service
								</button>
							</div>
                        </form>
                </div>
            </div>
        </section>
        </>
    )
}
export default AddService;