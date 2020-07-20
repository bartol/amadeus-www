import SEO from "../../components/seo";
import { CheckCircle } from "react-feather";
import { getPrice } from "../../helpers/price";
import Router from "next/router";
import { useEffect, useState } from "react";
import { cartSave } from "../../helpers/cart";

function Success(params) {
  const [{ orderID, paymentMethod, totalAmount, setCart }] = useState(params);

  useEffect(() => {
    if (window && window.location.search) {
      Router.replace("/checkout/success");
    }
    cartSave([]);
    setCart([]);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <SEO
        title="Amadeus II d.o.o. shop"
        description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
      />
      <div className="flex sm:flex-row flex-col justify-center mt-12">
        <div className="w-20 h-20 text-green-400 mr-5">
          <CheckCircle width="100%" height="100%" />
        </div>
        <div>
          <h1 className="heading text-4xl sm:mt-0 mt-4 mb-1">
            Vaša narudžba {orderID && `(${orderID})`} je uspješno zaprimljena
          </h1>
          <p className="ml-1">Svi detalji su poslani na Vašu e-mail adresu.</p>
        </div>
      </div>
      {paymentMethod === "uplata-po-ponudi" && (
        <div className="card ~neutral !low max-w-3xl mx-auto mt-12">
          <p>
            <strong>Narudžba će biti isporučena nakon što primimo Vašu uplatu.</strong>
          </p>
          <br />
          <p>Podaci o banci za prijenos sredstava:</p>
          <p>
            <strong>Iznos:</strong> {getPrice(totalAmount)}
          </p>
          <p>
            <strong>Vlasnik računa:</strong> Amadeus II d.o.o.
          </p>
          <p>
            <strong>Adresa banke:</strong> HR0823400091100187471 kod Privredna banka d.d., Zagreb
          </p>
          <br />
          <p>
            Prilikom plaćanja po ponudi molimo pozovite se na broj ponude ({orderID}). Da biste
            ubrzali proces slanja proizvoda molimo Vas ako ste u mogućnosti proslijedite nam na mail
            potvrdu o uspješnoj uplati. Sve uspješno provedene uplate do 15h šaljemo odmah isti dan
            brzom poštom prema Vama.
          </p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      orderID: query.orderID || "",
      paymentMethod: query.paymentMethod || "",
      totalAmount: query.totalAmount || "",
    },
  };
}

export default Success;
