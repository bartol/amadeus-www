import Link from "next/link";
import { getPrice, getReductedPrice, getReduction } from "../helpers/price";
import { cartSetQuantity, cartRemove } from "../helpers/cart";
import { Trash2 } from "react-feather";

function CartRow({ product, setCart }) {
  const p = product;

  return (
    <tr>
      <td className="w-20 h-20">
        <Link href={"/" + p.URL}>
          <a>
            <img src={p.DefaultImage.URL} alt="slika proizvoda" />
          </a>
        </Link>
      </td>
      <td>
        <Link href={"/" + p.URL}>
          <a>
            <h3>{p.Name}</h3>
          </a>
        </Link>
      </td>
      <td>
        <h4 className={`${p.HasReduction ? "line-through" : "font-bold"}`}>{getPrice(p.Price)}</h4>
        {p.HasReduction && (
          <div className="flex whitespace-no-wrap">
            <h4 className="font-bold mr-2">
              {getReductedPrice(p.Price, p.Reduction, p.ReductionType)}
            </h4>
            <h4>({getReduction(p.Reduction, p.ReductionType)})</h4>
          </div>
        )}
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
