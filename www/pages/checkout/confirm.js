import Menu from "../../components/menu";
import SEO from "../../components/seo.js";

function Confirm({ categoriesTree, order, menuOpened, setMenuOpened }) {
  if (!order || !order.Success) {
    return (
      <div className="container mx-auto px-4">
        <SEO
          title="Narudžba | Amadeus II d.o.o. shop"
          description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
        />
        <h2 className="heading text-4xl mt-12 mb-5">Vaša narudžba</h2>
        <div>Dogodila se greška prilikom obrade vaše narudžbe. Molimo kontaktirajte nas.</div>
        <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      </div>
    );
  }

  const shippingData = order.Data.useShippingData
    ? order.Data.shippingData
    : order.Data.paymentData;

  return (
    <div className="container mx-auto px-4">
      <SEO
        title="Narudžba | Amadeus II d.o.o. shop"
        description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
      />
      <h2 className="heading text-4xl mt-12 mb-5">Vaša narudžba</h2>
      <div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <h2 className="subheading text-2xl mb-2">Podaci za plaćanje:</h2>
            <div className="card ~neutral !low">
              {order.Data.paymentData.isCompany ? (
                <>
                  <p>
                    <span className="font-bold">Naziv tvrtke:</span>{" "}
                    {order.Data.paymentData.companyName}
                  </p>
                  <p>
                    <span className="font-bold">OIB tvrtke:</span> {order.Data.paymentData.oib}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-bold">Vaše ime:</span> {order.Data.paymentData.firstName}
                  </p>
                  <p>
                    <span className="font-bold">Vaše prezime:</span>{" "}
                    {order.Data.paymentData.lastName}
                  </p>
                </>
              )}
              <p>
                <span className="font-bold">Ulica i broj:</span> {order.Data.paymentData.address}
              </p>
              <p>
                <span className="font-bold">Poštanski broj:</span>{" "}
                {order.Data.paymentData.postalCode}
              </p>
              <p>
                <span className="font-bold">Mjesto:</span> {order.Data.paymentData.city}
              </p>
              <p>
                <span className="font-bold">Država:</span> {order.Data.paymentData.country}
              </p>
              <p>
                <span className="font-bold">Mobitel:</span> {order.Data.paymentData.phoneNumber}
              </p>
              <p>
                <span className="font-bold">E-mail adresa:</span>{" "}
                {order.Data.paymentData.emailAdress}
              </p>
            </div>
          </div>
          <div>
            <h2 className="subheading text-2xl mb-2">Podaci za dostavu:</h2>
            <div className="card ~neutral !low">
              {shippingData.isCompany ? (
                <>
                  <p>
                    <span className="font-bold">Naziv tvrtke:</span> {shippingData.companyName}
                  </p>
                  <p>
                    <span className="font-bold">OIB tvrtke:</span> {shippingData.oib}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-bold">Vaše ime:</span> {shippingData.firstName}
                  </p>
                  <p>
                    <span className="font-bold">Vaše prezime:</span> {shippingData.lastName}
                  </p>
                </>
              )}
              <p>
                <span className="font-bold">Ulica i broj:</span> {shippingData.address}
              </p>
              <p>
                <span className="font-bold">Poštanski broj:</span> {shippingData.postalCode}
              </p>
              <p>
                <span className="font-bold">Mjesto:</span> {shippingData.city}
              </p>
              <p>
                <span className="font-bold">Država:</span> {shippingData.country}
              </p>
              <p>
                <span className="font-bold">Mobitel:</span> {shippingData.phoneNumber}
              </p>
              <p>
                <span className="font-bold">E-mail adresa:</span> {shippingData.emailAdress}
              </p>
            </div>
          </div>
        </div>
        <pre>{JSON.stringify(order, null, 2)}</pre>
      </div>
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

export default Confirm;

// terms
// dodatne napomene
// order_info component
// cart form
// rename to /order
// prodizvodi, porez, dostava 0kn, ukupno
