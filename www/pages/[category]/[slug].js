import { useRouter } from "next/router";

function Product({ product }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl font-bold">{product.Name}</h1>
      <div dangerouslySetInnerHTML={{ __html: product.Description }}></div>
      <pre>DEBUG: {JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("http://localhost:8080/products/");
  const products = await res.json();
  const paths = products.map((p) => {
    return {
      params: {
        category: p.Categories[p.Categories.length - 1].Slug,
        slug: p.Slug,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `http://localhost:8080/products/${params.category}/${params.slug}`
  );
  const product = await res.json();

  return {
    props: {
      product,
    },
  };
}

export default Product;
