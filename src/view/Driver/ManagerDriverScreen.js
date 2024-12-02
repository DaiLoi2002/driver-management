import React, { useState } from 'react';
import '../Driver/ManagerDriverScreen.css'; // Import tệp CSS
import DriverMap from './DriverMap';

import ListDriverOnline from '/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Driver/ListDriverOnline.js';
import DriverList from './DriverList';



const ManagerDriverScreen = () => {
  const [activeTab, setActiveTab] = useState('drivers');
 

  const renderContent = () => {
    switch (activeTab) {
      case 'drivers':
        return <DriverList />;
      case 'statistics':
        return <DriverStatistics />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
     
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('drivers')}>Danh sách tài xế</button>
        <button onClick={() => setActiveTab('statistics')}>Theo dõi tài xế</button>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};



const DriverStatistics = () => {
    const [markerPosition, setMarkerPosition] = useState(null);
  
    const handleDriverSelect = (position) => {
        
      setMarkerPosition(position);
    };
  
    return (
      <div style={{ position: 'relative', height: '100vh' }}>
        <div style={{ width: '100%', height: '100%' }}>
            
          <DriverMap markerPosition={markerPosition} />
        </div>
        
        <div style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '400px',
            padding: '20px',
        }}>
           
            <ListDriverOnline onDriverSelect={handleDriverSelect} />
        </div>

      </div>
    );
  };

export default ManagerDriverScreen;
