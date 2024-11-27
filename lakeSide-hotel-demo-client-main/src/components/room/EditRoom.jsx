import React, { useEffect, useState } from "react"
import { getRoomById, updateRoom } from "../utils/ApiRoomFunction"
import { Link, useParams } from "react-router-dom"

import RoomTypeSelector from "../common/RoomTypeSelector"

import AddRoomDetail from "./AddRoomDetail"
import RoomModel from "../../model/Room"
import RoomServiceSelector from "./RoomServiceSelector"
import RoomDetail from "../../model/RoomDetail"

const EditRoom = () => {
	
	const { roomId } = useParams()
	const [room, setRoom] = useState(new RoomModel())

	const [selectedDetailText, setSelectedDetailText] = useState("");
    const [detailTexts, setDetailTexts]  = useState([]);

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState("");
    const [photoUrls, setPhotoUrls] = useState([]);
    const [selectedPhotoUrlIndex, setSelectedPhotoUrlIndex] = useState(null);

	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

	const [selectedServices, setSelectedServices] = useState([])

	const convertFileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
		  if (!file) {
			reject('Không có file');
			return;
		  }
	  
		  const reader = new FileReader();
		  
		  reader.onload = () => {
			// Kết quả base64 đầy đủ với prefix
			const fullBase64 = reader.result;
			// Cắt bỏ prefix để lấy chuỗi base64 thuần túy
			const base64String = fullBase64.split(',')[1];
			resolve(base64String);
		  };
	  
		  reader.onerror = (error) => {
			reject(error);
		  };
	  
		  reader.readAsDataURL(file);
		});
	};

	const handleRoomInputChange = (e) => {
		const name = e.target.name
		let value = e.target.value
		if (name === "price" || name === "adults" || name === "childrents" || name === "numOfRoom") {
			if (!isNaN(value)) {
				value = parseInt(value)
			} else {
				value = ""
			}
		}
		// Cập nhật thuộc tính trong newRoom
		setRoom((prevRoom) => ({
			...prevRoom,
			[name]: value, // Cập nhật thuộc tính tương ứng dựa trên name
		  }));
	}

	useEffect(() => {
		const fetchRoom = async () => {
			try {
				const roomData = await getRoomById(roomId)
				setRoom(roomData)
				const newDetailTexts = [];
				const newPhotos = [];
				const newPhotoUrls = [];
				const newSelectedServices = [];

				roomData.roomDetails.forEach((detail) => {
					if (detail.info) newDetailTexts.push(detail.info);
					if (detail.photo) newPhotos.push(detail.photo);
					if (detail.photo_url) newPhotoUrls.push(detail.photo_url);
				});

				roomData.services.forEach((service) => {
					newSelectedServices.push(service);
				});

				// Cập nhật state một lần cho mỗi mảng
				setDetailTexts(newDetailTexts);
				setPhotos(newPhotos);
				setPhotoUrls(newPhotoUrls);
				setSelectedServices(newSelectedServices);
				
			} catch (error) {
				console.error(error)
			}
		}

		fetchRoom()
	}, [roomId])

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const combinedArray = await convertPhotosAndCombineArrays();
			const roomDetails = [];
	
			const maxLength2 = Math.max(combinedArray.length, detailTexts.length);

			let k = 0;
			for(let i = 0; i <= detailTexts.length; i++){
				const info = detailTexts[i] || null;
				let photo = null;
				let photo_url = null;
				while(k < combinedArray.length){
					photo = null;
					photo_url = null;
					if (k % 2 == 0) {
						photo = combinedArray[k];
					} else {
						photo_url = combinedArray[k];
					}
					k++;
					if(photo || photo_url){
						break;
					}
				}
				
				if(i == detailTexts.length && k < combinedArray.length){
					k--;
					while(k < combinedArray.length){
						photo = null;
						photo_url = null;
						if (k % 2 == 0) {
							photo = combinedArray[k];
						} else {
							photo_url = combinedArray[k];
						}
						k++;
						if(photo || photo_url){
							roomDetails.push(new RoomDetail(null, info, photo, photo_url, null));
						}
					}
					continue;
				}
				if(info || photo || photo_url)
					roomDetails.push(new RoomDetail(null, info, photo, photo_url, null));
			}
	
			console.log("toàn bộ room detail: ", roomDetails);
	
			// Tạo một Promise để đợi setNewRoom hoàn thành
			const updatedRoom = await new Promise(resolve => {
				setRoom(prevRoom => {
					const updatedRoom = {
						...prevRoom,
						services: selectedServices,
						roomDetails: roomDetails
					};
					console.log("new room hoàn chỉnh: ", updatedRoom);
					resolve(updatedRoom);
					return updatedRoom;
				});
			});
			console.log("dữ liệu sau khi sửa: ", updatedRoom)

			const response = await updateRoom(roomId, updatedRoom)
			if (response.status === 200) {
				setSuccessMessage("Room updated successfully!")
				const updatedRoomData = await getRoomById(roomId)
				setRoom(updatedRoomData)
				setErrorMessage("")
			} else {
				setErrorMessage("Error updating room")
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
	}

	const convertPhotosAndCombineArrays = async () => {
		let base64Results = []
		try {
		  // Chuyển đổi tất cả các file thành base64
		  const base64Promises = photos.map(file =>file instanceof File ? convertFileToBase64(file) : file);
		  base64Results = await Promise.all(base64Promises);
		  
		  // Tạo mảng kết hợp ngay sau khi có kết quả base64
		  const combinedArray = [];
		  const maxLength = Math.max(base64Results.length, photoUrls.length);
		  
		  for (let i = 0; i < maxLength; i++) {
			// Thêm phần tử từ base64Results vào vị trí chẵn
			if (i < base64Results.length) {
			  combinedArray[i * 2] = base64Results[i];
			} else {
			  combinedArray[i * 2] = null;
			}
			
			// Thêm phần tử từ photoUrls vào vị trí lẻ
			if (i < photoUrls.length) {
			  combinedArray[i * 2 + 1] = photoUrls[i];
			} else {
			  combinedArray[i * 2 + 1] = null;
			}
		  }
	  
		  console.log("mảng kết hợp: ", combinedArray);
		  
		  // Trả về mảng kết hợp nếu bạn cần sử dụng
		  return combinedArray;
		  
		} catch (error) {
		  console.error('Error converting files to base64:', error);
		  return [];
		}
	};

	return (
		<div className="container mt-5 mb-5">
			<h3 className="text-center mb-5 mt-5">Edit Room</h3>
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					{successMessage && (
						<div className="alert alert-success" role="alert">
							{successMessage}
						</div>
					)}
					{errorMessage && (
						<div className="alert alert-danger" role="alert">
							{errorMessage}
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="codeRoom" className="form-label">
								Mã phòng
							</label>
							<input
								required
								className="form-control"
								id="codeRoom"
								name="codeRoom"
								placeholder="Nhập mã phòng"
								value={room?.codeRoom || ""}
								onChange={handleRoomInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="price" className="form-label">
								Giá phòng
							</label>
							<input
								required
								type="number"
								className="form-control"
								id="price"
								name="price"
								placeholder="Nhập giá phòng"
								value={room?.price || ""}
								onChange={handleRoomInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="adults" className="form-label">
								Người lớn
							</label>
							<input
								required
								type="number"
								className="form-control"
								id="adults"
								name="adults"
								placeholder="Số lượng người lớn"
								value={room?.adults || ""}
								onChange={handleRoomInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="childrents" className="form-label">
								Trẻ em
							</label>
							<input
								required
								type="number"
								className="form-control"
								id="childrents"
								name="childrents"
								placeholder="Số lượng trẻ em"
								value={room?.childrents || ""}
								onChange={handleRoomInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="numOfRoom" className="form-label">
								Số lượng phòng
							</label>
							<input
								required
								type="number"
								className="form-control"
								id="numOfRoom"
								name="numOfRoom"
								placeholder="Số lượng phòng"
								value={room?.numOfRoom || ""}
								onChange={handleRoomInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="description" className="form-label">
								Mô tả
							</label>
							<textarea
								required
								className="form-control"
								id="description"
								name="description"
								placeholder="Nhập mô tả ..."
								value={room?.description || ""}
								onChange={handleRoomInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="roomType" className="form-label">
								Thể loại
							</label>
							<div>
								<RoomTypeSelector
									setNewRoom={setRoom}
									newRoom={room}
								/>
							</div>
						</div>
						<div className="mb3">
							<label htmlFor="photo" className="form-label">
								Chi tiết
							</label>
							<AddRoomDetail
								selectedDetailText={selectedDetailText}
								setSelectedDetailText={setSelectedDetailText}
								detailTexts={detailTexts}
								setDetailTexts={setDetailTexts}
								selectedPhoto={selectedPhoto}
								setSelectedPhoto={setSelectedPhoto}
								photos={photos}
								setPhotos={setPhotos}
								selectedPhotoIndex={selectedPhotoIndex}
								setSelectedPhotoIndex={setSelectedPhotoIndex}
								selectedPhotoUrl={selectedPhotoUrl}
								setSelectedPhotoUrl={setSelectedPhotoUrl}
								photoUrls={photoUrls}
								setPhotoUrls={setPhotoUrls}
								selectedPhotoUrlIndex={selectedPhotoUrlIndex}
								setSelectedPhotoUrlIndex={setSelectedPhotoUrlIndex}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="services" className="form-label">
								Dịch vụ tích hợp
							</label>
							<div>
								<RoomServiceSelector
								selectedServices={selectedServices} 
								setSelectedServices={setSelectedServices}/>
							</div>
						</div>
						<div className="d-grid gap-2 d-md-flex mt-2">
							<Link to={"/existing-rooms"} className="btn btn-outline-info ml-5">
								back
							</Link>
							<button type="submit" className="btn btn-outline-warning">
								Edit Room
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
export default EditRoom
