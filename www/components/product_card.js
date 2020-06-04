import Link from "next/link";
import { getPrice, getReductedPrice, getReduction } from "../helpers/price";
import { cartAdd } from "../helpers/cart";
import { ShoppingCart } from "react-feather";

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
          {p.HasReduction && (
            <div className="flex">
              <h4 className="subheading">
                {getReductedPrice(p.Price, p.Reduction, p.ReductionType)}
              </h4>
              <h4 className="subheading">{getReduction(p.Reduction, p.ReductionType)}</h4>
            </div>
          )}
        </div>
        <div className="flex h-10 mt-3">
          <Link href={"/" + p.URL}>
            <a className="button ~info !normal text-lg flex-grow justify-center">
              Više informacija
            </a>
          </Link>

          {p.OutOfStock || (
            <button
              type="button"
              onClick={() => cartAdd(setCart, p)}
              className="button ~positive !normal px-3 py-2 ml-4"
            >
              <ShoppingCart />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProductCard;
