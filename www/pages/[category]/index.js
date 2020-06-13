import { useRouter } from "next/router";
import ProductList from "../../components/product_list";
import Menu from "../../components/menu";

function Category({ category, categoriesTree, setCart, menuOpened, setMenuOpened }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="heading text-4xl mt-12 mb-5">{category.Name}</h1>
      <ProductList products={category.Products} limit={30} setCart={setCart} />
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://api.amadeus2.hr/categories/");
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
  const categoryRes = await fetch(`https://api.amadeus2.hr/categories/${params.category}`);
  const category = await categoryRes.json();

  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      category,
      categoriesTree,
    },
  };
}

export default Category;
