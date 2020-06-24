import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPrice, getReductedPrice, getReduction } from "../../helpers/price";
import { cartAdd } from "../../helpers/cart";
import { ShoppingCart } from "react-feather";
import Menu from "../../components/menu";
import Info from "../../components/info";
import Glider from "glider-js";

function Product({ product, categoriesTree, setCart, menuOpened, setMenuOpened, dispatchAlert }) {
  const p = product;

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

  const [quantity, setQuantity] = useState(1);

  return (
    <div className="container mx-auto px-4">
      <h1 className="heading text-4xl mt-12 mb-5">{p.Name}</h1>
      <div className="flex">
        <div className="w-1/2">
          <div className="relative" style={{ paddingBottom: "100%" }}>
            <div className="card ~neutral !low absolute w-full h-full">
              <div ref={gliderRef} className="glider-wrap h-full">
                {p.Images.map((i) => {
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
            </div>
          </div>
          <div className="flex mt-4">
            {p.Images.map((img, index) => {
              return (
                <button
                  type="button"
                  onClick={() => {
                    if (p.Images.length > 1) {
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
        <div className="w-1/2 m-5">
          <div className="card ~neutral !low">
            <div>
              <h4 className={`${p.HasReduction ? "line-through" : "subheading font-bold"}`}>
                {getPrice(p.Price)}
              </h4>
              {p.HasReduction && (
                <div className="flex">
                  <h4 className="subheading font-bold">
                    {getReductedPrice(p.Price, p.Reduction, p.ReductionType)}
                  </h4>
                  <h4 className="subheading">{getReduction(p.Reduction, p.ReductionType)}</h4>
                </div>
              )}
            </div>
            {!p.OutOfStock ? (
              <div className="flex items-end">
                <button
                  type="button"
                  className="button ~positive !normal justify-center flex-grow px-3 py-2"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      cartAdd(setCart, p);
                    }
                    dispatchAlert("Proizvod dodan u košaricu", "positive", ShoppingCart);
                  }}
                >
                  <ShoppingCart />
                  <span className="text-lg ml-2">Dodaj u košaricu</span>
                </button>
                <div className="flex flex-col ml-4">
                  <span>Količina</span>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value | 0)}
                    min="1"
                    className="input ~neutral !normal w-16 mb-px"
                  />
                </div>
              </div>
            ) : (
              <div className="button ~critical !normal w-full justify-center text-lg px-3 py-2">
                Proizvod trenutno nije dostupan
              </div>
            )}
          </div>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: p.Description }} className="content"></div>
      <pre>DEBUG: {JSON.stringify(p, null, 2)}</pre>
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
