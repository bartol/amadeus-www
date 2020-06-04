import Drawer from "rc-drawer";
import CartTable from "./cart_table";

function Cart({ cart, setCart }) {
  return (
    <Drawer placement="right" width="800px">
      <div className="m-5">
        <h2 className="heading">Košarica</h2>
        <CartTable cart={cart} setCart={setCart} />
      </div>
    </Drawer>
  );
}

export default Cart;
