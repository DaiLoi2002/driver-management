import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import DriverViewModel from "../../viewmodel/DriverViewModel";
import Truck from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/image/box-truck.png";
import Bed from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/image/bed.png";

const DriverMap = ({ markerPosition }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const markersRef = useRef([]);
  const driverViewModel = new DriverViewModel();

  // Zoom đến vị trí mới khi markerPosition thay đổi
  useEffect(() => {
    if (
      markerPosition &&
      Array.isArray(markerPosition) &&
      markerPosition.length === 2
    ) {
      const [lng, lat] = markerPosition;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 15, // Điều chỉnh độ zoom phù hợp
        essential: true,
      });
      console.log("Zooming to:", markerPosition);
    }
  }, [markerPosition]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGFpbG9pMjAwMiIsImEiOiJjbTI3eHc3aXMxaGZqMmlzZ2thaGcwNHhoIn0.HiDAtPpR-E_tnE3SI58wkQ";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.6297, 10.8231],
      zoom: 12,
    });

    const fetchDriverLocations = async () => {
      try {
        const locations = await driverViewModel.getAllOnlineDriversLocation();
        console.log("LOCATION");
        console.log(locations);

        // Giả sử `locations` là một mảng chứa nhiều đối tượng tài xế
        // Chuyển đổi mảng thành object với ID là key
        const locationsObject = {};
        locations.forEach((driver) => {
          locationsObject[driver._id] = {
            fullName: driver.fullName,
            _id: driver._id,
            coordinates: driver.location.coordinates,
            totalOrders: driver.totalOrders,
            completedOrders: driver.completedOrders,
            cancelledOrders: driver.cancelledOrders,
            status: driver.status,
            image: driver.image,
            isBusy: driver.isBusy,
            cancelRate: driver.cancelRate,
            averageRating: driver.averageRating,
          };
        });
        console.log("Converted locations object:", locationsObject); // Log object đã chuyển đổi
        return locationsObject;
      } catch (error) {
        console.error("Error fetching driver locations:", error);
        return {};
      }
    };

    const loadMarkers = async () => {
      try {
        const driverLocationsResponse = await fetchDriverLocations();

        // Xóa các marker cũ
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Thêm mới markers
        Object.values(driverLocationsResponse).forEach((driver) => {
          const { coordinates } = driver;

          // Kiểm tra tọa độ có hợp lệ không
          if (Array.isArray(coordinates) && coordinates.length === 2) {
            const [lng, lat] = coordinates;

            if (!isNaN(lng) && !isNaN(lat)) {
              const el = document.createElement("div");
              el.className = "custom-marker";
              if (driver.status === "offline") {
                // Nếu tài xế offline, sử dụng hình ảnh khác
                el.style.backgroundImage = `url(${Bed})`; // OfflineTruck là hình ảnh của tài xế offline
              } else {
                // Nếu tài xế online, sử dụng hình ảnh mặc định
                el.style.backgroundImage = `url(${Truck})`;
              }
              el.style.width = "50px";
              el.style.height = "50px";
              el.style.backgroundSize = "contain";
              el.style.backgroundRepeat = "no-repeat";
              el.style.backgroundPosition = "center";

              const marker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(
                  new mapboxgl.Popup().setHTML(
                    `<img src="${
                      driver.image
                    }" alt="Driver Image" style="width: 100%; height: auto;"/>
                     <h3>${driver.fullName}</h3>
                     <h6>ID: ${driver._id}</h6>
                     <h6>Tổng đơn đã nhận: ${driver.totalOrders}</h6>
                     <h6>Số đơn đã hoàn thành: ${driver.completedOrders}</h6>
                     <h6>Số đơn đã huỷ: ${driver.cancelledOrders}</h6>
     <h6>
  Tỉ lệ huỷ đơn: 
  <span style="color: ${
    Math.round(driver.cancelRate * 100) > 20 ? "red" : "green"
  }; font-size: 1.5em;">
    ${Math.round(driver.cancelRate * 100)}%
  </span>
</h6>


                      <h6 style="color: ${
                        driver.status === "offline"
                          ? "red" // Đỏ cho trạng thái offline
                          : driver.isBusy
                          ? "green"
                          : "gray" // Xanh nếu đang nhận đơn, xám nếu chờ đơn
                      };">
     Trạng thái: ${
       driver.status === "offline"
         ? "Đang ngoại tuyến"
         : driver.isBusy
         ? "Đang nhận đơn"
         : "Chờ đơn hàng"
     }
   </h6>
<h6>
  
  <span style="font-size: larger; color: gold;">
    ${"★".repeat(Math.floor(driver.averageRating))}
    ${"☆".repeat(5 - Math.ceil(driver.averageRating))}
  </span>
  (${driver.averageRating.toFixed(1)})
</h6>
     `
                  )
                )

                .addTo(mapRef.current);

              markersRef.current.push(marker); // Lưu lại marker vào mảng
            } else {
              console.error(
                `Invalid coordinates for driver ID: ${driver._id} - (Lng: ${lng}, Lat: ${lat})`
              );
            }
          } else {
            console.error(`Invalid location data for driver ID: ${driver._id}`);
          }
        });
      } catch (error) {
        console.error("Error fetching driver locations:", error);
      }
    };

    const intervalId = setInterval(loadMarkers, 5000); // Gọi loadMarkers mỗi 5 giây

    mapRef.current.on("load", loadMarkers); // Tải lần đầu tiên khi bản đồ được tải

    return () => {
      clearInterval(intervalId); // Dọn dẹp interval khi component unmount
      mapRef.current.remove();
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: "900px" }}></div>;
};

export default DriverMap;
