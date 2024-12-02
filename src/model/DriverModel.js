class Driver {
    constructor(
        id = '',
        fullName = '',
        licenseNumber = '',
        licenseExpiryDate = '',
        phoneNumber = '',
        email = '',
        address = '',
        vehicle = { payloadCapacity: '', inspectionExpiryDate: '' },
        password = '',
        image = '',
        location = { type: 'Point', coordinates: [0, 0] },
        token = '',
        statusAccout = 'active',
        status = 'online',
        socketId = '',
        createdAt = '',
        updatedAt = '',
        v = 0
    ) {
        this.id = id;
    this.fullName = fullName;
    this.licenseNumber = licenseNumber;
    this.licenseExpiryDate = licenseExpiryDate;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.vehicle = vehicle;
    this.password = password;
    this.image = image;
    this.location = location;
    this.token = token;
    this.statusAccout = statusAccout;
    this.status = status;
    this.socketId = socketId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.v = v;
    }

   // Phương thức khởi tạo từ phản hồi API
   static fromApiResponse(apiResponse) {
    // Kiểm tra nếu apiResponse không tồn tại hoặc undefined, trả về một Driver với các thuộc tính rỗng
    if (!apiResponse) {
        return new Driver('', '', '', '', '', '', { payloadCapacity: '', inspectionExpiryDate: '' }, '', '', { type: 'Point', coordinates: [0, 0] }, '', 'active', 'online', '', '', '', 0);
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
        apiResponse.token || '', // Thêm token từ phản hồi
        apiResponse.statusAccout || 'active', // Thêm statusAccout từ phản hồi
        apiResponse.status || 'online', // Thêm status từ phản hồi
        apiResponse.socketId || '', // Thêm socketId từ phản hồi
        apiResponse.createdAt || '', // Thêm createdAt từ phản hồi
        apiResponse.updatedAt || '', // Thêm updatedAt từ phản hồi
        apiResponse.__v || 0 // Thêm __v từ phản hồi
    );
}
}

// Xuất model để sử dụng ở nơi khác
export default Driver;
