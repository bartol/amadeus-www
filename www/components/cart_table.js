import CartRow from "./cart_row";
import { getTotal, getPrice } from "../helpers/price";

function CartTable({ cart, setCart, setScroll, tableRef }) {
  if (!cart.length) {
    return <div>Vaša košarica je prazna.</div>;
  }

  return (
    <div>
      <div
        className="overflow-x-auto"
        ref={tableRef}
        onScroll={() => {
          setScroll(tableRef.current.scrollLeft);
        }}
      >
        <table
          className="table"
          style={{ minWidth: "calc(550px - 2.5rem)" /* sm breakpoint - margin */ }}
        >
          <thead>
            <tr>
              <th colSpan="2">Proizvod</th>
              <th>Cijena</th>
              <th colSpan="2">Količina</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((p) => {
              return <CartRow product={p} setCart={setCart} key={p.ID} />;
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2" />
              <th colSpan="2">
                <div className="sm:block hidden">
                  <TotalTable cart={cart} />
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="w-2/3 sm:hidden">
        <TotalTable cart={cart} />
      </div>
    </div>
  );
}

const TotalTable = ({ cart }) => {
  return (
    <table className="table font-normal mt-1" style={{ color: "var(--color-content)" }}>
      <tbody>
        <tr>
          <td className="px-0 py-px">Proizvodi:</td>
          <td className="px-0 py-px">{getPrice(getTotal(cart, true) * 0.75)}</td>
        </tr>
        <tr>
          <td className="px-0 py-px">Porez:</td>
          <td className="px-0 py-px">{getPrice(getTotal(cart, true) * 0.25)}</td>
        </tr>
        <tr>
          <td className="px-0 py-px">Dostava:</td>
          <td className="px-0 py-px">{getPrice(0)}</td>
        </tr>
        <tr className="font-bold">
          <td className="px-0 py-px">Ukupno:</td>
          <td className="px-0 py-px">{getTotal(cart)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CartTable;
