import { useEffect, useState } from "react";
import RoomModel from "../../model/Room";
import { Link, useLocation, useParams } from "react-router-dom"

import {getRoomById} from "../utils/ApiRoomFunction";
import { Carousel, Row, Col, Container, Button } from "react-bootstrap";
import { MdDoneAll } from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { FaChildren } from "react-icons/fa6";
import { ImManWoman } from "react-icons/im";
import { IoPricetagsOutline } from "react-icons/io5";
import { TbBrandBooking } from "react-icons/tb";

const RoomDetail = () => {
    const { roomId } = useParams()

    const location = useLocation()
	const { checkInDate, checkOutDate, adults, children, numRoom, childrenAges } = location.state || 
    {checkInDate:null, checkOutDate:null, adults:null, children:null, numRoom:null, childrenAges:null}

    const [room ,setRoom] = useState(new RoomModel())

    console.log('checkInDate: ',checkInDate);
    console.log('checkOutDate: ',checkOutDate);
    console.log('adults: ',adults);
    console.log('children: ',children);
    console.log('numRoom: ',numRoom);
    
    
    const fetchRoom = async () => {
        console.log("fetchRoom started");
        try {
            const roomData = await getRoomById(roomId);
            console.log("roomData received:", roomData);
            setRoom(roomData);
        } catch (error) {
            console.error("Error fetching room:", error);
        }
        console.log("fetchRoom completed");
    };

    useEffect(() => {
        console.log("useEffect running, roomId:", roomId);
        if (roomId) {
            fetchRoom();
        }
    }, [roomId]);

    return(
        <Container>
            <Row className="pt-2">
                <Col sm={6}>
                    <Carousel>
                        {room.roomDetails && room.roomDetails.map((detail, index) => {
                            if (detail.photo_url || detail.photo) {
                                return (
                                    <Carousel.Item key={index}>
                                        <img
                                            src={detail.photo_url || `data:image/png;base64, ${detail.photo || ""}`}
                                            alt={`Room Photo ${index + 1}`}
                                            className="img-fluid"
                                        />
                                    </Carousel.Item>
                                );
                            }
                            return null;
                        })}
                    </Carousel>
                </Col>

                <Col sm={6} className="d-flex flex-column justify-content-between"> 
                    <div>
                        <div>
                            <h5>Thể loại:</h5>
                            <p>{room.category?.type} - {room.category?.description}</p>
                        </div>
                        <div>
                            <h5>Số lượng:</h5>
                            <p><ImManWoman /> {room.adults} người lớn - <FaChildren /> {room.childrents} trẻ em</p>
                        </div>
                        <div className="text-break">
                            <h5>Mô tả:</h5>
                            <p>{room.description}</p>
                        </div>
                        <div>
                            <h5>Giá tiền:</h5>
                            <p><IoPricetagsOutline /> {room.price?.toLocaleString('vi-VN')} VND/Đêm</p>
                        </div>
                    </div>

                    {/* Button ở phía dưới, không sử dụng position-absolute */}
                    {checkInDate && checkOutDate && adults && numRoom &&
                        <div className="mt-3"> {/* Thêm khoảng cách giữa button và phần trên */}
                        <Link to={`/book-room/${room.id}`}
                            state={{checkInDate:checkInDate, checkOutDate:checkOutDate, adults:adults, 
                                children:children, numRoom:numRoom, childrenAges:childrenAges}}>
                            <Button variant="outline-primary">
                                <TbBrandBooking /> Đặt phòng {numRoom && 
                                <label>Số lượng: {numRoom}</label>}
                            </Button>
                            
                        </Link>
                    </div>}
                </Col>
            </Row>
            <Row className="mt-4 mb-5">
    <h5>Chi tiết</h5>
    {room.roomDetails && (
        <Row>
            {room.roomDetails.map((detail, index) => {
                if (detail.info) {
                    return (
                        <Col md={4} key={index} className="d-flex align-items-start">
                            <BsInfoLg className="me-2" />
                            <p className="text-break mb-0">{detail.info}</p>
                        </Col>
                    );
                }
                return null;    
            })}
        </Row>
    )}
</Row>
            {/* <Row className="mt-12">
                <Col>
                    <h5>Chi tiết</h5>
                    {room.roomDetails && room.roomDetails.map(detail =>{
                        if(detail.info)
                            return (<p className="text-left text-break">
                            <BsInfoLg /> {detail.info}</p>)
                    })}
                </Col>
                {/* <Col>
                    <h5>Dịch vụ có sẵn: </h5>
                    {room.services && room.services.map(service =>(
                        <p className="text-left text-break"><MdDoneAll /> {service.serviceName}</p>
                    ))}
                </Col> 
            </Row> */}
        </Container>
        
    );
}
export default RoomDetail;