import { Menu, ShoppingCart } from "react-feather";
import Link from "next/link";

function Header({ setCartOpened, setMenuOpened }) {
  return (
    <header className="container mx-auto sticky top-0 z-10 p-4">
      <div className="card ~neutral !low flex justify-between align-center">
        <button
          type="button"
          className="button ~info !normal px-3 py-2"
          onClick={() => setMenuOpened(true)}
        >
          <Menu />
          <span className="text-lg ml-2 lg:block hidden">Kategorije</span>
        </button>
        <div className="flex items-center">
          <Link href="/">
            <a className="w-40 h-8 mr-4">
              <img src="/img/logo.png" alt="Amadeus II" />
            </a>
          </Link>
          <input
            type="search"
            className="input ~neutral !normal w-auto px-3 text-xl"
            placeholder="Pretraži proizvode"
          />
        </div>
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
