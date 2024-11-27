import { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { getAllRooms } from "../utils/ApiRoomFunction"
import { Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa"

const RoomStatus = () => {
    const [rooms, setRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
		fetchRooms()
	}, [])

	const fetchRooms = async () => {
		setIsLoading(true)
		try {
			const result = await getAllRooms()
			setRooms(result)
			setIsLoading(false)
		} catch (error) {
			setErrorMessage(error.message)
			setIsLoading(false)
		}
	}

    return(
        <>
        {isLoading ? (
				<p>Loading statuses rooms</p>
			) : (
                <Accordion>
                {rooms && rooms.map(room=>(
                    <Accordion.Item eventKey={room.id} key={room.id}>
                        <Accordion.Header>{room.codeRoom} - {room.description}</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col md={12} className="d-flex justify-content-end">
                                    <Link to={`/add-status/${room.id}`}>
                                        <FaPlus /> Add status
                                    </Link>
                                </Col>
                            </Row>
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr className="text-center">
                                        <th>ID</th>
                                        <th>Start date</th>
                                        <th>End date</th>
                                        <th>Status</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {room.statuses?.map((status) => (
                                        <tr key={status.id} className="text-center">
                                            <td>{status.id}</td>
                                            <td>{status.startDate}</td>
                                            <td>{status.endDate}</td>
                                            <td>{status.status}</td>
                                            <td>{status.description}</td>
                                            <td className="gap-2">
                                                <Link to={`/edit-status/${status.id}`} className="gap-2">
                                                    <span className="btn btn-info btn-sm">
                                                        <FaEye />
                                                    </span>
                                                    <span className="btn btn-warning btn-sm ml-5">
                                                        <FaEdit />
                                                    </span>
                                                </Link>
                                                {/* <button
                                                    className="btn btn-danger btn-sm ml-5"
                                                    onClick={() => handleDelete(status.id)}>
                                                    <FaTrashAlt />
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Accordion.Body>
                    </Accordion.Item>                    
                ))}
                </Accordion>
            )}
        </>
    )
}
export default RoomStatus;