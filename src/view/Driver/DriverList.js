import React, { useState, useEffect } from 'react';
import Driver from '/Users/ttcenter/Manager_LT_Driver/driver-management/src/model/DriverModel.js';
import DriverViewModel from '../../viewmodel/DriverViewModel';


const DriverList = () => {
    
    const [drivers, setDrivers] = useState([]);
    const [newDriver, setNewDriver] = useState(new Driver('', '', '', '', '', '','','', { payloadCapacity: '', inspectionExpiryDate: '' }, '', ''));
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentDriverId, setCurrentDriverId] = useState(null);
    const driverViewModel = new DriverViewModel();
    const [activeDrivers, setActiveDrivers] = useState([]);
    const [inactiveDrivers, setInactiveDrivers] = useState([]);
    const [suspendedDrivers, setSuspendedDrivers] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

   const fetchDrivers = async () => {
    try {
        const response = await driverViewModel.getDrivers();
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
            // Phân loại tài xế theo trạng thái
            const active = response.data
                .filter(driver => driver.statusAccout === 'active')
                .map(driver => ({
                    ...Driver.fromApiResponse(driver),
                    id: driver._id
                }));
            
            const inactive = response.data
                .filter(driver => driver.statusAccout === 'inactive')
                .map(driver => ({
                    ...Driver.fromApiResponse(driver),
                    id: driver._id
                }));

            const suspended = response.data
                .filter(driver => driver.statusAccout === 'suspended')
                .map(driver => ({
                    ...Driver.fromApiResponse(driver),
                    id: driver._id
                }));

            // Lưu từng nhóm vào các biến trạng thái
            setActiveDrivers(active);
            setInactiveDrivers(inactive);
            setSuspendedDrivers(suspended);

            console.log('Active Drivers:', active);
            console.log('Inactive Drivers:', inactive);
            console.log('Suspended Drivers:', suspended);
        } else {
            console.error("Unexpected API response structure:", response.data);
        }
    } catch (error) {
        console.error('Error fetching drivers:', error);
    }
};

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleAddDriver = async (e) => {
        e.preventDefault();
        console.log('Form submitted!');

        try {
            const addedDriver = await driverViewModel.addDriver(newDriver);
            if (addedDriver && addedDriver.statusCode === 200 && addedDriver.message === 'OK') {
                const newDriverObject = Driver.fromApiResponse(addedDriver.data);
                setNewDriver(new Driver('', '', '', '', '', '','', { payloadCapacity: '', inspectionExpiryDate: '' }, '', ''));
                window.alert('Thêm tài xế thành công!');
                fetchDrivers();
            } else {
                alert(`Có lỗi xảy ra khi thêm tài xế: ${addedDriver.message || 'Không có thông điệp lỗi'}`);
            }
        } catch (error) {
            console.error('Error adding driver:', error);
            handleError(error);
        }
    };

    const handleDeleteDriver = async (id) => {
        console.log('Xóa tài xế với ID:', id);
        try {
            const response = await driverViewModel.removeDriver(id);
            if (response && response.statusCode === 200) {
                window.alert('Xóa tài xế thành công!');
                // Gọi fetchDrivers để làm mới danh sách tài xế
                setDrivers(drivers.filter(driver => driver.id !== id));
                await fetchDrivers();
            } else {
                alert(`Có lỗi xảy ra khi xóa tài xế: ${response.message || 'Không có thông điệp lỗi'}`);
            }
        } catch (error) {
            console.error('Error deleting driver:', error);
            alert('Có lỗi xảy ra khi xóa tài xế: ' + error.message);
        }
    };
    

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
        console.log('Cập nhật tài xế với ID:', currentDriverId); // Log ID của tài xế
        console.log('Thông tin tài xế đang cập nhật:', newDriver); // Log thông tin tài xế

        const updatedDriver = await driverViewModel.updateDriver(newDriver); // Gọi phương thức updateDriver từ ViewModel
        
        // Log phản hồi từ API
        console.log('Phản hồi từ API:', updatedDriver);
        alert('Cập nhật tài xế thành công: ' + (updatedDriver.message || 'Không có thông điệp lỗi'));

        // Cập nhật danh sách tài xế
        setDrivers(drivers.map(d => (d.id === currentDriverId ? updatedDriver.data : d))); // Giả sử phản hồi từ API có cấu trúc như vậy
        
        resetForm();
        fetchDrivers();
        } catch (error) {
            console.error('Error updating driver:', error);
            alert('Có lỗi xảy ra khi cập nhật tài xế: ' + error.message); // Hiển thị thông báo lỗi
        }
    };
    
    

    const resetForm = () => {
        setNewDriver(new Driver('', '', '', '', '','', '', { payloadCapacity: '', inspectionExpiryDate: '' }, '', ''));
        setIsUpdating(false);
        setCurrentDriverId(null);
    };
    const handleUpdateDriver = (driver) => {
        console.log(driver);
    
        // Chuyển đổi licenseExpiryDate và vehicle.inspectionExpiryDate thành định dạng YYYY-MM-DD
        const formattedDriver = {
            ...driver,
            licenseExpiryDate: new Date(driver.licenseExpiryDate).toISOString().split('T')[0],
            vehicle: {
                ...driver.vehicle,
                inspectionExpiryDate: new Date(driver.vehicle.inspectionExpiryDate).toISOString().split('T')[0],
            }
        };
    
        setNewDriver(formattedDriver);
        setIsUpdating(true);
        setCurrentDriverId(driver.id);
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewDriver({ ...newDriver, image: reader.result });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            console.log('Error response:', error.response);
            const { error: errorMessage } = error.response.data;
            alert(`Có lỗi xảy ra: ${errorMessage}`);
        } else {
            alert('Có lỗi xảy ra: ' + error.message);
        }
    };

    return (
        <div className="manager-driver-screen">
          
        <div>
    {/* Danh sách Tài xế Active */}
    {activeDrivers && activeDrivers.length > 0 && (
        <>
            <h2>Danh sách Tài xế Đã Kích Hoạt</h2>
            <ul>
                {activeDrivers.map((driver) => (
                    driver ? (
                        <li key={driver.id}>
                            <strong>{driver.fullName || 'Chưa có tên'}</strong>
                            <div>
                                <button onClick={() => handleUpdateDriver(driver)}>Cập nhật</button>
                                <button onClick={() => handleDeleteDriver(driver.id)}>Xoá</button>
                            </div>
                        </li>
                    ) : null
                ))}
            </ul>
        </>
    )}

    {/* Danh sách Tài xế Inactive */}
    {inactiveDrivers && inactiveDrivers.length > 0 && (
        <>
            <h2>Danh sách Tài xế Chưa kích hoạt</h2>
            <ul>
                {inactiveDrivers.map((driver) => (
                    driver ? (
                        <li key={driver.id}>
                            <strong>{driver.fullName || 'Chưa có tên'}</strong>
                            <div>
                                <button onClick={() => handleUpdateDriver(driver)}>Cập nhật</button>
                                <button onClick={() => handleDeleteDriver(driver.id)}>Xoá</button>
                            </div>
                        </li>
                    ) : null
                ))}
            </ul>
        </>
    )}

    {/* Danh sách Tài xế Suspended */}
    {suspendedDrivers && suspendedDrivers.length > 0 && (
        <>
            <h2>Danh sách Tài xế Đình Chỉ</h2>
            <ul>
                {suspendedDrivers.map((driver) => (
                    driver ? (
                        <li key={driver.id}>
                            <strong>{driver.fullName || 'Chưa có tên'}</strong>
                            <div>
                                <button onClick={() => handleUpdateDriver(driver)}>Cập nhật</button>
                                <button onClick={() => handleDeleteDriver(driver.id)}>Xoá</button>
                            </div>
                        </li>
                    ) : null
                ))}
            </ul>
        </>
    )}
            </div>
        <div>
       
            <form onSubmit={isUpdating ? handleUpdateSubmit : handleAddDriver}>
            <h3>{isUpdating ? "Cập nhật tài xế" : "Thêm tài xế mới"}</h3>
    <div>
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Tên tài xế</span>
        <input
            type="text"
            value={newDriver.fullName}
            onChange={(e) => setNewDriver({ ...newDriver, fullName: e.target.value })}
            required
        />
    </div>

    <div>
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Số Giấy phép lái xe</span>
        <input
            type="text"
            value={newDriver.licenseNumber}
            onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
            required
        />
    </div>

    <div>   
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Ngày hết hạn giấy phép</span> 
        <input
            type="date"
            value={newDriver.licenseExpiryDate}
            onChange={(e) => setNewDriver({ ...newDriver, licenseExpiryDate: e.target.value })}
            required
        />
    </div>

    <div>
      
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Số điện thoại</span>
        
        <input
            type="text"
            value={newDriver.phoneNumber}
            onChange={(e) => setNewDriver({ ...newDriver, phoneNumber: e.target.value })}
            required
        />
    </div>

    <div>
     
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Email</span>
        
        <input
            type="email"
            value={newDriver.email}
            onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
            required
        />
    </div>

    <div>
      
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Địa chỉ</span>
        
        <input
            type="text"
            value={newDriver.address}
            onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
            required
        />
    </div>
    <div>
    <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Chọn loại phương tiện</span>
            <select
            value={newDriver.vehicleType || ''}
            onChange={(e) => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
            required
           
            >
            <option value="" disabled>Chọn loại phương tiện</option>
            <option value="Xe tải">Xe tải</option>
            <option value="Xe con">Xe con</option>
            <option value="Xe khách">Xe khách</option>
            <option value="Xe máy">Xe máy</option>
            </select>
  </div>

    <div>
        
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Tải trọng</span>
        
        <input
            type="number"
            value={newDriver.vehicle?.payloadCapacity || ''}
            onChange={(e) => setNewDriver({
                ...newDriver,
                vehicle: { ...newDriver.vehicle, payloadCapacity: Number(e.target.value) }
            })}
            required
        />
    </div>

    <div>
   
            <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Chọn ngày hết hạn kiểm tra</span>
      
        <input
            type="date"
            value={newDriver.vehicle?.inspectionExpiryDate || ''}
            onChange={(e) => setNewDriver({
                ...newDriver,
                vehicle: { ...newDriver.vehicle, inspectionExpiryDate: e.target.value }
            })}
            required
        />
    </div>



    <div>
    <span style={{ color: '#999', display: 'block', textAlign: 'left' }}>Thêm ảnh</span>
        <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
        />
    </div>

    <button type="submit">{isUpdating ? "Cập nhật tài xế" : "Thêm tài xế"}</button>
    {isUpdating && <button type="button" onClick={resetForm}>Hủy</button>}
</form>
        </div>






     

        </div>
    );
};

export default DriverList;
