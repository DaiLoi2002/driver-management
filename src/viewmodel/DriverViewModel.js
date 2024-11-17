// DriverViewModel.js

import BaseApi from '../base/BaseApi';


// DriverViewModel.js
class DriverViewModel {
    constructor() {
        this.drivers = [];
    }

    async addDriver(driverData) {
        try {
            const newDriver = await BaseApi.post('/admin/register-driver', driverData);
            this.drivers.push(newDriver);
            return newDriver; // Trả về dữ liệu tài xế đã thêm
        } catch (error) {
            console.error('Error adding driver:', error);
            throw error; // Ném lỗi lên để xử lý trong component
        }
    }

    async getDrivers() {
        try {
            this.drivers = await BaseApi.post('/admin/getAllDrivers');
            return this.drivers;
        } catch (error) {
            console.error('Error fetching drivers:', error);
            throw error; // Ném lỗi lên để xử lý trong component
        }
    }

    async removeDriver(id) {
        try {
            // Gọi API để xóa tài xế
            const response = await BaseApi.post(`/admin/delete/${id}`);
    
            // Kiểm tra mã trạng thái để xác nhận xóa thành công
            if (response.statusCode === 200) {
                // Cập nhật danh sách tài xế trong trạng thái
                this.drivers = this.drivers.filter(driver => driver.id !== id);
                return { statusCode: 200, message: 'Xóa tài xế thành công.' }; // Trả về thông báo thành công
            } else {
                // Ném lỗi nếu mã trạng thái không phải 200
                throw new Error(response.message || 'Không có thông điệp lỗi');
            }
        } catch (error) {
            // Kiểm tra loại lỗi và ném ra thông điệp cụ thể
            if (error.response) {
                // Nếu có phản hồi từ server
                if (error.response.status === 404) {
                    throw new Error('Tài xế không tồn tại.'); // Lỗi không tìm thấy
                } else if (error.response.status === 500) {
                    throw new Error('Lỗi server. Vui lòng thử lại sau.'); // Lỗi server
                } else {
                    throw new Error('Đã xảy ra lỗi không xác định.'); // Lỗi không xác định
                }
            } else if (error.request) {
                // Nếu không có phản hồi từ server
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'); // Lỗi kết nối
            } else {
                // Nếu có lỗi khác
                throw new Error('Đã xảy ra lỗi: ' + error.message); // Lỗi khác
            }
        }
    }
       // Hàm sửa tài xế
async updateDriver(driver) {
    try {
        // Gửi dữ liệu tài xế dưới dạng body của yêu cầu POST
        const response = await BaseApi.post('admin/update-driver', {
            id: driver.id,
            fullName: driver.fullName,
            licenseNumber: driver.licenseNumber,
            licenseExpiryDate: driver.licenseExpiryDate,
            phoneNumber: driver.phoneNumber,
            email: driver.email,
            address: driver.address,
            vehicle: {
                payloadCapacity: driver.vehicle.payloadCapacity,
                inspectionExpiryDate: driver.vehicle.inspectionExpiryDate
            },
            password: driver.password,
            image: driver.image,
            location: {
                type: driver.location.type,
                coordinates: driver.location.coordinates
            },
            token: driver.token
        });
        return response;
    } catch (error) {
        console.error('Error updating driver:', error);
        throw error;
    }
}

    async getAllOnlineDriversLocation() {
        try {
            const response = await BaseApi.post('admin/getAllOnlineDriversLocation'); // Đảm bảo endpoint đúng
            // Kiểm tra mã trạng thái và trả về dữ liệu
            if (response.statusCode === 200) {
                console.log("Driver locations data:", response.data); // Log dữ liệu trước khi trả về
                return response.data; // Trả về danh sách vị trí tài xế
            }
             else {
                throw new Error('Không thể lấy dữ liệu tài xế.');
            }
        } catch (error) {
            console.error('Error fetching online drivers locations:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    }
    

    
    
    
}

export default DriverViewModel; // Xuất mặc định

 