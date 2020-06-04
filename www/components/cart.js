import Drawer from "rc-drawer";
import CartTable from "./cart_table";

function Cart({ cart, setCart }) {
  return (
    <Drawer placement="right" width="1000px">
      <h2 className="heading">Košarica</h2>
      <CartTable cart={cart} setCart={setCart} />
    </Drawer>
  );
}

export default Cart;
