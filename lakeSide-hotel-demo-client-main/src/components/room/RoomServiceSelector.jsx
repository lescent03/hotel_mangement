import { Form } from "react-bootstrap"

import { useState, useEffect } from "react"
import { GetAllService } from "../utils/ApiServiceFunction"

const RoomServiceSelector = ({ selectedServices, setSelectedServices, servicesNoShow }) =>{
    const [services, setServices] = useState([])

    useEffect(() => {
		GetAllService().then((data) => {

            if(servicesNoShow){
                // Lọc bỏ các service có trong servicesNoShow
                const filteredServices = data.filter(service => 
                    !servicesNoShow.some(noShowService => noShowService.id === service.id)
                );
                
                setServices(filteredServices);
            }
			else{
                console.log("không có dịch vụ để bỏ")
                setServices(data)
            }
		})
	}, [servicesNoShow])

    const handleServiceChange = (e, service) => {
        const isChecked = e.target.checked;

        setSelectedServices((prevSelectedServices) => {
            if (isChecked) {
                // Nếu checkbox được tick, thêm đối tượng vào selectedServices
                return [...prevSelectedServices, service];
            } else {
                // Nếu checkbox bị bỏ tick, xóa đối tượng khỏi selectedServices
                return prevSelectedServices.filter(selected => selected.id !== service.id);
            }
        });        
    };

    // return(
    //     <>
    //     {services && services.map((service, index) => (
    //         <Form.Check
    //             key={service.id}
    //             inline
    //             label={`${service.serviceName} - ${service.description}`}
    //             name={service.serviceName}
    //             type="checkbox"
    //             id={service.id}
    //             checked={selectedServices.some(selected => selected.id === service.id)} // Điều khiển trạng thái của checkbox
    //             onChange={(e) => handleServiceChange(e, service)} // Gọi hàm khi checkbox thay đổi
    //         ></Form.Check>
    //     ))}
    //     </>
    // )
    const serviceBoxStyle = {
        border: "1px solid #ddd", // Đường viền
        borderRadius: "8px", // Bo góc
        padding: "10px", // Khoảng cách trong
        marginBottom: "10px", // Khoảng cách giữa các hộp
        backgroundColor: "#f9f9f9", // Màu nền
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng
        display: "flex", // Sử dụng flexbox
        alignItems: "center", // Căn giữa nội dung theo chiều dọc
    };
    return (
        <>
            {services && services.map((service, index) => (
                <div key={service.id} style={serviceBoxStyle}>
                    <Form.Check
                        inline
                        // label={`${service.serviceName} - ${service.description}`}
                        label={<span dangerouslySetInnerHTML={{ 
                            __html: `<strong>${service.serviceName}</strong><br/>${service.description}` 
                          }} />}
                        name={service.serviceName}
                        type="checkbox"
                        id={service.id}
                        checked={selectedServices.some(selected => selected.id === service.id)}
                        onChange={(e) => handleServiceChange(e, service)}
                    />
                </div>
            ))}
        </>
    )
}
export default RoomServiceSelector;