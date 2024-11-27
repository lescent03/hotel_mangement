import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import Surcharge from "../../model/Surcharge"
import { CreateSurcharge } from "../utils/ApiSurchargeFunction"

const AddSurcharge = () => {
    const { bookingId } = useParams()
    const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

    const [surcharge, setSurcharge] = useState(new Surcharge())

    const handleSurchargeInputChange = (e) => {
        
		const name = e.target.name
		let value = e.target.value
		
		// Cập nhật thuộc tính trong newRoom
		setSurcharge((prevSurcharge) => ({
			...prevSurcharge,
			[name]: value, // Cập nhật thuộc tính tương ứng dựa trên name
		  }));
	}

    const handleSubmit = async (e) => {
		e.preventDefault();
        try{
            // Lúc này updatedRoom đã được cập nhật, truyền nó vào addRoom
            const success = await CreateSurcharge(bookingId, surcharge);

            if (success) {
                setSuccessMessage("A new surcharge was added successfully!");
                setSurcharge(new Surcharge())
                setErrorMessage("");
            } else {
                setErrorMessage("Error adding new surcharge");
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
                <h2 className="mt-5 mb-2">Add a New surcharge</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="content" className="form-label">
									Nội dung
								</label>
								<input
									required
									className="form-control"
									id="content"
									name="content"
									placeholder="Nhập nội dung"
									value={surcharge?.content || ""}
									onChange={handleSurchargeInputChange}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="quantity" className="form-label">
									Số lượng
								</label>
								<input
									required
                                    type="number"
									className="form-control"
									id="quantity"
									name="quantity"
									placeholder="Nhập số lượng"
									value={surcharge?.quantity}
									onChange={handleSurchargeInputChange}
                                    min={1}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="price" className="form-label">
									Giá (Của số lượng 1)
								</label>
								<input
									required
									type="number"
									className="form-control"
									id="price"
									name="price"
									placeholder="Nhập giá"
									value={surcharge?.price}
									onChange={handleSurchargeInputChange}
									min={0}
								/>
							</div>
                            
                            <div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={`/surcharge/${bookingId}`} className="btn btn-outline-info">
									Back
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save surcharge
								</button>
							</div>
                        </form>
                </div>
            </div>
        </section>
        </>
    )
}
export default AddSurcharge;