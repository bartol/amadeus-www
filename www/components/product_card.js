import Link from "next/link";
import { getPrice, getReductedPrice, getReduction } from "../helpers/price";
import { cartAdd } from "../helpers/cart";
import { ShoppingCart } from "react-feather";

function ProductCard({ product, setCart, dispatchAlert }) {
  const p = product;

  return (
    <li>
      <div className="card ~neutral !low">
        <Link href="/[category]/[slug]" as={"/" + p.URL}>
          <a>
            <div className="relative pb-full">
              <img
                src={p.DefaultImage.URL + "?options=75,quality=low"}
                data-src={p.DefaultImage.URL + "?options=400"}
                alt="slika proizvoda"
                className="lazyload absolute w-full h-full object-contain"
              />
            </div>
            <h3 className="subheading">{p.Name}</h3>
          </a>
        </Link>
        <div>
          <h4 className={`${p.HasReduction ? "line-through" : "subheading font-bold"}`}>
            {getPrice(p.Price)}
          </h4>
          {p.HasReduction && (
            <div className="flex">
              <h4 className="subheading font-bold">
                {getReductedPrice(p.Price, p.Reduction, p.ReductionType)}
              </h4>
              <h4 className="subheading">{getReduction(p.Reduction, p.ReductionType)}</h4>
            </div>
          )}
        </div>
        <div className="flex h-10 mt-3">
          <Link href="/[category]/[slug]" as={"/" + p.URL}>
            <a className="button ~info !normal text-lg flex-grow justify-center">
              Više informacija
            </a>
          </Link>

          {p.OutOfStock || (
            <button
              type="button"
              onClick={() => {
                cartAdd(setCart, p);
                dispatchAlert("Proizvod dodan u košaricu", "positive", ShoppingCart);
              }}
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
