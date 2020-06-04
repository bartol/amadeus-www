import CartRow from "./cart_row";
import { getTotal } from "../helpers/price";

function CartTable({ cart, setCart }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th colSpan="2">Proizvod</th>
          <th>Cijena</th>
          <th colSpan="2">Količina</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((p) => {
          return <CartRow product={p} setCart={setCart} key={p.ID} />;
        })}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan="2" />
          <th colSpan="3" className="subheading">
            Ukupno: {getTotal(cart)}
          </th>
        </tr>
      </tfoot>
    </table>
  );
}

export default CartTable;
