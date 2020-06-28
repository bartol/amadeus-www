import { X } from "react-feather";
import Router from "next/router";
import { useRef } from "react";

function SearchBox({ query, setQuery, fullWidth }) {
  const inputRef = useRef(null);

  return (
    <div className="relative">
      <input
        type="text"
        className={`input ~neutral !normal ${fullWidth ? "w-full" : "w-auto"} px-3 text-xl`}
        placeholder="Pretraži proizvode"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputRef}
        onKeyUp={(e) => {
          if (e.keyCode === 13) {
            Router.push(`/search?q=${encodeURIComponent(query)}`);
            inputRef.current.blur();
          }
        }}
      />
      <div
        className="absolute inset-y-0 right-0 flex items-center mr-2"
        style={{ visibility: query ? "visible" : "hidden" }}
      >
        <button type="button" className="button ~neutral !normal p-1" onClick={() => setQuery("")}>
          <X />
        </button>
      </div>
    </div>
  );
}

export default SearchBox;
