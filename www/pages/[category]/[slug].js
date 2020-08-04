import { useRef, useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { getPrice, getReductedPrice, getReduction } from "../../helpers/price";
import { cartAdd } from "../../helpers/cart";
import { ShoppingCart } from "react-feather";
import Menu from "../../components/menu";
import Info from "../../components/info";
import ProductCard from "../../components/product_card";
import SEO from "../../components/seo.js";
import Glider from "glider-js";
import Link from "next/link";

function Product({
  product,
  similarProducts,
  categoriesTree,
  setCart,
  menuOpened,
  setMenuOpened,
  setCartOpened,
  dispatchAlert,
}) {
  const p = product;

  const router = useRouter();
  if (router.isFallback) {
    return <div className="container mx-auto px-4">Loading...</div>;
  }

  const gliderContainerRef = useRef(null);
  const gliderRef = useRef(null);
  const [selectedSlide, setSelectedSlide] = useState(0);
  useEffect(() => {
    if (!gliderContainerRef.current) {
      return;
    }

    const glider = new Glider(gliderContainerRef.current, {
      draggable: true,
      dragVelocity: 2,
      skipTrack: true,
    });
    gliderRef.current = glider;

    gliderContainerRef.current.addEventListener("glider-slide-visible", (e) => {
      setSelectedSlide(e.detail.slide);
    });
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [installments, setInstallments] = useState("2");

  return (
    <div className="container mx-auto px-4">
      <SEO
        title={`${p.Name}, samo ${
          p.HasReduction
            ? getReductedPrice(p.Price, p.Reduction, p.ReductionType)
            : getPrice(p.Price)
        } | Amadeus II d.o.o. shop`}
        description={
          p.Name +
          " | " +
          p.Categories[p.Categories.length - 1].Name +
          p.Features.map((f) => " | " + f.Name + ": " + f.Value)
        }
        image={p.DefaultImage.URL}
        path={p.URL}
        breadcrumbs={[
          { Name: "Početna", Slug: "" },
          ...p.Categories.filter((c) => c.Slug !== "home"),
          { Name: p.Name },
        ]}
        product={p}
      />
      <div className="flex flex-wrap">
        <div>
          <Link href="/">
            <a className="portal">Početna</a>
          </Link>
          <span> / </span>
        </div>
        {p.Categories.filter((c) => c.Slug !== "home").map((c) => (
          <Fragment key={c.Slug}>
            <div>
              <Link href="/[category]" as={"/" + c.Slug}>
                <a className="portal">{c.Name}</a>
              </Link>
              <span> / </span>
            </div>
          </Fragment>
        ))}
        <span className="portal whitespace-normal select-none lg:block hidden">{p.Name}</span>
      </div>
      <h1 className="heading text-4xl mt-12 mb-5">{p.Name}</h1>
      <div className="flex md:flex-row flex-col">
        <div className="md:w-1/2">
          <div className="relative pb-full">
            <div className="card ~neutral !low absolute w-full h-full">
              <div ref={gliderContainerRef} className="glider-wrap h-full">
                <div className="glider-track h-full">
                  {p.Images.map((i) => {
                    return (
                      <img
                        src={i.URL + "?options=150,quality=low"}
                        data-src={i.URL + "?options=600"}
                        alt="slika proizvoda"
                        className="lazyload w-full h-full object-contain"
                        key={i.URL}
                      />
                    );
                  })}
                </div>
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
                      gliderRef.current.scrollItem(index);
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
        <div className="md:w-1/2 md:mx-4 md:mt-0 mt-5">
          <div className="card ~neutral !low">
            <div className="mb-4">
              <div className="font-bold mb-2">Cijena za jednokratno plaćanje:</div>
              {p.HasReduction && "MPC: "}
              <h4
                className={`${
                  p.HasReduction ? "line-through inline" : "subheading font-bold lg:text-4xl"
                }`}
              >
                {getPrice(p.Price)}
              </h4>
              {p.HasReduction && (
                <div className="flex justify-between items-center">
                  <h4 className="subheading font-bold lg:text-4xl">
                    {getReductedPrice(p.Price, p.Reduction, p.ReductionType)}
                  </h4>
                  <h4
                    className="subheading lg:text-2xl rounded px-2"
                    style={{
                      color: "var(--color-critical-normal-content)",
                      backgroundColor: "var(--color-critical-normal-fill)",
                    }}
                  >
                    {getReduction(p.Reduction, p.ReductionType)}
                  </h4>
                </div>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <span className="font-bold mb-2 ml-1">Cijena za plaćanje na rate:</span>
              <div className="flex-grow">
                <div className="flex items-center">
                  <div className="select !normal flex-grow">
                    <select value={installments} onChange={(e) => setInstallments(e.target.value)}>
                      <option value="2">2 rate</option>
                      <option value="3">3 rate</option>
                      <option value="4">4 rate</option>
                      <option value="5">5 rata</option>
                      <option value="6">6 rata</option>
                      <option value="7">7 rata</option>
                      <option value="8">8 rata</option>
                      <option value="9">9 rata</option>
                      <option value="10">10 rata</option>
                      <option value="11">11 rata</option>
                      <option value="12">12 rata</option>
                      <option value="13">13 rata</option>
                      <option value="14">14 rata</option>
                      <option value="15">15 rata</option>
                      <option value="16">16 rata</option>
                      <option value="17">17 rata</option>
                      <option value="18">18 rata</option>
                      <option value="19">19 rata</option>
                      <option value="20">20 rata</option>
                      <option value="21">21 rata</option>
                      <option value="22">22 rate</option>
                      <option value="23">23 rate</option>
                      <option value="24">24 rate</option>
                    </select>
                  </div>
                  <span className="mr-1 ml-3">
                    {getPrice(
                      ((p.HasReduction
                        ? getReductedPrice(p.Price, p.Reduction, p.ReductionType, true)
                        : p.Price) *
                        (parseInt(installments) > 0
                          ? parseInt(installments) < 13
                            ? 1.08
                            : 1.1
                          : 1)) /
                        parseInt(installments)
                    )}
                    /mj.
                  </span>
                </div>
              </div>
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
                    dispatchAlert(
                      "Proizvod dodan u košaricu",
                      "positive",
                      ShoppingCart,
                      undefined,
                      () => setCartOpened(true)
                    );
                  }}
                >
                  <ShoppingCart />
                  <span className="text-lg ml-2">Dodaj u košaricu</span>
                </button>
                <div className="flex flex-col ml-4">
                  <span className="support ml-1">Količina</span>
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
              <div className="button ~critical !normal w-full justify-center text-lg px-3 py-2 select-none">
                Proizvod trenutno nije dostupan
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex xl:flex-row flex-col">
        <div className={`${similarProducts.length > 0 ? "xl:w-3/4" : "w-full"} mr-4`}>
          {p.Features.length > 0 && (
            <div>
              <h2 className="subheading text-2xl mt-6 mb-2">Značajke</h2>
              <div className="card ~neutral !low content">
                <table className="table">
                  <tbody>
                    {p.Features.map((f) => {
                      return (
                        <tr key={f.Name}>
                          <td>{f.Name}</td>
                          <td>{f.Value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <h2 className="subheading text-2xl mt-6 mb-2">Opis</h2>
          <div className="card ~neutral !low content">
            <div dangerouslySetInnerHTML={{ __html: p.Description }}></div>
          </div>
        </div>
        {similarProducts.length > 0 && (
          <div className="xl:w-1/4">
            <h2 className="subheading text-2xl mt-6 mb-2">Slični proizvodi</h2>
            <ul className="grid xl:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              {similarProducts.map((p) => {
                return (
                  <ProductCard
                    product={p}
                    setCart={setCart}
                    setCartOpened={setCartOpened}
                    dispatchAlert={dispatchAlert}
                    key={p.ID}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
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
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const productRes = await fetch(
    `https://api.amadeus2.hr/products/${params.category}/${params.slug}`
  );
  const product = await productRes.json();

  const similarProductsRes = await fetch(`https://api.amadeus2.hr/categories/${params.category}`);
  let similarProducts = await similarProductsRes.json();
  similarProducts = similarProducts.Products.filter((p) => p.ID != product.ID)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      key: product.ID,
      product,
      similarProducts,
      categoriesTree,
    },
  };
}

export default Product;
