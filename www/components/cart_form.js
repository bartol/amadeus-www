import Link from "next/link";
import { CreditCard, ShoppingBag, AlertCircle } from "react-feather";
import { cartSave } from "../helpers/cart";
import { Fragment, useState } from "react";
import { orderSave, ordersGet, orderGet, ordersClear } from "../helpers/order";

function CartForm({ cart, setCart, order, setOrder, dispatchAlert }) {
  const setOrderProperty = (property) => (data) => {
    setOrder({
      ...order,
      [property]: data,
    });
  };

  const [saves, setSaves] = useState(ordersGet());

  return (
    <div id="form">
      {saves.length > 0 && (
        <div>
          <h3 className="subheading mx-1 mt-6 mb-2">Učitaj pohranjene podatke</h3>
          {saves.map((s) => {
            return (
              <button
                type="button"
                onClick={() => {
                  orderGet(s, setOrder);
                  setSaves(ordersGet());
                }}
                className={`button ~neutral !normal m-1`}
                key={s}
              >
                {s}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              ordersClear();
              setSaves([]);
            }}
            className="button ~critical !normal m-1"
          >
            Obriši pohranjene podatke
          </button>
        </div>
      )}

      <h2 className="heading text-4xl mt-6 mb-3">Podaci za plaćanje</h2>
      <DataForm data={order.paymentData} setData={setOrderProperty("paymentData")} />
      <label className="flex">
        <input
          type="checkbox"
          checked={!order.useShippingData}
          onChange={() => setOrderProperty("useShippingData")(!order.useShippingData)}
        />
        <span className="px-1">Koristi iste podatke za dostavu</span>
      </label>
      {order.useShippingData && (
        <div>
          <h2 className="heading text-4xl mt-6 mb-3">Podaci za dostavu</h2>
          <DataForm data={order.shippingData} setData={setOrderProperty("shippingData")} />
        </div>
      )}

      <h2 className="heading text-4xl mt-6 mb-3">Dodatne napomene</h2>
      <textarea
        rows="4"
        placeholder="Napomene vezane uz proizvode koje naručujete ili dostavu"
        value={order.additionalInfo}
        onChange={(e) => setOrderProperty("additionalInfo")(e.target.value)}
        className="textarea ~neutral !normal"
      ></textarea>

      <h2 className="heading text-4xl mt-6 mb-3">Način plaćanja</h2>
      <label className="flex mb-1">
        <input
          type="radio"
          checked={order.paymentMethod === "uplata-po-ponudi"}
          onChange={() => setOrderProperty("paymentMethod")("uplata-po-ponudi")}
        />
        <span className="px-1">Plaćanje uplatom po ponudi</span>
      </label>
      <label className="flex mb-1">
        <input
          type="radio"
          checked={order.paymentMethod === "pouzece"}
          onChange={() => setOrderProperty("paymentMethod")("pouzece")}
        />
        <span className="px-1">Plaćanje pouzećem</span>
      </label>
      <label className="flex mb-3">
        <input
          type="radio"
          checked={order.paymentMethod === "kartica"}
          onChange={() => setOrderProperty("paymentMethod")("kartica")}
        />
        <span className="px-1">Plaćanje karticom</span>
      </label>

      {order.paymentMethod === "kartica" && (
        <CardSubForm
          cardType={order.cardType}
          setCardType={setOrderProperty("cardType")}
          installments={order.installments}
          setInstallments={setOrderProperty("installments")}
        />
      )}

      <label>
        <span className="support ml-1">Kupon</span>
        <input
          type="text"
          value={order.coupon}
          onChange={(e) => setOrderProperty("coupon")(e.target.value)}
          placeholder="Kupon"
          className="input ~neutral !normal mb-3"
        />
      </label>

      <label className="flex mt-3 mb-1">
        <input
          type="checkbox"
          checked={order.save}
          onChange={() => setOrderProperty("save")(!order.save)}
        />
        <span className="px-1">Zapamti podatke</span>
      </label>
      {order.save && (
        <label>
          <span className="support ml-1">Naziv pohranjenih podataka</span>
          <input
            type="text"
            value={order.saveName}
            onChange={(e) => setOrderProperty("saveName")(e.target.value)}
            placeholder="Naziv pohranjenih podataka"
            className="input ~neutral !normal mb-3"
          />
        </label>
      )}

      <label className="flex mb-3">
        <input
          type="checkbox"
          checked={order.terms}
          onChange={(e) => {
            setOrderProperty("terms")(!order.terms);
            e.target.required = false;
          }}
          id="terms"
        />
        <span className="px-1">
          Prihvaćam{" "}
          <Link href="/info/uvjeti-poslovanja">
            <a className="underline hover:no-underline">uvjete poslovanja</a>
          </Link>
        </span>
      </label>

      <button
        type="button"
        className="button ~positive !normal justify-center w-full px-3 py-2"
        onClick={async () => {
          if (order.save) {
            orderSave(order);
            setSaves(ordersGet());
          }

          const required = document.getElementById("form").querySelectorAll("[required]");
          let scrolled = false;
          let valid = true;
          required.forEach((n) => {
            if (!n.checkValidity()) {
              if (!scrolled) {
                n.scrollIntoView({ behavior: "smooth", block: "center" });
                scrolled = true;
              }
              n.classList.add("~critical");
              valid = false;
            }
          });
          if (!order.terms) document.getElementById("terms").required = true;
          if (!valid) return;
          const res = await fetch("https://api.amadeus2.hr/checkout/", {
            method: "POST",
            body: JSON.stringify({
              ...order,
              cart: cart.map((p) => p.URL + "|" + p.Quantity).join(","),
            }),
          });
          const json = await res.json();

          if (!json.status) {
            dispatchAlert(
              "Pogreška prilikom obrade narudžbe. Molimo pokušajte ponovo.",
              "critical",
              AlertCircle
            );
            console.log(json.error);
          }

          if (JSON.stringify(cart) !== JSON.stringify(json.Cart)) {
            cartSave(json.Cart);
            setCart(json.Cart);
            document.querySelector(".drawer-content").scroll({ top: 0, behavior: "smooth" });
            dispatchAlert(
              "Cijene proizvoda ažurirane. Molimo da provjerite nove cijene i ponovo kliknete tipku " +
                (order.paymentMethod === "kartica" ? '"Plati karticom"' : '"Naruči"'),
              "critical",
              AlertCircle,
              10000
            );
          }

          if (order.paymentMethod === "kartica") {
            const totalAmountArr = [...("" + json.TotalAmount)];
            totalAmountArr.splice(totalAmountArr.length - 2, 0, ",");
            const totalAmount = totalAmountArr.join("");
            const installments = ("" + json.Installments).padStart(2, "0") + "00";

            document.querySelector("[name=ShopID]").value = json.ShopID;
            document.querySelector("[name=ShoppingCartID]").value = json.OrderID;
            document.querySelector("[name=TotalAmount]").value = totalAmount;
            document.querySelector("[name=Signature]").value = json.Signature;
            document.querySelector("[name=PaymentPlan]").value = installments;
            document.querySelector("[name=pay]").submit();
          }

          console.log(json);

          // handle redirects based on paymentMethod
        }}
      >
        {order.paymentMethod === "kartica" ? <CreditCard /> : <ShoppingBag />}
        <span className="text-lg ml-2">
          {order.paymentMethod === "kartica" ? "Plati karticom" : "Naruči"}
        </span>
      </button>

      {order.paymentMethod === "kartica" && (
        <form name="pay" action="https://formtest.wspay.biz/Authorization.aspx" method="POST">
          <input type="hidden" name="ShopID" value="" />
          <input type="hidden" name="ShoppingCartID" value="" />
          <input type="hidden" name="Version" value="2.0" />
          <input type="hidden" name="TotalAmount" value="" />
          <input type="hidden" name="Signature" value="" />
          <input type="hidden" name="ReturnURL" value="https://bartol.dev/success" />
          <input type="hidden" name="CancelURL" value="https://bartol.dev/cancel" />
          <input type="hidden" name="ReturnErrorURL" value="https://bartol.dev/error" />
          {order.paymentData.isCompany ? (
            <input type="hidden" name="CustomerFirstName" value={order.paymentData.companyName} />
          ) : (
            <Fragment>
              <input type="hidden" name="CustomerFirstName" value={order.paymentData.firstName} />
              <input type="hidden" name="CustomerLastName" value={order.paymentData.lastName} />
            </Fragment>
          )}
          <input type="hidden" name="CustomerEmail" value={order.paymentData.emailAdress} />
          <input type="hidden" name="CustomerAddress" value={order.paymentData.address} />
          <input type="hidden" name="CustomerCity" value={order.paymentData.city} />
          <input type="hidden" name="CustomerZIP" value={order.paymentData.postalCode} />
          <input type="hidden" name="CustomerCountry" value={order.paymentData.country} />
          <input type="hidden" name="CustomerPhone" value={order.paymentData.phoneNumber} />
          <input type="hidden" name="PaymentPlan" value="" />
          <input type="hidden" name="CreditCardName" value={order.cardType} />
        </form>
      )}
    </div>
  );
}

const DataForm = ({ data, setData }) => {
  return (
    <div>
      <label className="flex mb-1">
        <input
          type="radio"
          checked={!data.isCompany}
          onChange={() => setData({ ...data, isCompany: false })}
        />
        <span className="px-1">Fizička osoba</span>
      </label>
      <label className="flex mb-3">
        <input
          type="radio"
          checked={data.isCompany}
          onChange={() => setData({ ...data, isCompany: true })}
        />
        <span className="px-1">Pravna osoba</span>
      </label>

      {data.isCompany ? (
        <div>
          <TextInput
            property="companyName"
            placeholder="Naziv tvrtke"
            required
            data={data}
            setData={setData}
          />
          <TextInput
            property="oib"
            placeholder="OIB tvrtke"
            required
            data={data}
            setData={setData}
          />
        </div>
      ) : (
        <div>
          <TextInput
            property="firstName"
            placeholder="Vaše ime"
            required
            data={data}
            setData={setData}
          />
          <TextInput
            property="lastName"
            placeholder="Vaše prezime"
            required
            data={data}
            setData={setData}
          />
        </div>
      )}

      <TextInput
        property="address"
        placeholder="Ulica i broj"
        required
        data={data}
        setData={setData}
      />
      <TextInput
        property="postalCode"
        placeholder="Poštanski broj"
        required
        data={data}
        setData={setData}
      />
      <TextInput property="city" placeholder="Mjesto" required data={data} setData={setData} />

      <span className="support ml-1">Država</span>
      <div className="select !normal mb-3">
        <select
          value={data.country}
          onChange={(e) => setData({ ...data, country: e.target.value })}
        >
          <option>Hrvatska</option>
        </select>
      </div>

      <TextInput
        property="emailAdress"
        placeholder="E-mail adresa"
        required
        type="email"
        data={data}
        setData={setData}
      />
      <TextInput
        property="phoneNumber"
        placeholder="Mobitel"
        required
        type="tel"
        data={data}
        setData={setData}
      />
    </div>
  );
};

const TextInput = ({ property, placeholder, required, type = "text", data, setData }) => {
  return (
    <label>
      <span className="support ml-1">{placeholder}</span>
      <input
        type={type}
        value={data[property]}
        onChange={(e) => {
          setData({ ...data, [property]: e.target.value });
          if (e.target.checkValidity()) {
            e.target.classList.remove("~critical");
          }
        }}
        placeholder={placeholder}
        className="input ~neutral !normal mb-3"
        required={required}
      />
    </label>
  );
};

const CardSubForm = ({ cardType, setCardType, installments, setInstallments }) => {
  return (
    <div>
      <span className="support ml-1">Kartica</span>
      <div className="select !normal mb-3">
        <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
          <option value="VISA">Visa</option>
          <option value="MASTERCARD">MasterCard</option>
          <option value="MAESTRO">Maestro</option>
          <option value="DINERS">Diners</option>
        </select>
      </div>

      <span className="support ml-1">Broj rata</span>
      <div className="select !normal mb-3">
        <select value={installments} onChange={(e) => setInstallments(e.target.value)}>
          <option value="0">Jednokratno</option>
          <option value="2">2 rate</option>
          <option value="3">3 rate</option>
          <option value="4">4 rate</option>
          <option value="5">5 rata</option>
          <option value="6">6 rata</option>
          <option value="7">7 rata</option>
          <option value="8">8 rata</option>
          <option value="9">9 rata</option>
          <option value="10">10 rata</option>
          <option value="11">11 rata</option>
          <option value="12">12 rata</option>
          <option value="13">13 rata</option>
          <option value="14">14 rata</option>
          <option value="15">15 rata</option>
          <option value="16">16 rata</option>
          <option value="17">17 rata</option>
          <option value="18">18 rata</option>
          <option value="19">19 rata</option>
          <option value="20">20 rata</option>
          <option value="21">21 rata</option>
          <option value="22">22 rate</option>
          <option value="23">23 rate</option>
          <option value="24">24 rate</option>
        </select>
      </div>
    </div>
  );
};

export default CartForm;
