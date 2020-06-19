import { useState, useEffect } from "react";
import { ShoppingCart } from "react-feather";

function Alert({ message, id, removeAlert }) {
  const total = 5000;
  const step = 100;
  const [timer, setTimer] = useState(total);

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - step), step);
      return;
    }
    removeAlert(id);
  }, [timer]);

  return (
    <li className="mt-3">
      <button
        type="button"
        onClick={() => removeAlert(id)}
        className="card ~positive !normal flex items-center"
        style={{
          color: "var(--color-positive-normal-content)",
          backgroundColor: "var(--color-positive-normal-fill)",
        }}
      >
        <ShoppingCart />
        <span className="text-lg ml-3">{message}</span>
      </button>
    </li>
  );
}

export default Alert;
