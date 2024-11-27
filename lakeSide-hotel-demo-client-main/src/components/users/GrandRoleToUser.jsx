import { Link, useParams } from "react-router-dom"
import User from "../../model/User"
import { useEffect, useState } from "react"
import { getUser, updateUser } from "../utils/ApiUserFunction"
import { getAllRoles } from "../utils/ApiRoleFunction"
import { Form } from "react-bootstrap"

const GrandRoleToUser = () => {
    const { userId } = useParams()

    const [user, setUser] = useState(new User())

    const [roles, setRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])

    const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

    useEffect(()=>{
        const fetchUser = async () => {
			try {
				const user = await getUser(userId)
				setUser(user)
                setSelectedRoles(user.roles)

                setRoles(await getAllRoles())
				
			} catch (error) {
				console.error(error)
			}
		}

		fetchUser()
    },[userId])

    const handleSubmit = async (e) => {
		e.preventDefault();
        try{
            const updatedUser = await new Promise(resolve => {
				setUser(prevUser => {
					const updatedUser = {
						...prevUser,
						roles: selectedRoles,
					};
					console.log("new user hoàn chỉnh: ", updatedUser);
					resolve(updatedUser);
					return updatedUser;
				});
			});
			console.log("dữ liệu sau khi sửa: ", updatedUser)
            const response = await updateUser(userId, updatedUser)
			if (response.status === 200) {
				setSuccessMessage("successfully!")
				setErrorMessage("")
			} else {
				setErrorMessage("Error")
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

    const handleRoleChange = (e, role) => {
        const isChecked = e.target.checked;

        setSelectedRoles((prevSelectedRoles) => {
            if (isChecked) {
                // Nếu checkbox được tick, thêm đối tượng vào selectedServices
                return [...prevSelectedRoles, role];
            } else {
                // Nếu checkbox bị bỏ tick, xóa đối tượng khỏi selectedServices
                return prevSelectedRoles.filter(selected => selected.id !== role.id);
            }
        });        
    };

    return(
        <>
        <section className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                <h2 className="mt-5 mb-2">Grand role to user</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="status" className="form-label">
									Id
								</label>
								<input
                                    disabled
									className="form-control"
									id="id"
									name="id"
									value={user?.id || ""}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="status" className="form-label">
									Email
								</label>
								<input
                                    disabled
									className="form-control"
									id="email"
									name="email"
									value={user?.email || ""}
								/>
							</div>
                            <div className="mb-3">
								<label htmlFor="status" className="form-label">
									Role
								</label>
                                <div>
                                {roles && roles.map((role, index) => (
                                    <Form.Check
                                        inline
                                        label={role.name}
                                        name={role.name}
                                        type="checkbox"
                                        id={role.id}
                                        checked={selectedRoles.some(selected => selected.id === role.id)} // Điều khiển trạng thái của checkbox
                                        onChange={(e) => handleRoleChange(e, role)} // Gọi hàm khi checkbox thay đổi
                                    ></Form.Check>
                                ))}
                                </div>
							</div>
                            
                            <div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/users"} className="btn btn-outline-info">
									Back
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save grand
								</button>
							</div>
                        </form>
                </div>
            </div>
        </section>
        </>
    )
}
export default GrandRoleToUser;