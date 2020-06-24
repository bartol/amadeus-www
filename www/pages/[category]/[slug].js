import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Menu from "../../components/menu";
import Info from "../../components/info";
import Glider from "glider-js";

function Product({ product, categoriesTree, menuOpened, setMenuOpened, dispatchAlert }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const gliderRef = useRef(null);
  const [glider, setGlider] = useState({});
  const [selectedSlide, setSelectedSlide] = useState(0);
  useEffect(() => {
    if (!gliderRef.current) {
      return;
    }

    const glider = new Glider(gliderRef.current, {
      draggable: true,
      dragVelocity: 2,
    });
    setGlider(glider);

    gliderRef.current.addEventListener("glider-slide-visible", (e) => {
      setSelectedSlide(e.detail.slide);
    });
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="heading text-4xl mt-12 mb-5">{product.Name}</h1>
      <div className="flex">
        <div className="w-1/2">
          <div className="relative" style={{ paddingBottom: "100%" }}>
            <div className="card ~neutral !low absolute w-full h-full">
              {product.Images.length > 1 ? (
                <div ref={gliderRef} className="glider-wrap">
                  {product.Images.map((i) => {
                    return (
                      <img
                        src={i.URL + "?options=150,quality=low"}
                        data-src={i.URL + "?options=600"}
                        alt="slika proizvoda"
                        className="lazyload object-contain"
                        key={i.URL}
                      />
                    );
                  })}
                </div>
              ) : (
                <img
                  src={product.Images[0].URL + "?options=150,quality=low"}
                  data-src={product.Images[0].URL + "?options=600"}
                  alt="slika proizvoda"
                  className="lazyload h-full object-contain"
                />
              )}
            </div>
          </div>
          <div className="flex mt-4">
            {product.Images.map((img, index) => {
              return (
                <button
                  type="button"
                  onClick={() => {
                    if (product.Images.length > 1) {
                      glider.scrollItem(index);
                      setSelectedSlide(index);
                    }
                  }}
                  className={`mr-1 ${selectedSlide === index ? "border-4 rounded" : "px-1"}`}
                  key={img.URL}
                >
                  <div className="relative w-16 h-16 bg-white">
                    <img
                      src={img.URL + "?options=25,quality=low"}
                      data-src={img.URL + "?options=80"}
                      alt="slika proizvoda"
                      className="lazyload absolute w-full h-full object-contain"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-1/2">2nd half</div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: product.Description }} className="content"></div>
      <pre>DEBUG: {JSON.stringify(product, null, 2)}</pre>
      <Info dispatchAlert={dispatchAlert} />
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://api.amadeus2.hr/products/");
  const products = await res.json();
  const paths = products.map((p) => {
    return {
      params: {
        category: p.Categories[p.Categories.length - 1].Slug,
        slug: p.Slug,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const productRes = await fetch(
    `https://api.amadeus2.hr/products/${params.category}/${params.slug}`
  );
  const product = await productRes.json();

  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      product,
      categoriesTree,
    },
  };
}

export default Product;
