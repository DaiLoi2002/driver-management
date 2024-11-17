class Driver {
    constructor(
        id,
        fullName,
        licenseNumber,
        licenseExpiryDate,
        phoneNumber,
        email,
        address,
        vehicle,
        password,
        image,
        location, // Thêm trường location
        token // Thêm trường token
    ) {
        this.id = id || ''; // Đảm bảo trường này được thiết lập
        this.fullName = fullName || '';  // Giá trị mặc định nếu thiếu
        this.licenseNumber = licenseNumber || '';
        this.licenseExpiryDate = licenseExpiryDate || '';
        this.phoneNumber = phoneNumber || '';
        this.email = email || '';
        this.address = address || '';
        
        this.vehicle = vehicle ? {
            payloadCapacity: vehicle.payloadCapacity || '',
            inspectionExpiryDate: vehicle.inspectionExpiryDate || ''
        } : { payloadCapacity: '', inspectionExpiryDate: '' };
        
        this.password = password || '';
        this.image = image || '';  // Có thể là base64 hoặc URL hình ảnh

        // Thêm các trường location và token
        this.location = location || { type: 'Point', coordinates: [0, 0] };
        this.token = token || '';
    }

   // Phương thức khởi tạo từ phản hồi API
   static fromApiResponse(apiResponse) {
    // Kiểm tra nếu apiResponse không tồn tại hoặc undefined, trả về một Driver với các thuộc tính rỗng
    if (!apiResponse) {
        return new Driver('', '', '', '', '', '', { payloadCapacity: '', inspectionExpiryDate: '' }, '', '', { type: 'Point', coordinates: [0, 0] }, '');
    }

    const vehicle = apiResponse.vehicle ? {
        payloadCapacity: apiResponse.vehicle.payloadCapacity || '',
        inspectionExpiryDate: apiResponse.vehicle.inspectionExpiryDate || ''
    } : { payloadCapacity: '', inspectionExpiryDate: '' };

    return new Driver(
        apiResponse._id || '',  // Lấy id từ apiResponse
        apiResponse.fullName || '',
        apiResponse.licenseNumber || '',
        apiResponse.licenseExpiryDate || '',
        apiResponse.phoneNumber || '',
        apiResponse.email || '',
        apiResponse.address || '',
        vehicle,
        apiResponse.password || '',
        apiResponse.image || '',
        apiResponse.location || { type: 'Point', coordinates: [0, 0] }, // Thêm location từ phản hồi
        apiResponse.token || '' // Thêm token từ phản hồi
    );
}






}

// Xuất model để sử dụng ở nơi khác
export default Driver;
