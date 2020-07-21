import SEO from "../components/seo";
import { useState } from "react";

function Failure() {
  const [message, setMessage] = useState("");

  return (
    <div className="container mx-auto px-4">
      <SEO
        title="Amadeus II d.o.o. shop"
        description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
      />
      <div className="mt-12">
        <button
          type="button"
          onClick={async () => {
            if (message === "loading...") return;

            setMessage("loading...");
            const data = await fetch("https://api.amadeus2.hr/reindex/");
            const res = await data.text();
            setMessage(res);
          }}
          className="button ~neutral !normal mr-2"
        >
          ažuriraj proizvode
        </button>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Failure;
