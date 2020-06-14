import Drawer from "rc-drawer";
import Link from "next/link";

function Menu({ categories, menuOpened, setMenuOpened }) {
  return (
    <Drawer
      placement="left"
      width="300px"
      open={menuOpened}
      onClose={() => setMenuOpened(false)}
      level={null}
      handler={false}
    >
      <div className="m-5">
        <h2 className="heading text-4xl my-5">Kategorije</h2>
        <ul>{categories.map((c) => renderTreeNode(c))}</ul>
      </div>
    </Drawer>
  );
}

function renderTreeNode(category) {
  // don't show tree leafs without products
  if (!category.Slug && !category.Children.length) return;

  return (
    <li key={category.ID}>
      <h3>
        {category.Slug ? (
          <Link href="/[category]" as={"/" + category.Slug}>
            <a>{category.Name}</a>
          </Link>
        ) : (
          <span className="opacity-50">{category.Name}</span>
        )}
      </h3>
      <ul className="ml-5">{category.Children.map((c) => renderTreeNode(c))}</ul>
    </li>
  );
}

export default Menu;
