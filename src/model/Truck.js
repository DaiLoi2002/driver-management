class Truck {
  constructor(
    id = "", // id có thể được gán từ API
    name = "",
    type = "",
    image = "",
    dimensions = new Dimensions(),
    prohibitedHours = new ProhibitedHours(),
    maxCapacity = new MaxCapacity(),
    detailsUnloading = [],
    box = "",
    superSpeedFare = 0,
    superSpeedFareString = "",
    minFare = 0,
    minFareString = "",
    additionalFare = [
      new AdditionalFare(4, 10, 0, "₫0"),
      new AdditionalFare(10, 30, 0, "₫0"),
      new AdditionalFare(30, 50, 0, "₫0"),
      new AdditionalFare(50, 100, 0, "₫0"),
      new AdditionalFare(100, 999, 0, "₫0"),
    ],
    serviceSupport = ""
  ) {
    this.id = id; // Gán id từ API
    this.name = name;
    this.type = type;
    this.image = image;
    this.dimensions = dimensions;
    this.prohibitedHours = prohibitedHours;
    this.maxCapacity = maxCapacity;
    this.detailsUnloading = detailsUnloading;
    this.box = box;
    this.superSpeedFare = superSpeedFare;
    this.superSpeedFareString = superSpeedFareString;
    this.minFare = minFare;
    this.minFareString = minFareString;
    this.additionalFare = additionalFare;
    this.serviceSupport = serviceSupport;
  }

  // Optionally, you can create methods for specific logic here
}

class Dimensions {
  constructor(title, length, width, height) {
    this.title = title;
    this.length = length;
    this.width = width;
    this.height = height;
  }
}

class ProhibitedHours {
  constructor(title, morning, afternoon) {
    this.title = title;
    this.morning = morning;
    this.afternoon = afternoon;
  }
}

class MaxCapacity {
  constructor(title, weight, CBM) {
    this.title = title;
    this.weight = weight;
    this.CBM = CBM;
  }
}

class UnloadingService {
  constructor(Id, name, price, priceString) {
    this.Id = Id;
    this.name = name;
    this.price = price;
    this.priceString = priceString;
  }
}

class Box {
  constructor(Id, name, percent, pricePercent) {
    this.Id = Id;
    this.name = name;
    this.percent = percent;
    this.pricePercent = pricePercent;
  }
}

class AdditionalFare {
  constructor(minRange, maxRange,  rate, rateString) {
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.rate = rate;
    this.rateString = rateString;
   
  }
}

class ServiceSupport {
  constructor(serviceId, name, percent, price, priceString, select = false) {
    this.serviceId = serviceId;
    this.name = name;
    this.percent = percent;
    this.price = price;
    this.priceString = priceString;
    this.select = select; // Thêm thuộc tính select
  }
}
  

  
  export default Truck;
  