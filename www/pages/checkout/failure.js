import SEO from "../../components/seo";
import { XCircle } from "react-feather";

function Failure() {
  return (
    <div className="container mx-auto px-4">
      <SEO
        title="Amadeus II d.o.o. shop"
        description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
      />
      <div className="flex sm:flex-row flex-col justify-center mt-12">
        <div className="w-20 h-20 text-red-500 mr-5">
          <XCircle width="100%" height="100%" />
        </div>
        <div>
          <h1 className="heading text-4xl sm:mt-0 mt-4 mb-1">Pogreška prilikom obrade narudžbe</h1>
          <p className="ml-px">
            Molimo pokušajte ponovo ili nas kontaktirajte na{" "}
            <a href="mailto:amadeus@pioneer.hr" className="portal p-0">
              amadeus@pioneer.hr
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Failure;
