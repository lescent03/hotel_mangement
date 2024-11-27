import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';

const NumGuestInput = ({
  numRoom, setNumRoom,
  adults, setAdults,
  children, setChildren,
  childrenAges, setChildrenAges
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleNumRoomChange = (change) => {
    setNumRoom(Math.max(1, numRoom + change));
  };

  const handleAdultChange = (change) => {
    setAdults(Math.max(1, adults + change));
  };

  const handleChildChange = (change) => {
    const newChildren = Math.max(0, children + change);
    setChildren(newChildren);
    if (newChildren > children) {
      setChildrenAges([...childrenAges, '']);
    } else {
      setChildrenAges(childrenAges.slice(0, newChildren));
    }
  };

  const handleChildAgeChange = (index, age) => {
    const newAges = [...childrenAges];
    newAges[index] = age;
    setChildrenAges(newAges);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-100">
      <Button
        variant="light"
        onClick={toggleDropdown}
        className="d-flex align-items-center w-100 px-3 py-1.5"
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ced4da',
          borderRadius: '4px',
          boxShadow: 'none',
          cursor: 'pointer'
        }}
        ref={buttonRef} // Gắn ref cho Button
      >
        <span>{adults} người lớn, {children} trẻ em, {numRoom} phòng</span>
      </Button>

      {isDropdownOpen && (
        <div
          className="dropdown mt-2 p-3 border rounded shadow"
          ref={dropdownRef} // Gắn ref cho dropdown
        >
          <div className="d-flex justify-content-between align-items-center pb-1">
            <span>Số phòng:</span>
            <div className="d-flex align-items-center">
              <div
                onClick={() => handleNumRoomChange(-1)}
                className="rounded-circle btn btn-success mx-1 d-flex justify-content-center align-items-center"
                style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
              >
                -
              </div>
              <span className="mx-2">{numRoom}</span>
              <div
                onClick={() => handleNumRoomChange(1)}
                className="rounded-circle btn btn-success mx-1 d-flex justify-content-center align-items-center"
                style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
              >
                +
              </div>

            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center pb-1">
            <span>Người lớn:</span>
            <div className="d-flex align-items-center">

              <div
                onClick={() => handleAdultChange(-1)}
                className="rounded-circle btn btn-success mx-1 d-flex justify-content-center align-items-center"
                style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
              >
                -
              </div>
              <span className="mx-2">{adults}</span>
              <div
                onClick={() => handleAdultChange(1)}
                className="rounded-circle btn btn-success mx-1 d-flex justify-content-center align-items-center"
                style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
              >
                +
              </div>

            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span>Trẻ em:</span>
            <div className="d-flex align-items-center">

              <div
                onClick={() => handleChildChange(-1)}
                className="rounded-circle btn btn-success mx-1 d-flex justify-content-center align-items-center"
                style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
              >
                -
              </div>
              <span className="mx-2">{children}</span>
              <div
                onClick={() => handleChildChange(1)}
                className="rounded-circle btn btn-success mx-1 d-flex justify-content-center align-items-center"
                style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
              >
                +
              </div>
            </div>
          </div>

          {children > 0 && (
            <div>
              {childrenAges.map((age, index) => (
                <div key={index}>
                  <label>Tuổi trẻ em {index + 1}:</label>
                  <input
                    type="number"
                    value={age || 8}
                    onChange={(e) => handleChildAgeChange(index, e.target.value)}
                    min={1} // Giá trị nhỏ nhất
                    max={11} // Giá trị lớn nhất
                    placeholder="Nhập tuổi"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NumGuestInput;
