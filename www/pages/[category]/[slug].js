import { useRouter } from "next/router";
import Menu from "../../components/menu";

function Product({ product, categoriesTree }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="heading text-4xl mt-12 mb-5">{product.Name}</h1>
      <div dangerouslySetInnerHTML={{ __html: product.Description }} className="content"></div>
      <pre>DEBUG: {JSON.stringify(product, null, 2)}</pre>
      <Menu categories={categoriesTree} />
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://api.amadeus2.hr/products/");
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
  const productRes = await fetch(
    `https://api.amadeus2.hr/products/${params.category}/${params.slug}`
  );
  const product = await productRes.json();

  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      product,
      categoriesTree,
    },
  };
}

export default Product;
