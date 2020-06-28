import Drawer from "rc-drawer";
import Link from "next/link";
import { X } from "react-feather";

function Menu({ categories, menuOpened, setMenuOpened }) {
  return (
    <Drawer
      placement="left"
      open={menuOpened}
      onClose={() => setMenuOpened(false)}
      level={null}
      handler={false}
    >
      <div className="m-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="heading text-4xl">Kategorije</h2>
          <button
            type="button"
            onClick={() => setMenuOpened(false)}
            className="button ~neutral !normal p-2"
          >
            <X />
          </button>
        </div>
        <ul>{categories.map((c) => renderTreeNode(c))}</ul>
      </div>
    </Drawer>
  );
}

function renderTreeNode(category) {
  // don't show tree leafs without products
  if (!category.HasProducts && !category.Children.length) return;

  return (
    <li key={category.ID}>
      <h3>
        {category.HasProducts && !category.Children.length ? (
          <Link href="/[category]" as={"/" + category.Slug}>
            <a>
              {category.Name} ({category.ProductCount})
            </a>
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
