// models/Voucher.js
export class Voucher {
  constructor(
    code = "",
    name = "",
    description = "",
    type = "",
    value = "",
    minOrderValue = "",
    maxDiscount = "",
    startDate = "",
    endDate = "",
    imageUrl = ""
  ) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.type = type;
    this.value = value;
    this.minOrderValue = minOrderValue;
    this.maxDiscount = maxDiscount;
    this.startDate = startDate;
    this.endDate = endDate;
    this.imageUrl = imageUrl;
  }
}
