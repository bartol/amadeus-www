import ProductCard from "./product_card";

function ProductList({ products, limit, pagination, pageSize }) {
  let list = [];
  if (products && limit) {
    list = products.slice(0, limit);
  } else {
    list = products;
  }

  return (
    <div className="flex">
      <div className="w-1/6">kategorije</div>
      <ul className="w-5/6 grid grid-cols-3 gap-4">
        {list.map((p) => {
          if (!p.ID) {
            return null;
          }

          return <ProductCard product={p} key={p.ID} />;
        })}
      </ul>
    </div>
  );
}

export default ProductList;
