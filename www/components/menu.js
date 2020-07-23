import Drawer from "rc-drawer";
import Link from "next/link";
import { X, ChevronRight, ArrowLeft } from "react-feather";
import { useState, Fragment } from "react";

function Menu({ categories, menuOpened, setMenuOpened }) {
  const [selected, setSelected] = useState(["root"]);
  const [titles, setTitles] = useState(["Kategorije"]);

  const page = (c) => {
    return (
      <ul
        className="absolute w-full h-full overflow-y-auto"
        style={{
          transform:
            selected.slice(-1)[0] === c.ID
              ? "translateX(0)"
              : selected.includes(c.ID)
              ? "translateX(-400px)"
              : "translateX(400px)",
          visibility: selected.slice(-1)[0] === c.ID ? "visible" : "hidden",
          transitionDuration: "0.25s",
          willChange: "transform",
        }}
        key={c.ID}
      >
        {c.ID !== "root" && (
          <li className="m-px">
            <button
              type="button"
              onClick={() => {
                setSelected(selected.slice(0, -1));
                setTitles(titles.slice(0, -1));
              }}
              className="button ~urge !normal w-full justify-center px-3 py-2 mb-3"
            >
              <ArrowLeft /> <span className="text-lg ml-2">Natrag</span>
            </button>
          </li>
        )}
        {c.Children.map((c) => {
          if (!c.Children.length && !c.HasProducts) return <Fragment key={c.ID}></Fragment>;
          return (
            <li key={c.ID} className="m-px">
              {c.Children.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelected([...selected, c.ID]);
                    setTitles([...titles, c.Name]);
                  }}
                  className="button ~neutral !normal w-full px-3 py-2 mb-3"
                >
                  <span className="text-lg">{c.Name}</span> <ChevronRight />
                </button>
              ) : (
                <Link href="/[category]" as={"/" + c.Slug}>
                  <a
                    onClick={() => setMenuOpened(false)}
                    className="button ~neutral !normal w-full px-3 py-2 mb-3"
                  >
                    <span className="text-lg truncate mr-2">{c.Name}</span> ({c.ProductCount})
                  </a>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const allCategories = [];
  const a = (categories) => {
    categories.forEach((c) => {
      allCategories.push(c);
      a(c.Children);
    });
  };
  a(categories);

  return (
    <Drawer
      placement="left"
      width="400px"
      open={menuOpened}
      onClose={() => setMenuOpened(false)}
      level={null}
      handler={false}
      className="overflow-hidden"
    >
      <div className="m-5 flex flex-col" style={{ height: "calc(100% - 2.5rem)" }}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="heading text-4xl truncate mr-2">{titles.slice(-1)[0]}</h2>
          <button
            type="button"
            onClick={() => setMenuOpened(false)}
            className="button ~neutral !normal p-2"
          >
            <X />
          </button>
        </div>

        <div className="flex-grow overflow-hidden">
          <div className="relative h-full">
            {page({
              ID: "root",
              Children: categories,
            })}
            {allCategories.map((c) => page(c))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default Menu;
