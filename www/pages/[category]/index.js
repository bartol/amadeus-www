import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

function Category() {
  const router = useRouter();
  const { category: slug } = router.query;

  const { data: category, error } = useSWR(
    `http://localhost:8080/categories/${slug}`,
    fetcher
  );

  if (error) return <div>404 TODO</div>;
  if (!category) return <div>loading...</div>;
  return (
    <div>
      <pre>DEBUG: {JSON.stringify(category, null, 2)}</pre>
    </div>
  );
}

export default Category;
