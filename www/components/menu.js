import Drawer from "rc-drawer";
import Link from "next/link";

function Menu({ categories }) {
  return (
    <Drawer placement="left" width="300px">
      <div className="m-5">
        <h2 className="heading">Kategorije</h2>
        <ul>{categories.map((c) => renderTreeNode(c))}</ul>
      </div>
    </Drawer>
  );
}

function renderTreeNode(category) {
  return (
    <li>
      <h3>
        <Link href="/[category]" as={"/" + category.Slug}>
          <a>{category.Name}</a>
        </Link>
      </h3>
      <ul className="ml-5">{category.Children.map((c) => renderTreeNode(c))}</ul>
    </li>
  );
}

export default Menu;
