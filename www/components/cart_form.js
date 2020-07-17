function CartForm({ order, setOrder }) {
  const setOrderProperty = (property) => (data) => {
    setOrder({
      ...order,
      [property]: data,
    });
  };

  return (
    <div>
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

      <h2 className="heading text-4xl mt-6 mb-3">Dodatna napomena</h2>
      <textarea
        rows="4"
        placeholder="Napomena vezana uz proizvode koje naručujete ili dodatna uputa za našu službu dostave"
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

      <pre>{JSON.stringify(order, null, 2)}</pre>
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
            data={data}
            setData={setData}
          />
          <TextInput property="oib" placeholder="OIB tvrtke" data={data} setData={setData} />
        </div>
      ) : (
        <div>
          <TextInput property="firstName" placeholder="Vaše ime" data={data} setData={setData} />
          <TextInput property="lastName" placeholder="Vaše prezime" data={data} setData={setData} />
        </div>
      )}

      <TextInput property="address" placeholder="Ulica i broj" data={data} setData={setData} />
      <TextInput property="postalCode" placeholder="Poštanski broj" data={data} setData={setData} />
      <TextInput property="city" placeholder="Mjesto" data={data} setData={setData} />

      <span className="support ml-1">Država</span>
      <div className="select !normal mb-3">
        <select
          value={data.country}
          onChange={(e) => setData({ ...data, country: e.target.value })}
        >
          <option value="HR">Hrvatska</option>
        </select>
      </div>

      <TextInput
        property="emailAdress"
        placeholder="E-mail adresa"
        type="email"
        data={data}
        setData={setData}
      />
      <TextInput
        property="phoneNumber"
        placeholder="Mobitel"
        type="tel"
        data={data}
        setData={setData}
      />
    </div>
  );
};

const TextInput = ({ property, placeholder, type = "text", data, setData }) => {
  return (
    <label>
      <span className="support ml-1">{placeholder}</span>
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

const CardSubForm = ({ cardType, setCardType, installments, setInstallments }) => {
  return (
    <div>
      <span className="support ml-1">Kartica</span>
      <div className="select !normal mb-3">
        <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
          <option value="amex">American Express</option>
          <option value="maestro">Maestro</option>
          <option value="master">MasterCard</option>
          <option value="visa">Visa</option>
          <option value="visapremium">Visa Premium</option>
        </select>
      </div>

      <span className="support ml-1">Broj rata</span>
      <div className="select !normal mb-3">
        <select value={installments} onChange={(e) => setInstallments(parseInt(e.target.value))}>
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
    </div>
  );
};

export default CartForm;
