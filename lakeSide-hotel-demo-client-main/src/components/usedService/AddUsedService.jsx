import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { CreateSurcharge } from "../utils/ApiSurchargeFunction"
import { Form } from "react-bootstrap"
import RoomServiceSelector from "../room/RoomServiceSelector"
import BookedRoom from "../../model/BookedRoom"
import { AddUsedServiceOfBooking, getBookingById } from "../utils/ApiBookingFunction"

const AddUsedService = () => {
    const { bookingId } = useParams()
    const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

    const [servicesNoShow, setServicesNoShow] = useState([])
	const [selectedServices, setSelectedServices] = useState([])

    const [booking, setBooking] = useState(new BookedRoom())

    const fetchBooking = async () => {
        try {
            const booking = await getBookingById(bookingId)
            if(booking){
                setBooking(booking)
                setSelectedServices(booking.services)
            }
                
            else{
                setErrorMessage("Không tìm thấy booking bằng id")
            }
            
        } catch (error) {
            setErrorMessage(error.message)
            console.error(error)
        }
    }

    useEffect(()=>{
		fetchBooking()
    },[bookingId])

    const handleSubmit = async (e) => {
		e.preventDefault();
        try{
            // Lúc này updatedRoom đã được cập nhật, truyền nó vào addRoom
            const success = await AddUsedServiceOfBooking(bookingId, selectedServices);

            if (success) {
                setSuccessMessage("service was updated for booking successfully!");
                setErrorMessage("");
                fetchBooking()
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
                <h2 className="mt-5 mb-2">Update service for booking {bookingId}</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

                        <Form noValidate onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label htmlFor="guestEmail" className="hotel-color">
										Dịch vụ
									</Form.Label>
									<div>
										<RoomServiceSelector
										selectedServices={selectedServices} 
										setSelectedServices={setSelectedServices}
										servicesNoShow={servicesNoShow}/>
									</div>
								</Form.Group> 

								<div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={`/used-service/${bookingId}`} className="btn btn-outline-info">
									Back
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save
								</button>
							</div>
							</Form>
                </div>
            </div>
        </section>
        </>
    )
}
export default AddUsedService;