import { useEffect } from "react";
import Router from "next/router";
import SEO from "./seo";

function Static({ children, title, menuOpened }) {
  useEffect(() => {
    if (menuOpened) {
      Router.push("/");
    }
  }, [menuOpened]);

  return (
    <div className="container mx-auto px-4">
      <SEO
        title={`${title} | Amadeus II d.o.o. shop`}
        description={`${title} | Amadeus II d.o.o. info stranica`}
      />
      <div className="content max-w-2xl mx-auto mt-12">{children}</div>
    </div>
  );
}

export default Static;
