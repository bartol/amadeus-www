import Link from "next/link";
import { getPrice, getReduction } from "../helpers/price";

function ProductCard({ product }) {
  const p = product;

  return (
    <li key={p.ID}>
      <Link href={"/" + p.URL}>
        <a>
          <img
            src={p.DefaultImage.URL}
            alt="slika proizvoda"
            className="w-56"
          />
          <h3>{p.Name}</h3>

          {p.HasReduction ? (
            <h4>
              <span className="line-through">{getPrice(p.Price)}</span>
              {getReduction(p.Price, p.Reduction, p.ReductionType)}
            </h4>
          ) : (
            <h4>{getPrice(p.Price)}</h4>
          )}

          <pre>{JSON.stringify(p, null, 2)}</pre>
        </a>
      </Link>
    </li>
  );
}

export default ProductCard;
