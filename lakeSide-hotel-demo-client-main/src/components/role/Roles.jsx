import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { FaEdit, FaEye, FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import { getAllRoles } from "../utils/ApiRoleFunction"

const Roles = () => {
    const [roles, setRoles] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
		fetchRoles()
	}, [])

	const fetchRoles = async () => {
		setIsLoading(true)
		try {
			const result = await getAllRoles()
			setRoles(result)
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
				<p>Loading roles</p>
			) : (
				<>
					<section className="mt-5 mb-5 container">
						<div className="d-flex justify-content-between mb-3 mt-5">
							<h2>Roles</h2>
						</div>

						<Row>
							<Col md={12} className="d-flex justify-content-end">
								<Link to={"/add-role"}>
									<FaPlus /> Add role
								</Link>
							</Col>
						</Row>

						<table className="table table-bordered table-hover">
							<thead>
								<tr className="text-center">
									<th>ID</th>
									<th>Tên quyền</th>
									<th>Actions</th>
								</tr>
							</thead>

							<tbody>
								{roles.map((role) => (
									<tr key={role.id} className="text-center">
										<td>{role.id}</td>
										<td>{role.name}</td>
										<td className="gap-2">
											<Link to={`/edit-role/${role.id}`} className="gap-2">
												<span className="btn btn-info btn-sm">
													<FaEye />
												</span>
												<span className="btn btn-warning btn-sm ml-5">
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
export default Roles;