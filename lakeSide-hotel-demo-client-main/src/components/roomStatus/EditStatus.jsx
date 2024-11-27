import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Status from "../../model/Status"
import { getStatusById, UpdateStatus } from "../utils/ApiStatusFunction"

const EditStatus = () => {
    const { statusId } = useParams()

    const [status, setStatus] = useState(new Status())

    const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

    useEffect(()=>{
        const fetchStatus = async () => {
			try {
				const statusData = await getStatusById(statusId)
				setStatus(statusData)
				
			} catch (error) {
				console.error(error)
			}
		}

		fetchStatus()
    },[statusId])

    const handleStatusInputChange = (e) => {
        
		const name = e.target.name
		let value = e.target.value
		
		// Cập nhật thuộc tính trong newRoom
		setStatus((prevStatus) => ({
			...prevStatus,
			[name]: value, // Cập nhật thuộc tính tương ứng dựa trên name
		  }));
	}

    const handleSubmit = async (e) => {
		e.preventDefault();
        try{
            const updatedStatus = await new Promise(resolve => {
                setStatus(prevStatus => {
                    const updatedStatus = {
                        ...prevStatus,
                        startDate: new Date(Date.now()).toISOString().split('T')[0],
                    };
                    
                    resolve(updatedStatus);
                    return updatedStatus;
                });
            });
            console.log("new status hoàn chỉnh: ", updatedStatus);
            console.log("status id nhận được: ", statusId)

            // Lúc này updatedRoom đã được cập nhật, truyền nó vào addRoom
            const StatusUpdated = await UpdateStatus(statusId,updatedStatus);

            if (StatusUpdated.id !== null) {
                setSuccessMessage("A status was edit successfully!");
                setErrorMessage("");
            } else {
                setErrorMessage("Error editing status");
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
                <h2 className="mt-5 mb-2">Edit status {statusId}</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="status" className="form-label">
									Status
								</label>
								<input
									required
									className="form-control"
									id="status"
									name="status"
									placeholder="Nhập trạng thái"
									value={status?.status || ""}
									onChange={handleStatusInputChange}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="codeRoom" className="form-label">
                                    description
								</label>
								<input
									required
									className="form-control"
									id="description"
									name="description"
									placeholder="Nhập chi tiết trạng thái"
									value={status?.description || ""}
									onChange={handleStatusInputChange}
								/>
							</div>
                            <div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/status-rooms"} className="btn btn-outline-info">
									Back
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save status
								</button>
							</div>
                        </form>
                </div>
            </div>
        </section>
        </>
    )
}

export default EditStatus;