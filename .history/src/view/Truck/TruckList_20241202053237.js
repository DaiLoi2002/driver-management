import React, { useEffect, useState } from "react";
import TruckViewModel from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/viewmodel/TruckViewModel.js"; // Đảm bảo rằng đường dẫn là chính xác
import "/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Truck/TruckItem.css";
import Truck from "../../model/Truck";

const emptyTruck = new Truck();

const TruckList = () => {
  const [truckData, setTruckData] = useState([]);
  const [error, setError] = useState(null);

  const [isUpdating, setIsUpdating] = useState(false); // Kiểm tra trạng thái cập nhật
  const [updateTruckId, setUpdateTruckId] = useState(null); // Lưu ID của xe đang được cập nhật
  const [newTruck, setNewTruck] = useState(emptyTruck);

  const truckViewModel = new TruckViewModel();

  const [serviceSupport, setServiceSupport] = useState([
    {
      serviceId: "support_001",
      name: "Dịch vụ bốc xếp",
      price: 360.0,
      priceString: "₫360.000",
      percent: 0,
      selected: false,
    },
    {
      serviceId: "support_002",
      name: "Giao hàng 2 chiều",
      price: 360.0,
      priceString: "+70%",
      percent: 70,
      selected: false,
    },
    {
      serviceId: "support_003",
      name: "Thùng mở / kín",
      price: 360.0,
      priceString: "+10%",
      percent: 10,
      selected: false,
    },
    {
      serviceId: "support_004",
      name: "Hỗ trợ phí cầu đường",
      price: 360.0,
      priceString: "+10%",
      percent: 10,
      selected: false,
    },
  ]);

  const [boxState, setBoxState] = useState([
    {
      Id: "box_001",
      name: "Thùng Mở",
      percent: 10,
      pricePercent: "10%",
      selected: false,
    },
    {
      Id: "box_002",
      name: "Thùng Kín",
      percent: 10,
      pricePercent: "10%",
      selected: false,
    },
  ]);

  const [detailsUnloading, setDetailsUnloading] = useState([
    {
      Id: "unloading_001",
      name: "Bốc xếp Tận Nơi (Bởi tài xế)",
      price: 360000,
      priceString: "₫360.000",
      selected: false,
    },
    {
      Id: "unloading_002",
      name: "Bốc xếp Đuôi Xe (Có Người Hỗ Trợ)",
      price: 530000,
      priceString: "₫530.000",
      selected: false,
    },
    {
      Id: "unloading_003",
      name: "Bốc xếp Tận Nơi (Có Người Hỗ Trợ)",
      price: 580000,
      priceString: "₫580.000",
      selected: false,
    },
  ]);

  const fetchTrucks = async () => {
    try {
      const trucks = await truckViewModel.getTrucks();
      console.log("Truck response: ", trucks); // In ra danh sách xe tải để kiểm tra dữ liệu

      if (trucks && trucks.length > 0) {
        const truck = trucks[0]; // Giả sử bạn muốn lấy thông tin từ xe tải đầu tiên

        setNewTruck((prevTruck) => ({
          ...prevTruck,
          id: truck._id,
          name: truck.name,
          type: truck.type,
          box: prevTruck.box.map((boxItem) => ({
            ...boxItem,
            checked: truck.box.some((b) => b.id === boxItem.id && b.checked),
          })),
          serviceSupport: prevTruck.serviceSupport.map((serviceItem) => ({
            ...serviceItem,
            checked: truck.serviceSupport.some(
              (s) => s.serviceId === serviceItem.serviceId && s.checked
            ),
          })),
        }));
      }
      // Log sau khi cập nhật state
      console.log("Dữ liệu xe tải đã được cập nhật:", trucks);
      setTruckData(trucks);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu xe tải.", err);
      setError("Không thể tải dữ liệu xe tải."); // Cập nhật state lỗi
    }
  };

  useEffect(() => {}, [boxState, serviceSupport]); // Sẽ chạy khi boxState hoặc serviceSupport thay đổi

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Chuyển đổi giá trị thành số (nếu là số hợp lệ) trước khi cập nhật trạng thái
    const updatedValue =
      name === "superSpeedFare" || name === "minFare" ? Number(value) : value;

    setNewTruck((prevNewTruck) => {
      const updatedTruck = {
        ...prevNewTruck,
        [name]: updatedValue, // Cập nhật giá trị mới vào newTruck
      };

      // Nếu thay đổi minFare, cập nhật minFareString
      if (name === "minFare") {
        updatedTruck.minFareString = `${updatedValue} đ`; // Định dạng minFareString
      }
      if (name === "superSpeedFare") {
        updatedTruck.superSpeedFareString = `${updatedValue} đ`; // Định dạng minFareString
      }

      return updatedTruck;
    });
  };

  const handleNestedChange = (field, range, updatedFare) => {
    setNewTruck((prevNewTruck) => {
      // Kiểm tra xem nếu field là 'additionalFare'
      if (field === "additionalFare") {
        // Tạo một bản sao của mảng additionalFare
        const updatedAdditionalFare = [...prevNewTruck.additionalFare];

        // Cập nhật phần tử tại chỉ mục range
        updatedAdditionalFare[range] = {
          ...updatedAdditionalFare[range],
          ...updatedFare,
          rateString: `${updatedFare.rate} đ`, // Cập nhật rateString nếu rate thay đổi
        };

        return {
          ...prevNewTruck,
          additionalFare: updatedAdditionalFare, // Cập nhật lại mảng additionalFare
        };
      }

      const updatedField = {
        ...prevNewTruck[field],
        [range]: updatedFare,
      };

      // Kiểm tra các trường hợp cụ thể như dimensions, prohibitedHours, maxCapacity, minFare
      if (
        field === "dimensions" &&
        ["length", "width", "height"].includes(range)
      ) {
        updatedField.title = `${updatedField.length} x ${updatedField.width} x ${updatedField.height} Mét`;
      }

      if (
        field === "prohibitedHours" &&
        ["morning", "afternoon"].includes(range)
      ) {
        updatedField.title = `Giờ cấm tải: ${updatedField.morning} & ${updatedField.afternoon}`;
      }

      if (field === "maxCapacity" && ["weight", "CBM"].includes(range)) {
        updatedField.title = `Chở tối đa: ${updatedField.weight}kg & ${updatedField.CBM}CBM`;
      }

      // Cập nhật minFare và minFareString
      if (field === "minFare") {
        const updatedMinFareString = `${updatedFare} đ`;
        return {
          ...prevNewTruck,
          minFare: updatedFare,
          minFareString: updatedMinFareString,
        };
      }

      return {
        ...prevNewTruck,
        [field]: updatedField,
      };
    });
  };

  const handleDeleteTruck = async (truckId) => {
    try {
      const response = await truckViewModel.removeTruck(truckId);

      if (response.statusCode === 200) {
        // Refresh truck data by calling fetchTrucks
        setTruckData((prevTruckData) => ({
          ...prevTruckData,
          data: prevTruckData.data.filter((truck) => truck.id !== truckId),
        }));
        alert("Xe tải đã được xóa thành công!");
        fetchTrucks();
      } else {
        console.error("Lỗi khi xóa xe tải");
      }
    } catch (err) {
      console.error("Lỗi khi xóa xe tải:", err);
      setError(err.message || "Đã xảy ra lỗi khi xóa xe tải.");
    }
  };
  const handleUpdateTruck = (truckId) => {
    const truckToUpdate = truckData.data.find((truck) => truck.id === truckId);

    if (truckToUpdate) {
      // Đặt lại selected: false cho tất cả các box
      const resetBoxState = boxState.map((box) => ({
        ...box,
        selected: false,
      }));

      // Đặt lại selected: false cho tất cả các dịch vụ
      const resetServiceSupport = serviceSupport.map((service) => ({
        ...service,
        selected: false,
      }));

      // Đặt lại selected: false cho tất cả các unloading
      const resetDetailsUnloading = detailsUnloading.map((unloading) => ({
        ...unloading,
        selected: false,
      }));

      // So sánh và cập nhật selected trong serviceSupport
      const updatedServiceSupport = resetServiceSupport.map((service) => {
        const matchingService = truckToUpdate?.serviceSupport.find(
          (updateService) =>
            updateService.serviceId === service.serviceId &&
            updateService.name === service.name
        );

        return matchingService ? { ...service, selected: true } : service;
      });

      // So sánh và cập nhật selected trong boxState
      const updatedBoxState = resetBoxState.map((box) => {
        const matchingBox = truckToUpdate?.box?.find(
          (boxItem) => boxItem.Id === box.Id && boxItem.name === box.name
        );

        return matchingBox ? { ...box, selected: true } : box;
      });

      // So sánh và cập nhật selected trong detailsUnloading
      const updatedDetailsUnloading = resetDetailsUnloading.map((unloading) => {
        const matchingUnloading = truckToUpdate?.detailsUnloading?.find(
          (unloadingItem) =>
            unloadingItem.Id === unloading.Id &&
            unloadingItem.name === unloading.name
        );

        return matchingUnloading ? { ...unloading, selected: true } : unloading;
      });

      // Cập nhật lại state
      setServiceSupport(updatedServiceSupport);
      setBoxState(updatedBoxState);
      setDetailsUnloading(updatedDetailsUnloading); // Thêm cập nhật detailsUnloading

      setNewTruck({
        id: truckToUpdate.id || "",
        name: truckToUpdate.name || "",
        type: truckToUpdate.type || "",
        image: truckToUpdate.image || "",
        dimensions: {
          title: truckToUpdate.dimensions?.title || "",
          length: truckToUpdate.dimensions?.length || 0,
          width: truckToUpdate.dimensions?.width || 0,
          height: truckToUpdate.dimensions?.height || 0,
        },
        prohibitedHours: {
          title: truckToUpdate.prohibitedHours?.title || "",
          morning: truckToUpdate.prohibitedHours?.morning || "",
          afternoon: truckToUpdate.prohibitedHours?.afternoon || "",
        },
        maxCapacity: {
          title: truckToUpdate.maxCapacity?.title || "",
          weight: truckToUpdate.maxCapacity?.weight || 0,
          CBM: truckToUpdate.maxCapacity?.CBM || 0,
        },
        superSpeedFare: truckToUpdate.superSpeedFare || 0,
        superSpeedFareString: truckToUpdate.superSpeedFareString || "",
        minFare: truckToUpdate.minFare || 0,
        minFareString: truckToUpdate.minFareString || "",
        additionalFare: truckToUpdate.additionalFare || [],
        serviceSupport: updatedServiceSupport,
        detailsUnloading: updatedDetailsUnloading, // Cập nhật detailsUnloading
        box: updatedBoxState,
      });

      setIsUpdating(true); // Chế độ cập nhật
      setUpdateTruckId(truckId); // Lưu ID của xe tải đang được cập nhật

      console.log("serviceSupport sau khi cập nhật:", updatedServiceSupport);
      console.log("boxState:", updatedBoxState);
      console.log(
        "detailsUnloading sau khi cập nhật:",
        updatedDetailsUnloading
      );
    }
  };

  const handleCheckboxServiceChange = (serviceId) => {
    // // Cập nhật trạng thái selected trong serviceSupport
    setServiceSupport((prevServices) =>
      prevServices.map((service) =>
        service.serviceId === serviceId
          ? { ...service, selected: !service.selected }
          : service
      )
    );

    // Cập nhật newTruck với các dịch vụ đã chọn
    setNewTruck((prevNewTruck) => {
      const selectedService = serviceSupport.find(
        (service) => service.serviceId === serviceId
      );

      if (selectedService && selectedService.serviceId) {
        const isSelected = !selectedService.selected;
        const updatedServiceSupport = isSelected
          ? [...(prevNewTruck.serviceSupport || []), selectedService] // Thêm dịch vụ nếu được chọn
          : (prevNewTruck.serviceSupport || []).filter(
              (service) => service.serviceId !== serviceId
            ); // Xóa dịch vụ nếu bỏ chọn

        return {
          ...prevNewTruck,
          serviceSupport: updatedServiceSupport,
        };
      }
      return prevNewTruck;
    });
  };
  const handleBoxCheckboxChange = (boxId) => {
    // Cập nhật trạng thái selected trong boxState
    setBoxState((prevBoxState) =>
      prevBoxState.map((box) =>
        box.Id === boxId
          ? { ...box, selected: !box.selected } // Đảo trạng thái selected
          : box
      )
    );

    // Cập nhật newTruck với các thùng đã chọn
    setNewTruck((prevNewTruck) => {
      const selectedBox = boxState.find((box) => box.Id === boxId); // Tìm box đã chọn

      if (selectedBox && selectedBox.Id) {
        const isSelected = !selectedBox.selected;
        const updatedBoxState = isSelected
          ? [...(prevNewTruck.box || []), selectedBox] // Thêm box vào danh sách đã chọn
          : (prevNewTruck.box || []).filter((box) => box.Id !== boxId); // Xóa box khỏi danh sách nếu bỏ chọn

        return {
          ...prevNewTruck,
          box: updatedBoxState,
        };
      }

      return prevNewTruck;
    });
  };

  const handleDetailUnloadingCheckboxChange = (id) => {
    // Cập nhật lại trạng thái của unloading trong detailsUnloading
    setDetailsUnloading((prevDetailsUnloading) => {
      const updatedDetails = prevDetailsUnloading.map((unloading) =>
        unloading.Id === id
          ? { ...unloading, selected: !unloading.selected } // Đổi trạng thái selected
          : unloading
      );

      // Cập nhật newTruck với các unloading đã chọn
      const selectedUnloading = updatedDetails.filter(
        (unloading) => unloading.selected
      );
      setNewTruck((prevNewTruck) => ({
        ...prevNewTruck,
        detailsUnloading: selectedUnloading, // Chỉ giữ các unloading đã chọn
      }));

      return updatedDetails; // Trả về danh sách updatedDetails để cập nhật trạng thái
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdating) {
      try {
        console.log("Dữ liệu xe tải trước khi cập nhật:", newTruck); // Log dữ liệu của xe tải trước khi cập nhật

        // Gọi API để cập nhật xe tải
        const updatedTruck = await truckViewModel.updateTruck(newTruck);

        // Log dữ liệu đã được cập nhật từ API
        console.log("Dữ liệu xe tải đã cập nhật từ API:", updatedTruck);

        // Cập nhật lại dữ liệu trong state
        setTruckData((prevTruckData) => {
          // Log dữ liệu cũ của xe tải trước khi cập nhật state
          console.log("Dữ liệu xe tải cũ trong state:", prevTruckData.data);

          const updatedData = prevTruckData.data.map((truck) =>
            truck.id === updateTruckId ? { ...truck, ...newTruck } : truck
          );

          // Log dữ liệu sau khi cập nhật state
          console.log("Dữ liệu xe tải sau khi cập nhật state:", updatedData);

          return {
            ...prevTruckData,
            data: updatedData,
          };
        });

        setIsUpdating(false); // Thoát chế độ cập nhật
        setUpdateTruckId(null); // Xóa ID của xe tải đang được cập nhật
        alert("Cập nhật xe tải thành công!");
      } catch (err) {
        setError("Lỗi khi cập nhật xe tải.");
        console.error("Lỗi khi cập nhật xe tải:", err); // Log lỗi nếu có
      }
    } else {
      try {
        console.log("Dữ liệu xe tải sẽ được thêm vào:", newTruck);
        // Gọi API để thêm xe tải mới
        const newTruckResponse = await truckViewModel.addTruck(newTruck);

        // Cập nhật lại dữ liệu trong state
        setTruckData((prevTruckData) => ({
          ...prevTruckData,
          data: [...prevTruckData.data, newTruckResponse], // Thêm xe tải mới vào danh sách
        }));

        alert("Xe tải mới đã được thêm!");
        fetchTrucks();
      } catch (err) {
        setError("Lỗi khi thêm xe tải.");
        console.error("Lỗi khi thêm xe tải:", err);
      }
    }

    // Reset form sau khi lưu
    setNewTruck({
      name: "",
      type: "",
      image: "",
      dimensions: {
        title: "",
        length: 0,
        width: 0,
        height: 0,
      },
      prohibitedHours: {
        title: "",
        morning: "",
        afternoon: "",
      },
      maxCapacity: {
        title: "",
        weight: 0,
        CBM: 0,
      },
      superSpeedFare: 0,
      superSpeedFareString: "",
      minFare: 0,
      minFareString: "",
      additionalFare: [
        { minRange: 4, maxRange: 10, rate: "", rateString: " " },
        { minRange: 10, maxRange: 30, rate: "", rateString: " " },
        { minRange: 30, maxRange: 50, rate: "", rateString: " " },
        { minRange: 50, maxRange: 100, rate: "", rateString: " " },
        { minRange: 100, maxRange: 9999, rate: "", rateString: " " },
      ],
      serviceSupport: [],
      detailsUnloading: [],
      box: [],
    });
    // Đặt lại `selected` cho tất cả dịch vụ và thùng
    setServiceSupport(
      serviceSupport.map((service) => ({
        ...service,
        selected: false, // Đặt lại selected: false cho tất cả dịch vụ
      }))
    );

    setBoxState(
      boxState.map((box) => ({
        ...box,
        selected: false, // Đặt lại selected: false cho tất cả thùng
      }))
    );

    setDetailsUnloading(
      detailsUnloading.map((unloading) => ({
        ...unloading,
        selected: false, // Đặt lại selected: false cho tất cả unloading
      }))
    );
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Danh sách xe tải:</h2>
      {truckData && truckData.data && truckData.data.length > 0 ? (
        truckData.data.map((truck) => (
          <TruckItem
            key={truck.id}
            truck={truck}
            handleDeleteTruck={handleDeleteTruck}
            handleUpdateTruck={handleUpdateTruck}
          />
        ))
      ) : (
        <p>Không có dữ liệu xe tải.</p>
      )}

      <h3>{isUpdating ? "Cập nhật xe tải" : "Thêm xe tải mới"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center" }}>
          <img src={newTruck.image} width={400} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ flex: "0 0 48%", textAlign: "left" }}>
            <h4>Thông tin:</h4>
            <span style={{ display: "inline-block", textAlign: "left" }}>
              Tên xe
            </span>
            <input
              type="text"
              name="name"
              value={newTruck.name}
              onChange={handleInputChange}
              required
            />

            <span style={{ display: "inline-block", textAlign: "left" }}>
              Loại xe
            </span>
            <input
              type="text"
              name="type"
              value={newTruck.type}
              onChange={handleInputChange}
              required
            />

            <span style={{ display: "inline-block", textAlign: "left" }}>
              URL Ảnh
            </span>
            <input
              type="text"
              name="image"
              value={newTruck.image}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ flex: "0 0 48%", textAlign: "left" }}>
            <h4>Kích thước:</h4>

            <span style={{ display: "inline-block", textAlign: "left" }}>
              Chiều dài (m)
            </span>
            <input
              type="number"
              name="length"
              value={newTruck.dimensions.length}
              onChange={(e) =>
                handleNestedChange("dimensions", "length", e.target.value)
              }
              placeholder=""
            />
            <span style={{ display: "inline-block", textAlign: "left" }}>
              Chiều rộng (m)
            </span>

            <input
              type="number"
              name="width"
              value={newTruck.dimensions.width}
              onChange={(e) =>
                handleNestedChange("dimensions", "width", e.target.value)
              }
              placeholder=""
            />
            <span style={{ display: "inline-block", textAlign: "left" }}>
              Chiều cao (m)
            </span>
            <input
              type="number"
              name="height"
              value={newTruck.dimensions.height}
              onChange={(e) =>
                handleNestedChange("dimensions", "height", e.target.value)
              }
              placeholder=""
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ flex: "0 0 48%", textAlign: "left" }}>
            <h4>Sức chứa tối đa:</h4>
            <span style={{ display: "inline-block", textAlign: "left" }}>
              Khối lượng (kg)
            </span>
            <input
              type="number"
              name="weight"
              value={newTruck.maxCapacity.weight}
              onChange={(e) =>
                handleNestedChange("maxCapacity", "weight", e.target.value)
              }
              placeholder=""
            />

            <span style={{ display: "inline-block", textAlign: "left" }}>
              Dung tích (CBM)
            </span>

            <input
              type="number"
              name="volume"
              value={newTruck.maxCapacity.CBM}
              onChange={(e) =>
                handleNestedChange("maxCapacity", "CBM", e.target.value)
              }
              placeholder=""
            />
          </div>
          <div style={{ flex: "0 0 48%", textAlign: "left" }}>
            <h4>Giờ cấm:</h4>
            <span style={{ display: "inline-block", textAlign: "left" }}>
              Sáng
            </span>
            <input
              type="text"
              name="morning"
              value={newTruck.prohibitedHours.morning}
              onChange={(e) =>
                handleNestedChange("prohibitedHours", "morning", e.target.value)
              }
              placeholder=""
            />
            <span style={{ display: "inline-block", textAlign: "left" }}>
              Chiều
            </span>
            <input
              type="text"
              name="afternoon"
              value={newTruck.prohibitedHours.afternoon}
              onChange={(e) =>
                handleNestedChange(
                  "prohibitedHours",
                  "afternoon",
                  e.target.value
                )
              }
              placeholder=""
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ flex: "0 0 48%", textAlign: "left" }}>
            <h4>Chi tiết giá:</h4>

            <span style={{ display: "inline-block", textAlign: "left" }}>
              Giá cước nhanh:
            </span>
            <input
              type="number"
              name="superSpeedFare"
              value={newTruck.superSpeedFare}
              onChange={handleInputChange}
              required
            />

            <span style={{ display: "inline-block", textAlign: "left" }}>
              Cước tối thiểu (VND)
            </span>
            <input
              type="number"
              name="minFare"
              value={newTruck.minFare}
              onChange={handleInputChange}
              placeholder=""
              required
            />
          </div>
        </div>

        <div>
          <h4>Phí bổ sung:</h4>
          {newTruck.additionalFare.map((fare, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "230px",
                  textAlign: "left",
                  marginBottom: "5px",
                }}
              >
                Phí bổ sung ({fare.minRange}-{fare.maxRange} km)
              </span>

              <input
                type="text"
                placeholder={`Phí bổ sung (${fare.minRange}-${fare.maxRange} km)`}
                // Thay value bằng fare.rate thay vì fare.rateString
                value={fare.rate}
                onChange={(e) =>
                  handleNestedChange("additionalFare", index, {
                    rate: parseInt(e.target.value, 10), // Cập nhật giá trị rate thành số nguyên
                  })
                }
                style={{ width: "100%", padding: "10px", fontSize: "16px" }}
              />
            </div>
          ))}
        </div>

        <div>
          <h4>Dịch vụ hỗ trợ:</h4>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {serviceSupport.map((service) => (
                <div
                  key={service.serviceId}
                  style={{
                    flex: "1 1 200px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                  }}
                >
                  <input
                    type="checkbox"
                    id={`service-${service.serviceId}`}
                    checked={service.selected} // Checkbox sẽ được đánh dấu nếu service.selected là true
                    onChange={() =>
                      handleCheckboxServiceChange(service.serviceId)
                    } // Gọi hàm khi nhấn checkbox
                  />
                  <label
                    htmlFor={`service-${service.serviceId}`}
                    style={{ marginLeft: "10px" }}
                  >
                    {service.name}
                  </label>

                  <div style={{ marginTop: "5px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "200px",
                        textAlign: "left",
                      }}
                    >
                      Giá: {service.priceString}
                    </span>
                  </div>

                  <div style={{ marginTop: "5px" }}>
                    {service.percent !== 0 && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "200px",
                          textAlign: "left",
                        }}
                      >
                        Phần trăm: {service.percent}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h4>Thùng xe:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {boxState.map((box) => (
              <div
                key={box.Id}
                style={{
                  flex: "1 1 200px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`service-${box.Id}`}
                  checked={box.selected}
                  onChange={() => handleBoxCheckboxChange(box.Id)}
                />
                <label
                  htmlFor={`service-${box.Id}`}
                  style={{ marginLeft: "10px" }}
                >
                  {box.name}
                </label>

                <div style={{ marginTop: "5px" }}>
                  {box.percent !== 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "200px",
                        textAlign: "left",
                      }}
                    >
                      Phần trăm: {box.percent}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h4>Hổ trợ dỡ hàng:</h4>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {detailsUnloading.map((unloading) => (
            <div
              key={unloading.Id}
              style={{
                flex: "1 1 200px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            >
              <input
                type="checkbox"
                id={`unloading-${unloading.Id}`}
                onChange={() =>
                  handleDetailUnloadingCheckboxChange(unloading.Id)
                }
                checked={unloading.selected}
              />
              <label
                htmlFor={`unloading-${unloading.Id}`}
                style={{ marginLeft: "10px" }}
              >
                {unloading.name}
              </label>
              <div style={{ marginTop: "5px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "200px",
                    textAlign: "left",
                  }}
                >
                  Giá: {unloading.priceString}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button type="submit">{isUpdating ? "Cập nhật xe" : "Thêm xe"}</button>

        {isUpdating && (
          <button
            type="button"
            onClick={() => {
              setIsUpdating(false); // Thoát chế độ cập nhật
              setUpdateTruckId(null); // Xóa ID của xe tải đang được cập nhật
              setNewTruck({
                name: "",
                type: "",
                image: "",
                dimensions: {
                  title: "",
                  length: 0,
                  width: 0,
                  height: 0,
                },
                prohibitedHours: {
                  title: "",
                  morning: "",
                  afternoon: "",
                },
                maxCapacity: {
                  title: "",
                  weight: 0,
                  CBM: 0,
                },
                superSpeedFare: 0,
                superSpeedFareString: "",
                minFare: 0,
                minFareString: "",
                additionalFare: [
                  { minRange: 4, maxRange: 10, rate: "", rateString: " " },
                  { minRange: 10, maxRange: 30, rate: "", rateString: " " },
                  { minRange: 30, maxRange: 50, rate: "", rateString: " " },
                  { minRange: 50, maxRange: 100, rate: "", rateString: " " },
                  { minRange: 100, maxRange: 9999, rate: "", rateString: " " },
                ],

                detailsUnloading: [],
              }); // Xóa dữ liệu xe tải trong form

              // Đặt lại `selected` cho tất cả dịch vụ và thùng
              setServiceSupport(
                serviceSupport.map((service) => ({
                  ...service,
                  selected: false, // Đặt lại selected: false cho tất cả dịch vụ
                }))
              );

              setBoxState(
                boxState.map((box) => ({
                  ...box,
                  selected: false, // Đặt lại selected: false cho tất cả thùng
                }))
              );

              setDetailsUnloading(
                detailsUnloading.map((unloading) => ({
                  ...unloading,
                  selected: false, // Đặt lại selected: false cho tất cả unloading
                }))
              );
            }}
          >
            Huỷ
          </button>
        )}
      </form>

      <div></div>
    </div>
  );
};

const TruckItem = ({ truck, handleDeleteTruck, handleUpdateTruck }) => {
  return (
    <div className="truck-item">
      <div className="truck-info">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "20px",
          }}
        >
          <h3 className="truck-name">{truck?.name}</h3>
          <div className="truck-details">
            <p>
              <strong>Loại xe:</strong> {truck?.type || "N/A"}
            </p>
            <p>
              <strong>Kích thước:</strong>
              {truck?.dimensions?.length
                ? `${truck.dimensions.length}m x ${truck.dimensions.width}m x ${truck.dimensions.height}m`
                : "Thông tin không có"}
            </p>
            <p>
              <strong>Tải trọng tối đa:</strong>
              {truck?.maxCapacity?.weight
                ? `${truck.maxCapacity.weight} kg, ${truck.maxCapacity.CBM} CBM`
                : "Thông tin không có"}
            </p>
            <p>
              <strong>Giờ cấm:</strong>
              {truck?.prohibitedHours?.morning &&
              truck?.prohibitedHours?.afternoon
                ? `${truck.prohibitedHours.morning} / ${truck.prohibitedHours.afternoon}`
                : "Thông tin không có"}
            </p>
            <p>
              <strong>Giá cước nhanh:</strong>{" "}
              {truck?.superSpeedFareString || "Thông tin không có"}
            </p>
            <p>
              <strong>Giá cước tối thiểu:</strong>{" "}
              {truck?.minFareString || "Thông tin không có"}
            </p>

            <p>
              <strong>Phí bổ sung:</strong>
              {Array.isArray(truck?.additionalFare) &&
              truck.additionalFare.length > 0
                ? truck.additionalFare.map((fare, index) => (
                    <div
                      key={index}
                      style={{
                        display: "block", // Mỗi mục sẽ hiển thị trên một dòng mới
                        marginBottom: "8px", // Tạo khoảng cách giữa các mục
                        paddingLeft: "20px", // Thụt vào một chút
                        fontSize: "14px", // Kích thước chữ
                        color: "#333", // Màu chữ
                      }}
                    >
                      {`Từ ${fare.minRange} đến ${fare.maxRange} km: ${fare.rateString}`}
                    </div>
                  ))
                : "Không có phí bổ sung"}
            </p>

            <p>
              <strong>Dịch vụ hỗ trợ:</strong>
              {Array.isArray(truck?.serviceSupport) &&
              truck.serviceSupport.length > 0
                ? truck.serviceSupport
                    .map((service, index) => (
                      <span key={index} className="service">
                        {service.name} - {service.priceString}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])
                : "Không có dịch vụ hỗ trợ"}
            </p>

            <p>
              <strong>Chi tiết bốc dỡ:</strong>
              {Array.isArray(truck?.detailsUnloading) &&
              truck.detailsUnloading.length > 0
                ? truck.detailsUnloading
                    .map((detail, index) => (
                      <span key={index} className="unloading">
                        {detail.name} - {detail.priceString}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])
                : "Không có chi tiết bốc dỡ"}
            </p>

            <p>
              <strong>Loại thùng:</strong>
              {Array.isArray(truck?.box) && truck.box.length > 0
                ? truck.box
                    .map((b, index) => (
                      <span key={index} className="box">
                        {b.name} - {b.pricePercent}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])
                : "Không có loại thùng"}
            </p>
          </div>
        </div>

        <div className="truck-image">
          <img src={truck?.image || "default-image.jpg"} alt="Ảnh xe tải" />
        </div>
      </div>

      <div className="truck-actions">
        <button
          className="btn btn-danger"
          onClick={() => handleDeleteTruck(truck?.id)}
        >
          Xóa xe
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleUpdateTruck(truck?.id)}
        >
          Cập Nhật
        </button>
      </div>
    </div>
  );
};

export default TruckList;
