import CartRow from "./cart_row";
import { getTotal } from "../helpers/price";

function CartTable({ cart, setCart }) {
  return (
    <div>
      <div className="overflow-x-scroll">
        <table className="table" style={{ minWidth: "calc(640px - 2.5rem)" }}>
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
              <th colSpan="3">
                <h3 className="subheading sm:block hidden">Ukupno: {getTotal(cart)}</h3>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <h3 className="subheading font-bold float-right sm:hidden">Ukupno: {getTotal(cart)}</h3>
    </div>
  );
}

export default CartTable;
