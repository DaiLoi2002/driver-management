import React,{useEffect,useState} from 'react';
import DriverViewModel from '../../viewmodel/DriverViewModel';
const ListDriverOnline = ({ onDriverSelect }) => {
    const [drivers, setDrivers] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const driverViewModel = new DriverViewModel();
    const [selectedDriver, setSelectedDriver] = useState(null); 

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const onlineDrivers = await driverViewModel.getAllOnlineDriversLocation(); // Gọi API để lấy danh sách tài xế
                console.log('Online Drivers:', onlineDrivers);
                setDrivers(onlineDrivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        fetchDrivers(); // Gọi hàm để lấy tài xế khi component được mount
    }, []); // Chỉ chạy khi component được mount

    const handleDriverClick = (driver) => {

         console.log('Driver location clicked:', driver.location.coordinates); // Log thông tin tài xế
        // Gọi hàm khi tài xế được chọn, có thể là để đánh dấu lên bản đồ
        setSelectedDriver(driver._id); // Cập nhật tài xế đã chọn
        onDriverSelect(driver.location.coordinates);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Danh sách Tài xế Online</h2>
            <ul style={styles.list}>
                {drivers.map(driver => (

                    <li
                        key={driver._id}
                        style={{...styles.listItem,
                            backgroundColor: 
                            selectedDriver === driver._id
                                ? '#d0e8ff' // Màu nền khi được chọn
                                : hoveredItem === driver._id 
                                ? '#f0f0f0' // Màu nền khi hover
                                : 'transparent', 

                        }}
                        
                        onClick={() => handleDriverClick(driver)}
                        onMouseEnter={() => setHoveredItem(driver._id)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                       
                        
                        {driver.fullName}
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

const styles = {
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Màu nền nhẹ để nhìn thấy bản đồ bên dưới
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column', // Căn giữa chiều dọc
        alignItems: 'flex-end', // Căn phải chiều ngang
        justifyContent: 'center', // Căn giữa chiều dọc
        height: '20%', // Đảm bảo container có chiều cao đầy đủ
        width: '400px', // Đặt chiều rộng cho container (có thể thay đổi)
        position: 'relative', // Để căn giữa chính xác
        zIndex: 1, // Để đảm bảo nó nằm trên DriverMap
    },
    title: {
        margin: '0 0 10px 0',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
        width: '100%', // Đảm bảo các item chiếm chiều rộng đầy đủ
    },
};

export default ListDriverOnline;
