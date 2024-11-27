import React from 'react';
import Button from 'react-bootstrap/Button';


const AddRoomDetail = ({
    selectedDetailText,
    setSelectedDetailText,
    detailTexts,
    setDetailTexts,
    selectedPhoto,
    setSelectedPhoto,
    photos,
    setPhotos,
    selectedPhotoIndex,
    setSelectedPhotoIndex,
    selectedPhotoUrl,
    setSelectedPhotoUrl,
    photoUrls,
    setPhotoUrls,
    selectedPhotoUrlIndex,
    setSelectedPhotoUrlIndex,
}) => {
    const KeepScroll=()=>{
        const currentScrollPosition = window.scrollY;
        setTimeout(() => {
            window.scrollTo(0, currentScrollPosition);
        }, 0);
    }

    const handleInputDetailText = (e) => {
        setSelectedDetailText(e.target.value);
    }

    const AddDetailText = () =>{
        if (selectedDetailText) {
            setDetailTexts(prevDetailTexts => [...prevDetailTexts, selectedDetailText]);
            setSelectedDetailText("");
        }
        KeepScroll();
    }

    const HandelSelectDetailText=(detail)=>{
        setSelectedDetailText(detail)
    }

    const RemoveDetailText=()=>{
        if(selectedDetailText){
            setDetailTexts(prevDetailTexts => 
                prevDetailTexts.filter(detail => detail !== selectedDetailText)
            );
            setSelectedDetailText("");
        }
        KeepScroll();
    }

    const HandleInputPhoto = (e) =>{
        const selectedImage = e.target.files[0]
        setSelectedPhoto(selectedImage);
    }

    const AddSelectedPhoto = () => {
        if(selectedPhoto){
            setPhotos(prevPhotos => [... prevPhotos, selectedPhoto])
            setSelectedPhoto(null)
            setSelectedPhotoIndex(null)
        }
        KeepScroll();
    }

    const HandleSelectPhoto = (selectPhoto, index) => {
        setSelectedPhoto(selectPhoto);
        setSelectedPhotoIndex(index);
    }

    const RemoveSelectedPhoto = () => {
        if(selectedPhoto){
            setPhotos(prevPhotos => prevPhotos.filter(photo => photo !== selectedPhoto))
            setSelectedPhoto(null)
            setSelectedPhotoIndex(null);
        }
        KeepScroll();
    }

    const HandleInputPhotoUrl = (e) => {
        setSelectedPhotoUrl(e.target.value);        
    }

    const AddSelectedPhotoUrl = () => {
        if(selectedPhotoUrl){
            setPhotoUrls(prevPhotos => [...prevPhotos, selectedPhotoUrl])
            setSelectedPhotoUrl("")
            setSelectedPhotoUrlIndex(null);
        }
        KeepScroll();
    }

    const HandleSelectPhotoUrl = (selectPhoto, index) => {
        setSelectedPhotoUrl(selectPhoto);
        setSelectedPhotoUrlIndex(index);
    }

    const RemoveSelectedPhotoUrl = () => {
        if(selectedPhotoUrl){
            setPhotoUrls(prevPhotos => prevPhotos.filter(photo => photo !== selectedPhotoUrl))
            setSelectedPhotoUrl("")
            setSelectedPhotoUrlIndex(null);
        }
        KeepScroll();
    }

    return(
    <>
        <div className="mb3">
            <div>
                {detailTexts && detailTexts.map((detail, index) => (
                    <div key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => HandelSelectDetailText(detail)}
                    className="square border rounded mb-2 p-1"
                    >{detail}</div>
                ))}
            </div>
            <div>
                <input 
                    id="detailText" 
                    name="detailText" 
                    placeholder="Thêm chi tiết phòng"
                    value={selectedDetailText} 
                    className="form-control"
                    onChange={handleInputDetailText} 
                />
            </div>
            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={AddDetailText}>Add</Button>
                <Button variant="secondary" onClick={RemoveDetailText}>Remove</Button>
            </div>
        </div>
        <div className="mb3">
            <label htmlFor="photo" className="form-label">Photo file</label>
            <div>
                {photos && photos.map((photo, index) => (
                    <span key={index} onClick={() => HandleSelectPhoto(photo, index)}
                    style={{
                        cursor: 'pointer',
                        border: selectedPhotoIndex === index ? '2px solid blue' : 'none', // Hiển thị viền khi được chọn
                        display: 'inline-block', // Để viền có tác dụng
                        margin: '5px' // Thêm một chút khoảng cách
                    }}>
                        <img
                            src={photo instanceof File ? URL.createObjectURL(photo) : `data:image/jpeg;base64,${photo}`}
                            alt="Preview  room photo"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                        ></img>
                    </span>
                ))}
            </div>
            <div>
                <input id="photo" name="photo"
                type="file" className="form-control"
                onChange={HandleInputPhoto}/>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={AddSelectedPhoto}>Add</Button>
                <Button variant="secondary" onClick={RemoveSelectedPhoto}>Remove</Button>
            </div>
        </div>
        <div className="mb3">
            <label htmlFor="photo_url" className="form-label">Photo url</label>
            <div>
                {photoUrls && photoUrls.map((photo, index) => (
                    <span key={index} onClick={() => HandleSelectPhotoUrl(photo, index)}
                    style={{
                        cursor: 'pointer',
                        border: selectedPhotoUrlIndex === index ? '2px solid blue' : 'none', // Hiển thị viền khi được chọn
                        display: 'inline-block', // Để viền có tác dụng
                        margin: '5px' // Thêm một chút khoảng cách
                    }}>
                        <img
                            src={photo}
                            alt="Preview  room photo"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                        ></img>
                    </span>
                ))}
            </div>
            <div>
                <input id="photo_url" name="photo_url" className="form-control" 
                    placeholder="Thêm url hình ảnh phòng"
                    value={selectedPhotoUrl}
                    onChange={HandleInputPhotoUrl}/>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={AddSelectedPhotoUrl}>Add</Button>
                <Button variant="secondary" onClick={RemoveSelectedPhotoUrl}>Remove</Button>
            </div>
        </div>
    </>
    )
};
export default AddRoomDetail;