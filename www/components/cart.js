import Drawer from "rc-drawer";
import Link from "next/link";
import { getPrice, getReductionPrice, getReduction, getTotal } from "../helpers/price";
import { cartSetQuantity, cartRemove } from "../helpers/cart";

function Cart({ cart, setCart }) {
  return (
    <Drawer placement="right">
      <h2 className="heading">Košarica</h2>
      <table className="table">
        <thead>
          <tr>
            <th colSpan="2">Naziv</th>
            <th>Cijena</th>
            <th colSpan="2">Količina</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((p) => {
            return (
              <tr key={p.ID}>
                <td>
                  <Link href={"/" + p.URL}>
                    <a>
                      <img src={p.DefaultImage.URL} alt="slika proizvoda" className="w-20" />
                    </a>
                  </Link>
                </td>
                <td>
                  <Link href={"/" + p.URL}>
                    <a>{p.Name}</a>
                  </Link>
                </td>
                <td>
                  <div>
                    <h4 className={`${p.HasReduction ? "line-through" : "subheading"}`}>
                      {getPrice(p.Price)}
                    </h4>
                    <div className="flex">
                      {p.HasReduction && (
                        <h4 className="subheading">
                          {getReductionPrice(p.Price, p.Reduction, p.ReductionType)}
                        </h4>
                      )}

                      {p.HasReduction && (
                        <h4 className="subheading">{getReduction(p.Reduction, p.ReductionType)}</h4>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={p.Quantity}
                    onChange={(e) => cartSetQuantity(setCart, p, e.target.value | 0)}
                    min="1"
                    className="input"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => cartRemove(setCart, p)}
                    className="button ~critical !normal"
                  >
                    del{/* TODO icon */}
                  </button>
                </td>
              </tr>
            );
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
    </Drawer>
  );
}

export default Cart;
