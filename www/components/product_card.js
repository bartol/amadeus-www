import Link from "next/link";
import { getPrice, getReductionPrice, getReduction } from "../helpers/price";
import { useSharedState } from "../state/shared";
import { CartAdd } from "../helpers/cart";

function ProductCard({ product }) {
  const p = product;
  const [, setState] = useSharedState();

  return (
    <li>
      <Link href={"/" + p.URL}>
        <a>
          <img src={p.DefaultImage.URL} alt="slika proizvoda" className="w-56" />
          <h3>{p.Name}</h3>
        </a>
      </Link>
      <div>
        <div>
          <h4 className={`${p.HasReduction ? "line-through" : "text-2xl"}`}>{getPrice(p.Price)}</h4>
          {p.HasReduction && (
            <h4 className="text-2xl">{getReductionPrice(p.Price, p.Reduction, p.ReductionType)}</h4>
          )}
        </div>

        {p.HasReduction && (
          <h4 className="text-2xl">{getReduction(p.Reduction, p.ReductionType)}</h4>
        )}
      </div>
      <div>
        <Link href={"/" + p.URL}>
          <a className="button ~info !normal m-1">Više informacija</a>
        </Link>

        {p.OutOfStock || (
          <button
            type="button"
            onClick={() => CartAdd(setState, p)}
            className="button ~positive !normal m-1"
          >
            Dodaj u košaricu{/* TODO icon */}
          </button>
        )}
      </div>
    </li>
  );
}

export default ProductCard;
