import SEO from "../components/seo.js";
import Link from "next/link";
import { ArrowLeft } from "react-feather";

function NotFound() {
  return (
    <div className="container mx-auto px-4">
      <SEO
        title="Stranica nije pronađena | Amadeus II d.o.o. shop"
        description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
      />
      <h1 className="heading text-4xl mt-12 mb-5">Stranica nije pronađena</h1>
      <Link href="/">
        <a className="button ~neutral !normal px-3 py-2 max-w-full">
          <ArrowLeft />
          <span className="text-lg ml-2 truncate">Povratak na početnu stranicu</span>
        </a>
      </Link>
    </div>
  );
}

export default NotFound;
