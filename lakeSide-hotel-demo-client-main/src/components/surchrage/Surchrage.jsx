import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { getAllRoles } from "../utils/ApiRoleFunction"
import { DeleteSurcharge, getSurchargeOfBooking } from "../utils/ApiSurchargeFunction"

const Surcharge = () => {
    const { bookingId } = useParams()
    const [surcharges, setSurcharges] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        fetchSurcharges()
	}, [])

	const fetchSurcharges = async () => {
		setIsLoading(true)
		try {
			const result = await getSurchargeOfBooking(bookingId)
			setSurcharges(result)
			setIsLoading(false)
		} catch (error) {
			setErrorMessage(error.message)
			setIsLoading(false)
		}
	}

    const handleDelete = async (surchargeId) => {
		try {
			const surchargeDeleted = await DeleteSurcharge(surchargeId)
			if (surchargeDeleted.id) {
				setSuccessMessage(`Surcharge id ${surchargeId} was delete`)
				fetchSurcharges()
			} else {
				console.error(`Error deleting surcharge : ${result.message}`)
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}

    return (
        <>
        <div className="container col-md-8 col-lg-6">
				{successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}

				{errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
			</div>

			{isLoading ? (
				<p>Loading surcharge ...</p>
			) : (
				<>
					<section className="mt-5 mb-5 container">
						<div className="d-flex justify-content-between mb-3 mt-5">
							<h2>Surcharges of booking {bookingId}</h2>
						</div>
                        <div className="d-grid gap-2 d-md-flex mt-2">
                            <Link to={`/checkin-checkout`} className="btn btn-outline-info">
                                Back
                            </Link>
                        </div>

						<Row>
							<Col md={12} className="d-flex justify-content-end">
								<Link to={`/add-surcharge/${bookingId}`}>
									<FaPlus /> Add surcharge
								</Link>
							</Col>
						</Row>

						<table className="table table-bordered table-hover">
							<thead>
								<tr className="text-center">
									<th>ID</th>
									<th>Nội dung</th>
									<th>Số lượng</th>
                                    <th>Giá</th>
                                    <th>Tổng giá</th>
                                    <th>Trạng thái</th>
								</tr>
							</thead>

							<tbody>
								{surcharges.map((surcharge) => (
									<tr key={surcharge.id} className="text-center">
										<td>{surcharge.id}</td>
										<td>{surcharge.content}</td>
                                        <td>{surcharge.quantity}</td>
										<td>{surcharge.price.toLocaleString('vi-VN')}</td>
                                        <td>{surcharge.total.toLocaleString('vi-VN')}</td>
										<td>{surcharge.status}</td>
										<td className="gap-2">
											<Link to={`/edit-surcharge/${surcharge.id}`} className="gap-2"
                                            state={{bookingId:bookingId}}>
												<span className="btn btn-warning btn-sm ml-5">
													<FaEdit />
												</span>
											</Link>
											<button
												className="btn btn-danger btn-sm ml-5"
												onClick={() => handleDelete(surcharge.id)}>
												<FaTrashAlt />
											</button>
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
export default Surcharge;