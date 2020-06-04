import Link from "next/link";
import { getPrice, getReductedPrice, getReduction } from "../helpers/price";
import { cartSetQuantity, cartRemove } from "../helpers/cart";
import { Trash2 } from "react-feather";

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
                {getReductedPrice(p.Price, p.Reduction, p.ReductionType)}
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
          className="input w-16"
        />
      </td>
      <td>
        <button
          type="button"
          onClick={() => cartRemove(setCart, p)}
          className="button ~critical !normal p-2"
        >
          <Trash2 />
        </button>
      </td>
    </tr>
  );
}

export default CartRow;
