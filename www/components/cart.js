import Drawer from "rc-drawer";
import CartTable from "./cart_table";

function Cart({ cart, setCart, cartOpened, setCartOpened }) {
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
        <h2 className="heading text-4xl my-5">Košarica</h2>
        <CartTable cart={cart} setCart={setCart} />
      </div>
    </Drawer>
  );
}

export default Cart;
