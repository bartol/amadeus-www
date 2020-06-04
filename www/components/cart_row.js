import Link from "next/link";
import { getPrice, getReductionPrice, getReduction } from "../helpers/price";
import { cartSetQuantity, cartRemove } from "../helpers/cart";

function CartRow({ product, setCart }) {
  const p = product;

  return (
    <tr>
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
}

export default CartRow;
