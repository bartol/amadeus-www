import { useEffect } from "react";
import Router from "next/router";
import Head from "next/head";

function Static({ children, title, menuOpened }) {
  useEffect(() => {
    if (menuOpened) {
      Router.push("/");
    }
  }, [menuOpened]);

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>{title} &ndash; Amadeus II d.o.o. shop</title>
      </Head>
      <div className="content max-w-2xl mx-auto mt-12">{children}</div>
    </div>
  );
}

export default Static;
