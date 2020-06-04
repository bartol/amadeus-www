import Drawer from "rc-drawer";
import CartList from "./cart_list";

function Cart({ cart, setCart }) {
  return (
    <Drawer placement="right">
      <h2 className="heading">Košarica</h2>
      <CartList cart={cart} setCart={setCart} />
    </Drawer>
  );
}

export default Cart;
