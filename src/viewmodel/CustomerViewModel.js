// CustomerViewModel.js

import BaseApi_form_data from '../base/BaseApi_form_data';
import baseApi from '/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js';  // Import baseApi

class CustomerViewModel {
    constructor() {
        this.customers = [];
    }

    // Lấy danh sách khách hàng
    async getCustomers(page, limit) {
        try {console.log("Đang gọi");
            
            console.log("page",page);
            console.log("limit",limit);
            
            // Gọi API để lấy danh sách khách hàng với phân trang
            const response = await baseApi.post('/customers/getAllCustomer', {
                page,   // Truyền số trang
                limit   // Truyền số lượng khách hàng mỗi trang
            });
    
            this.customers = response; // Lưu dữ liệu vào biến customers
            
            // Log ra dữ liệu trả về từ API
            console.log('Customers:', this.customers);
    
            return this.customers; // Trả về danh sách khách hàng
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error; // Ném lỗi ra ngoài để xử lý trong component
        }
    }
    
  // Thêm khách hàng mới
  async addCustomers(formData) {
    try {
        // Gọi API để thêm khách hàng mới
        const response = await baseApi.post('/admin/addCustomer', formData);

        // Kiểm tra phản hồi từ API
        if (response.statusCode === 200 && response.data) {
            // Log dữ liệu trả về từ API
            console.log('Customer added successfully:', response.data);
            
            // Cập nhật danh sách khách hàng nếu cần thiết
            this.customers.push(response.data);

            return response.data; // Trả về khách hàng mới thêm vào
        } else {
            console.error('Error adding customer:', response.data);
            throw new Error('Failed to add customer');
        }
    } catch (error) {
         // Kiểm tra nếu mã lỗi là 500
         if (error.statusCode === 500) {
            // Lỗi từ backend về email đã tồn tại
            throw new Error('Email đã được đăng kí');
        }
        console.error('Error adding customer:', error);
        throw error; // Ném lỗi ra ngoài để xử lý trong component
    }
}

async deleteCustomers(customerId) {
    try {
        // Gọi API để xóa khách hàng, gửi customerId trong body của yêu cầu POST
        const response = await baseApi.post('/admin/deleteCustomer', { customerId });

        // Kiểm tra phản hồi từ API
        if (response.statusCode === 200 && response.data) {
            console.log('Customer deleted successfully:', response.data);
            return response.data; 
        } else {
            console.error('Error deleting customer:', response.data);
            throw new Error(response.data?.message || 'Failed to delete customer');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa khách hàng';
        throw new Error(errorMessage); // Ném lỗi ra ngoài để component có thể hiển thị thông báo
    }
}
async updateCustomer(editUser) {
    try {
        console.log("Thông tin khách hàng cần cập nhật:", editUser);
        
        // Tạo đối tượng customerData, đổi _id thành customerId
        const customerData = {
            ...editUser,
            customerId: editUser._id, // Đổi _id thành customerId
        };
        delete customerData._id; // Xóa trường _id khỏi đối tượng trước khi gửi đi

        console.log("customerData",customerData)

        // Gọi API để cập nhật thông tin khách hàng, gửi customerData trong body của yêu cầu PUT
        const response = await baseApi.post('/admin/updateCustomer', customerData);

        // Kiểm tra phản hồi từ API
        if (response.status === 200 ) {
            console.log('Customer updated successfully:', response.data);

            return response.data; // Trả về dữ liệu từ API để dùng trong component nếu cần
        } else {
            console.error('Error updating customer:', response.data);
            throw new Error(response.data?.message || 'Failed to update customer');
        }
    } catch (error) {
        console.error('Error updating customer:', error);

        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khách hàng';
        throw new Error(errorMessage); // Ném lỗi ra ngoài để component có thể hiển thị thông báo
    }
}
// Phương thức cập nhật thông tin khách hàng

  
  async updateImage(formData) {
    try {
      // Log từng phần tử trong formData
      console.log("FormData Content:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      const response = await BaseApi_form_data.post('/customers/upload-image', formData);
  
      if (response.status === 200) {
        // Kiểm tra nếu phản hồi có message và status là thành công
        const { message, filename, path, customer } = response;
    
        if (message === "Image uploaded and link saved successfully") {
            console.log('Image updated successfully:', response);
    
            // Trả về các thông tin bạn cần từ phản hồi
            return {
                filename,
                path,
                customer
            };
        } else {
            throw new Error(message || 'Failed to update image');
        }
    } else {
        throw new Error('Failed to update image');
    }
    
    } catch (error) {
      console.error('Error updating image:', error);
  
      // Log thêm thông tin lỗi nếu cần
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request data:', error.request);
      }
  
      throw error;
    }
  }
  
  







    
}

export default CustomerViewModel;
