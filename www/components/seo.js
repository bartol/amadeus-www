import Head from "next/head";

function SEO({ title }) {
  return <Head>{title && <title>{title}</title>}</Head>;
}

export default SEO;
