import Link from "next/link";

function ProductsList({ products }) {
  return (
    <div>
      <ul>
        {products.map((p) => {
          return (
            <li key={p.ID}>
              <Link href={p.URL}>
                <a>{p.Name}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProductsList;
