import Drawer from "rc-drawer";
import CartTable from "./cart_table";

function Cart({ cart, setCart }) {
  return (
    <Drawer placement="right" width="800px" level=".drawer-dont-push-content">
      <div className="m-5">
        <h2 className="heading text-4xl my-5">Košarica</h2>
        <CartTable cart={cart} setCart={setCart} />
      </div>
    </Drawer>
  );
}

export default Cart;
