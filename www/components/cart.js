import Drawer from "rc-drawer";
import CartTable from "./cart_table";
import { X, ArrowRight, ArrowLeft } from "react-feather";
import { useState, useRef, useReducer } from "react";
import CartForm from "./cart_form";

function Cart({ cart, setCart, order, setOrder, cartOpened, setCartOpened, dispatchAlert }) {
  const [scroll, setScroll] = useState(0);
  const tableRef = useRef(null);

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
        <CartTable
          cart={cart}
          setCart={setCart}
          order={order}
          setScroll={setScroll}
          tableRef={tableRef}
        />
        {cart.length > 0 && (
          <CartForm
            cart={cart}
            setCart={setCart}
            setCartOpened={setCartOpened}
            order={order}
            setOrder={setOrder}
            dispatchAlert={dispatchAlert}
          />
        )}
      </div>
    </Drawer>
  );
}

export default Cart;
