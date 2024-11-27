import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { DeleteSurcharge, getSurchargeOfBooking } from "../utils/ApiSurchargeFunction"
import { getUsedServicesOfBooking } from "../utils/ApiServiceFunction"

const UsedService = () => {
    const { bookingId } = useParams()
    const [usedServices, setUsedServices] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        fetchUsedServices()
	}, [])

	const fetchUsedServices = async () => {
		setIsLoading(true)
		try {
			const result = await getUsedServicesOfBooking(bookingId)
			setUsedServices(result)
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
				<p>Loading used service ...</p>
			) : (
				<>
					<section className="mt-5 mb-5 container">
						<div className="d-flex justify-content-between mb-3 mt-5">
							<h2>Used service of booking {bookingId}</h2>
						</div>
                        <div className="d-grid gap-2 d-md-flex mt-2">
                            <Link to={`/checkin-checkout`} className="btn btn-outline-info">
                                Back
                            </Link>
                        </div>

						<Row>
							<Col md={12} className="d-flex justify-content-end">
								<Link to={`/add-used-service/${bookingId}`}>
									<FaPlus /> Manage service
								</Link>
							</Col>
						</Row>

						<table className="table table-bordered table-hover">
							<thead>
								<tr className="text-center">
									<th>ID</th>
									<th>Tên dịch vụ</th>
									<th>Chi tiết</th>
								</tr>
							</thead>

							<tbody>
								{usedServices.map((usedService) => (
									<tr key={usedService.id} className="text-center">
										<td>{usedService.id}</td>
										<td>{usedService.serviceName}</td>
										<td
										dangerouslySetInnerHTML={{
											__html: usedService.description ?? "",
										}}
										></td>
										{/* <td className="gap-2">
											<Link to={`/edit-surcharge/${usedService.id}`} className="gap-2"
                                            state={{bookingId:bookingId}}>
												<span className="btn btn-warning btn-sm ml-5">
													<FaEdit />
												</span>
											</Link> 
											<button
												className="btn btn-danger btn-sm ml-5"
												onClick={() => handleDelete(usedService.id)}>
												<FaTrashAlt />
											</button>
										</td> */}
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
export default UsedService;