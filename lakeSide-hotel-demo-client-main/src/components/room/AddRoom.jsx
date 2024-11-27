import React, { useEffect, useState } from "react"
import RoomTypeSelector from "../common/RoomTypeSelector"
import { Link } from "react-router-dom"
import AddRoomDetail from "./AddRoomDetail"
import RoomModel from "../../model/Room"
import RoomServiceSelector from "./RoomServiceSelector"
import RoomDetail from "../../model/RoomDetail"
import { addRoom } from "../utils/ApiRoomFunction"

const AddRoom = () => {
	const [newRoom, setNewRoom] = useState(new RoomModel())

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
		if (name === "price" || name === "adults" || name === "childrents") {
			if (!isNaN(value)) {
				value = parseInt(value)
			} else {
				value = ""
			}
		}
		// Cập nhật thuộc tính trong newRoom
		setNewRoom((prevRoom) => ({
			...prevRoom,
			[name]: value, // Cập nhật thuộc tính tương ứng dựa trên name
		  }));
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const combinedArray = await convertPhotosAndCombineArrays();
			const roomDetails = [];

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
				setNewRoom(prevRoom => {
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
	
			// Lúc này updatedRoom đã được cập nhật, truyền nó vào addRoom
			const success = await addRoom(updatedRoom);
	
			if (success !== undefined) {
				setSuccessMessage("A new room was added successfully!");
				//setNewRoom(new RoomModel());
				setErrorMessage("");
				//resetState();
			} else {
				setErrorMessage("Error adding new room");
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

	const convertPhotosAndCombineArrays = async () => {
		let base64Results = []
		try {
		  // Chuyển đổi tất cả các file thành base64
		  const base64Promises = photos.map(file => convertFileToBase64(file));
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

	  const resetState = () => {
		setSelectedDetailText("");
		setDetailTexts([]);
	
		setSelectedPhoto(null);
		setPhotos([]);
		setSelectedPhotoIndex(null);
	
		setSelectedPhotoUrl("");
		setPhotoUrls([]);
		setSelectedPhotoUrlIndex(null);
	
		setSelectedServices([]);
	};

	return (
		<>
			<section className="container mt-5 mb-5">
				<div className="row justify-content-center">
					<div className="col-md-8 col-lg-6">
						<h2 className="mt-5 mb-2">Add a New Room</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

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
									value={newRoom?.codeRoom || ""}
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
									value={newRoom?.price || ""}
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
									value={newRoom?.adults || ""}
									min="1"
									onChange={handleRoomInputChange}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="roomPrice" className="form-label">
									Trẻ em
								</label>
								<input
									required
									type="number"
									className="form-control"
									id="childrents"
									name="childrents"
									placeholder="Số lượng trẻ em"
									value={newRoom?.childrents !== undefined ? newRoom.childrents : ""}
									min="0"
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
									value={newRoom?.numOfRoom || ""}
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
									value={newRoom?.description || ""}
									onChange={handleRoomInputChange}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="roomType" className="form-label">
									Thể loại
								</label>
								<div>
									<RoomTypeSelector
										setNewRoom={setNewRoom}
										newRoom={newRoom}
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
							{/* <div className="mb-3">
								<label htmlFor="services" className="form-label">
									Dịch vụ tích hợp
								</label>
								<div>
									<RoomServiceSelector
									selectedServices={selectedServices} 
									setSelectedServices={setSelectedServices}/>
								</div>
							</div> */}
							<div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/existing-rooms"} className="btn btn-outline-info">
									Existing rooms
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save Room
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	)
}

export default AddRoom
