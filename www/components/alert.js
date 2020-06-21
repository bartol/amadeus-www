import { useState, useEffect } from "react";

function Alert({ message, id, colorClass, Icon, removeAlert }) {
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
        className={`card ~${colorClass} !normal flex items-center`}
        style={{
          color: `var(--color-${colorClass}-normal-content)`,
          backgroundColor: `var(--color-${colorClass}-normal-fill)`,
        }}
      >
        <Icon />
        <span className="text-lg ml-3">{message}</span>
      </button>
    </li>
  );
}

export default Alert;
