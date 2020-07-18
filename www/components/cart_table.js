import CartRow from "./cart_row";
import { getTotal, getPrice } from "../helpers/price";

function CartTable({ cart, setCart, order, setScroll, tableRef }) {
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
              <th colSpan="3">
                <div className="sm:block hidden">
                  <TotalTable cart={cart} order={order} />
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="w-2/3 sm:hidden">
        <TotalTable cart={cart} order={order} />
      </div>
    </div>
  );
}

const TotalTable = ({ cart, order }) => {
  return (
    <table
      className="table font-normal mt-1"
      style={{
        color: "var(--color-content)",
        "--table-background-alternating": "var(--color-transparent)",
      }}
    >
      <tbody>
        <tr>
          <td className="px-0 py-px">Proizvodi:</td>
          <td className="px-0 py-px">{getPrice(getTotal(cart) * 0.75)}</td>
        </tr>
        <tr>
          <td className="px-0 py-px">PDV:</td>
          <td className="px-0 py-px">{getPrice(getTotal(cart) * 0.25)}</td>
        </tr>
        {order.paymentMethod === "kartica" && parseInt(order.installments) > 0 && (
          <tr>
            {parseInt(order.installments) < 13 ? (
              <>
                <td className="px-0 py-px">Rate (2-12):</td>
                <td className="px-0 py-px">{getPrice(getTotal(cart) * 0.08)}</td>
              </>
            ) : (
              <>
                <td className="px-0 py-px">Rate (13-24):</td>
                <td className="px-0 py-px">{getPrice(getTotal(cart) * 0.1)}</td>
              </>
            )}
          </tr>
        )}
        <tr>
          <td className="px-0 py-px">Dostava:</td>
          <td className="px-0 py-px">{getPrice(0)}</td>
        </tr>
        <tr className="font-bold">
          <td className="px-0 py-px">Ukupno:</td>
          <td className="px-0 py-px">
            {getPrice(
              getTotal(cart) *
                (parseInt(order.installments) > 0
                  ? parseInt(order.installments) < 13
                    ? 1.08
                    : 1.1
                  : 1)
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default CartTable;
