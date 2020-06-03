import ProductCard from "./product_card";

function ProductList({ products, limit, pagination, pageSize }) {
  let list;
  if (limit) {
    list = products.slice(0, limit);
  } else {
    list = products;
  }

  return (
    <div>
      <ul>
        {list.map((p) => {
          if (!p.ID) {
            return null;
          }

          return <ProductCard product={p} />;
        })}
      </ul>
    </div>
  );
}

export default ProductList;
