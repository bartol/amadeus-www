import Drawer from "rc-drawer";
import CartTable from "./cart_table";
import { X, ArrowRight, ArrowLeft, CreditCard } from "react-feather";
import { useState, useRef, useEffect } from "react";
import { cartSave } from "../helpers/cart";
import Link from "next/link";

function Cart({ cart, setCart, cartOpened, setCartOpened }) {
  const [scroll, setScroll] = useState(0);
  const tableRef = useRef(null);

  const [checkoutData, setCheckoutData] = useState({
    shopID: "",
    cartID: "",
    totalAmount: "",
    signature: "",
  });

  useEffect(() => {
    async function a() {
      const formData = new URLSearchParams();
      formData.append("products", cart.map((p) => p.URL + "|" + p.Quantity).join(","));

      // const data = await fetch("http://localhost:8081/cart/", {
      const data = await fetch("https://api.amadeus2.hr/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const json = await data.json();
      const totalAmountArr = [...("" + json.TotalAmount)];
      totalAmountArr.splice(totalAmountArr.length - 2, 0, ",");
      setCheckoutData({
        shopID: json.ShopID,
        cartID: json.CartID,
        totalAmount: totalAmountArr.join(""),
        signature: json.Signature,
      });

      cart.forEach((p, i) => {
        const updatedProduct = json.Products.find((uP) => uP.ID === p.ID);
        const refreshIfNeeded = (property) => {
          if (p[property] !== updatedProduct[property]) {
            const updatedCart = cart;
            updatedCart[i][property] = updatedProduct[property];
            cartSave(updatedCart);
            setCart(updatedCart);
          }
        };
        refreshIfNeeded("Price");
        refreshIfNeeded("HasReduction");
        refreshIfNeeded("Reduction");
        refreshIfNeeded("ReductionType");
      });
    }
    a();
  }, [cart]);

  const [terms, setTerms] = useState(false);

  return (
    <Drawer
      placement="right"
      width="800px"
      open={cartOpened}
      onClose={() => setCartOpened(false)}
      level={null}
      handler={false}
    >
      <div className="m-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="heading text-4xl">Košarica</h2>
          <div>
            <button
              type="button"
              onClick={() => {
                const location = scroll === 0 ? tableRef.current.scrollLeftMax : 0;
                tableRef.current.scroll({
                  left: location,
                  behavior: "smooth",
                });
              }}
              className="button ~neutral !normal p-2 mr-5 sm:hidden"
            >
              {scroll === 0 ? <ArrowRight /> : <ArrowLeft />}
            </button>
            <button
              type="button"
              onClick={() => setCartOpened(false)}
              className="button ~neutral !normal p-2"
            >
              <X />
            </button>
          </div>
        </div>
        <CartTable cart={cart} setCart={setCart} setScroll={setScroll} tableRef={tableRef} />
        <label className="flex">
          <input type="checkbox" checked={terms} onChange={() => setTerms(!terms)} />
          <span className="p-1">
            Prihvaćam{" "}
            <Link href="/info/uvjeti-poslovanja">
              <a className="portal p-0">uvjete poslovanja</a>
            </Link>
          </span>
        </label>
        <form name="pay" action="https://formtest.wspay.biz/Authorization.aspx" method="POST">
          <input type="hidden" name="ShopID" value={checkoutData.shopID} />
          <input type="hidden" name="ShoppingCartID" value={checkoutData.cartID} />
          <input type="hidden" name="Version" value="2.0" />
          <input type="hidden" name="TotalAmount" value={checkoutData.totalAmount} />
          <input type="hidden" name="Signature" value={checkoutData.signature} />
          <input type="hidden" name="ReturnURL" value="https://bartol.dev/success" />
          <input type="hidden" name="CancelURL" value="https://bartol.dev/cancel" />
          <input type="hidden" name="ReturnErrorURL" value="https://bartol.dev/error" />

          <button type="submit" className="button ~positive !normal px-3 py-2">
            <CreditCard />
            <span className="text-lg ml-2">Plaćanje</span>
          </button>
        </form>
      </div>
    </Drawer>
  );
}

export default Cart;
