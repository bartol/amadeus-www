import { Menu, ShoppingCart } from "react-feather";
import SearchBox from "./search_box";

function Header({ query, setQuery, setCartOpened, setMenuOpened }) {
  return (
    <header className="container mx-auto sticky top-0 z-10 p-4">
      <div className="card ~neutral !low flex justify-between items-center overflow-visible">
        <button
          type="button"
          className="button ~info !normal px-3 py-2"
          onClick={() => setMenuOpened(true)}
        >
          <Menu />
          <span className="text-lg ml-2 lg:block hidden">Kategorije</span>
        </button>
        <SearchBox query={query} setQuery={setQuery} />
        <button
          type="button"
          className="button ~positive !normal px-3 py-2"
          onClick={() => setCartOpened(true)}
        >
          <ShoppingCart />
          <span className="text-lg ml-2 lg:block hidden">Košarica</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
