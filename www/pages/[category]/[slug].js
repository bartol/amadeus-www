import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

function Product() {
  const router = useRouter();
  const { category, slug } = router.query;

  const { data: product, error } = useSWR(
    `http://localhost:8080/products/${category}/${slug}`,
    fetcher
  );

  if (error) return <div>404 TODO</div>;
  if (!product) return <div>loading...</div>;
  return (
    <div>
      <h1>{product.Name}</h1>
      <div dangerouslySetInnerHTML={{ __html: product.Description }}></div>
      <pre>DEBUG: {JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}

export default Product;
