import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import { getAllUser } from "../utils/ApiUserFunction"
import { ro } from "date-fns/locale"

const Users = () => {
    const [users, setUsers] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		setIsLoading(true)
		try {
			const result = await getAllUser()
			setUsers(result)
			setIsLoading(false)
		} catch (error) {
			setErrorMessage(error.message)
			setIsLoading(false)
		}
	}

    return (
        <>
        <div className="container col-md-8 col-lg-6">
				{successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}

				{errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
			</div>

			{isLoading ? (
				<p>Loading users</p>
			) : (
				<>
					<section className="mt-5 mb-5 container">
						<div className="d-flex justify-content-between mb-3 mt-5">
							<h2>Users</h2>
						</div>

						<table className="table table-bordered table-hover">
							<thead>
								<tr className="text-center">
									<th>ID</th>
									<th>Tên đệm</th>
                                    <th>Tên</th>
									<th>Email</th>
                                    <th>CCCD</th>
									<th>Chức vụ</th>
                                    <th>Phân quyền</th>
								</tr>
							</thead>

							<tbody>
								{users.map((user) => (
									<tr key={user.id} className="text-center">
										<td>{user.id}</td>
										<td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
										<td>{user.email}</td>
										<td>{user.idNumber}</td>
                                        <td>{user.roles && user.roles.map(role => (<p key={role.id}>{role.name}, </p>))}</td>
										<td className="gap-2">
											<Link to={`/grand-permission/${user.id}`} className="gap-2">
												<span className="btn btn-info btn-sm">
													<FaEdit />
												</span>
											</Link>
											{/* <button
												className="btn btn-danger btn-sm ml-5"
												onClick={() => handleDelete(category.id)}>
												<FaTrashAlt />
											</button> */}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
				</>
			)}
        </>
    )
}
export default Users;