import { useRouter } from "next/router";
import useSWR from "swr";
import { Heading, Box } from "@chakra-ui/core";

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
      <Heading>{product.Name}</Heading>
      <Box dangerouslySetInnerHTML={{ __html: product.Description }}></Box>
      <pre>DEBUG: {JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}

export default Product;
