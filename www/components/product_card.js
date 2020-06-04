import Link from "next/link";
import { getPrice, getReductionPrice, getReduction } from "../helpers/price";
import { useSharedState } from "../state/shared";
import { CartAdd } from "../helpers/cart";

function ProductCard({ product }) {
  const p = product;
  const [, setState] = useSharedState();

  return (
    <li>
      <div className="card ~neutral !low">
        <Link href={"/" + p.URL}>
          <a>
            <img src={p.DefaultImage.URL} alt="slika proizvoda" />
            <h3 className="subheading">{p.Name}</h3>
          </a>
        </Link>
        <div>
          <div>
            <h4 className={`${p.HasReduction ? "line-through" : "subheading"}`}>
              {getPrice(p.Price)}
            </h4>
            {p.HasReduction && (
              <h4 className="subheading">
                {getReductionPrice(p.Price, p.Reduction, p.ReductionType)}
              </h4>
            )}
          </div>

          {p.HasReduction && (
            <h4 className="subheading">{getReduction(p.Reduction, p.ReductionType)}</h4>
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
      </div>
    </li>
  );
}

export default ProductCard;
