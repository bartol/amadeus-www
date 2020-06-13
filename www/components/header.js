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
          <span className="text-lg ml-2">Kategorije</span>
        </button>
        <div className="flex items-center">
          <Link href="/">
            <a className="mr-4">
              <img src="/img/logo.png" alt="Amadeus II" className="h-8" />
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
          <span className="text-lg ml-2">Košarica</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
