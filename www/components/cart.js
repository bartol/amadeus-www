import Drawer from "rc-drawer";
import Link from "next/link";
import { getPrice, getReductionPrice, getReduction, getTotal } from "../helpers/price";
import { CartSetQuantity, CartRemove } from "../helpers/cart";

function Cart({ cart, setCart }) {
  return (
    <Drawer placement="right">
      <table className="table">
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
                  <div>
                    <h4 className={`${p.HasReduction ? "line-through" : "text-2xl"}`}>
                      {getPrice(p.Price)}
                    </h4>
                    {p.HasReduction && (
                      <h4 className="text-2xl">
                        {getReductionPrice(p.Price, p.Reduction, p.ReductionType)}
                      </h4>
                    )}
                  </div>

                  {p.HasReduction && (
                    <h4 className="text-2xl">{getReduction(p.Reduction, p.ReductionType)}</h4>
                  )}
                </div>
              </td>
              <td>
                <input
                  type="number"
                  value={p.Quantity}
                  onChange={(e) => CartSetQuantity(setCart, p, e.target.value | 0)}
                  min="1"
                  className="input"
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => CartRemove(setCart, p)}
                  className="button ~critical !normal"
                >
                  izbaci iz kosarice{/* TODO icon */}
                </button>
              </td>
            </tr>
          );
        })}
      </table>
      <hr />
      <h4 className="text-2xl">Total: {getTotal(cart)}</h4>
    </Drawer>
  );
}

export default Cart;
