import { useRouter } from "next/router";
import ProductList from "../../components/product_list";
import Menu from "../../components/menu";

function Category({ category, categoriesTree, setCart }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="heading">{category.Name}</h1>
      <ProductList products={category.Products} limit={30} setCart={setCart} />
      <Menu categories={categoriesTree} />
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("http://localhost:8080/categories/");
  const categories = await res.json();
  const paths = categories.map((c) => {
    return {
      params: {
        category: c.Slug,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const categoryRes = await fetch(`http://localhost:8080/categories/${params.category}`);
  const category = await categoryRes.json();

  const categoriesTreeRes = await fetch("http://localhost:8080/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      category,
      categoriesTree,
    },
  };
}

export default Category;
