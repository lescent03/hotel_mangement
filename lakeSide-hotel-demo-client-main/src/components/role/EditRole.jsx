import { Link, useParams } from "react-router-dom"
import Role from "../../model/Role"
import { useEffect, useState } from "react"
import { getRoleById, UpdateRole } from "../utils/ApiRoleFunction"

const EditRole = () => {
    const { roleId } = useParams()

    const [role, setRole] = useState(new Role())

    const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

    useEffect(()=>{
        const fetchRole = async () => {
			try {
				const role = await getRoleById(roleId)
				setRole(role)
				
			} catch (error) {
				console.error(error)
			}
		}

		fetchRole()
    },[roleId])

    const handleRoleInputChange = (e) => {
        
		const name = e.target.name
		let value = e.target.value
		
		// Cập nhật thuộc tính trong newRoom
		setRole((prevRole) => ({
			...prevRole,
			[name]: value, // Cập nhật thuộc tính tương ứng dựa trên name
		  }));
	}

    const handleSubmit = async (e) => {
		e.preventDefault();
        try{
            
            const roleUpdated = await UpdateRole(roleId,role);

            if (roleUpdated.id !== null) {
                setSuccessMessage("A role was edit successfully!");
                setErrorMessage("");
            } else {
                setErrorMessage("Error editing role");
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
                <h2 className="mt-5 mb-2">Edit role {roleId}</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="status" className="form-label">
									Role
								</label>
								<input
									required
									className="form-control"
									id="name"
									name="name"
									placeholder="Nhập role"
									value={role?.name || ""}
									onChange={handleRoleInputChange}
								/>
							</div>
                            
                            <div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/roles"} className="btn btn-outline-info">
									Back
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save role
								</button>
							</div>
                        </form>
                </div>
            </div>
        </section>
        </>
    )
}

export default EditRole;