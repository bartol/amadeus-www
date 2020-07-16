import Menu from "../../components/menu";
import SEO from "../../components/seo.js";
import { useState } from "react";
import Link from "next/link";
import { Eye } from "react-feather";

const initData = {
  isCompany: false,
  companyName: "",
  oib: "",
  firstName: "",
  lastName: "",
  address: "",
  postalCode: "",
  city: "",
  country: "HR",
  phoneNumber: "",
  emailAdress: "",
};

const TextInput = ({ property, placeholder, type = "text", data, setData }) => {
  return (
    <label>
      <span class="support ml-1">{placeholder}</span>
      <input
        type={type}
        value={data[property]}
        onChange={(e) => setData({ ...data, [property]: e.target.value })}
        placeholder={placeholder}
        className="input ~neutral !normal mb-3"
      />
    </label>
  );
};

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
        <>
          <TextInput
            property="companyName"
            placeholder="Naziv tvrtke"
            data={data}
            setData={setData}
          />
          <TextInput property="oib" placeholder="OIB tvrtke" data={data} setData={setData} />
        </>
      ) : (
        <>
          <TextInput property="firstName" placeholder="Vaše ime" data={data} setData={setData} />
          <TextInput property="lastName" placeholder="Vaše prezime" data={data} setData={setData} />
        </>
      )}

      <TextInput property="address" placeholder="Ulica i broj" data={data} setData={setData} />
      <TextInput property="postalCode" placeholder="Poštanski broj" data={data} setData={setData} />
      <TextInput property="city" placeholder="Mjesto" data={data} setData={setData} />

      <span class="support ml-1">Država</span>
      <div className="select !normal mb-3">
        <select
          value={data.country}
          onChange={(e) => setData({ ...data, country: e.target.value })}
        >
          <option value="HR">Hrvatska</option>
        </select>
      </div>

      <TextInput property="phoneNumber" placeholder="Mobitel" data={data} setData={setData} />
      <TextInput property="emailAdress" placeholder="E-mail adresa" data={data} setData={setData} />
    </div>
  );
};

function Checkout({ categoriesTree, menuOpened, setMenuOpened }) {
  const [paymentData, setPaymentData] = useState(initData);
  const [shippingData, setShippingData] = useState(initData);
  const [useShippingData, setUseShippingData] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("uplata-po-ponudi");
  const [cardType, setCardType] = useState("amex");
  const [installments, setInstallments] = useState(1);
  const [coupon, setCoupon] = useState("");

  return (
    <div className="container mx-auto px-4">
      <SEO
        title="Amadeus II d.o.o. shop"
        description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
      />
      <h2 className="heading text-4xl mt-12 mb-5">Podaci za plaćanje</h2>
      <DataForm data={paymentData} setData={setPaymentData} />
      <label className="flex mt-4">
        <input
          type="checkbox"
          checked={!useShippingData}
          onChange={() => setUseShippingData(!useShippingData)}
        />
        <span className="px-1">Koristi iste podatke za dostavu</span>
      </label>

      {useShippingData && (
        <>
          <h2 className="heading text-4xl mt-12 mb-5">Podaci za dostavu</h2>
          <DataForm data={shippingData} setData={setShippingData} />
        </>
      )}

      <h2 className="heading text-4xl mt-12 mb-5">Dodatna napomena</h2>
      <textarea
        className="textarea ~neutral !normal"
        placeholder="Ovdje možete upisati napomenu vezanu uz proizvode koje naručujete ili dodatnu uputu za našu službu dostave."
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
      ></textarea>

      <h2 className="heading text-4xl mt-12 mb-5">Način plaćanja</h2>
      <label className="flex mb-1">
        <input
          type="radio"
          name="paymentMethod"
          defaultChecked
          checked={paymentMethod === "uplata-po-ponudi"}
          onChange={() => setPaymentMethod("uplata-po-ponudi")}
        />
        <span className="px-1">Plaćanje uplatom po ponudi</span>
      </label>
      <label className="flex mb-1">
        <input
          type="radio"
          name="paymentMethod"
          checked={paymentMethod === "pouzece"}
          onChange={() => setPaymentMethod("pouzece")}
        />
        <span className="px-1">Plaćanje pouzećem</span>
      </label>
      <label className="flex mb-3">
        <input
          type="radio"
          name="paymentMethod"
          checked={paymentMethod === "kartica"}
          onChange={() => setPaymentMethod("kartica")}
        />
        <span className="px-1">Plaćanje karticom</span>
      </label>

      {paymentMethod === "kartica" && (
        <>
          <span class="support ml-1">Odaberite karticu</span>
          <div className="select !normal mb-3">
            <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
              <option value="amex">American Express</option>
              <option value="maestro">Maestro</option>
              <option value="master">MasterCard</option>
              <option value="visa">Visa</option>
              <option value="visapremium">Visa Premium</option>
            </select>
          </div>

          <span class="support ml-1">Broj rata</span>
          <div className="select !normal mb-3">
            <select
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value))}
            >
              <option value="1">Jednokratno</option>
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
        </>
      )}

      <label>
        <span class="support ml-1">Kupon</span>
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Kupon"
          className="input ~neutral !normal mb-3"
        />
      </label>

      <Link href={`/checkout/${paymentMethod}`}>
        <a className="button ~positive !normal justify-center w-full sm:w-auto px-3 py-2 mt-4">
          <Eye />
          <span className="text-lg ml-2">Pregledaj narudžbu</span>
        </a>
      </Link>
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
    </div>
  );
}

export async function getStaticProps() {
  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      categoriesTree,
    },
  };
}

export default Checkout;
