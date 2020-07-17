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

export default CartForm;
