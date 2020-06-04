import Link from "next/link";
import { getPrice, getReductionPrice, getReduction } from "../helpers/price";
import { CartAdd } from "../helpers/cart";

function ProductCard({ product, setCart }) {
  const p = product;

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
        <div>
          <Link href={"/" + p.URL}>
            <a className="button ~info !normal m-1">Više informacija</a>
          </Link>

          {p.OutOfStock || (
            <button
              type="button"
              onClick={() => CartAdd(setCart, p)}
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
