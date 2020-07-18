function orderSave(order) {
  const orders = JSON.parse(localStorage.getItem("order_data")) || {};
  orders[order.saveName] = order;
  localStorage.setItem("order_data", JSON.stringify(orders));
}

function ordersGet() {
  const orders = JSON.parse(localStorage.getItem("order_data")) || {};
  return Object.keys(orders);
}

function orderGet(saveName, setOrder) {
  const orders = JSON.parse(localStorage.getItem("order_data")) || {};
  if (saveName in orders) {
    setOrder(orders[saveName]);
  }
}

function ordersClear() {
  localStorage.setItem("order_data", JSON.stringify({}));
}

const dataInit = {
  isCompany: false,
  companyName: "",
  oib: "",
  firstName: "",
  lastName: "",
  address: "",
  postalCode: "",
  city: "",
  country: "Hrvatska",
  phoneNumber: "",
  emailAdress: "",
};

const orderInit = {
  paymentData: dataInit,
  shippingData: dataInit,
  useShippingData: false,
  additionalInfo: "",
  paymentMethod: "uplata-po-ponudi",
  cardType: "VISA",
  installments: "0",
  coupon: "",
  save: false,
  saveName: new Date().toISOString().substring(0, 10),
  terms: false,
};

export { orderInit, orderSave, ordersGet, orderGet, ordersClear };
