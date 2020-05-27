import Head from "next/head";
import useSWR from "swr";
import Link from "next/link";
import {
  Link as ChakraLink,
  Icon,
  List,
  ListItem,
  Box,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/core";

const fetcher = (url) => fetch(url).then((r) => r.json());

function TreeNav({ categories }) {
  return (
    <Accordion allowMultiple>
      {categories &&
        categories
          .sort((a, b) => a.Products.length < b.Products.length)
          .map((c) => {
            return <TreeNavItem category={c} />;
          })}
    </Accordion>
  );
}

function TreeNavItem({ category }) {
  return (
    <AccordionItem>
      <AccordionHeader>
        <Box flex="1" textAlign="left">
          {category.Name}
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  );
}

function Index() {
  const { data: categories, error } = useSWR(
    "http://localhost:8080/categories/",
    fetcher
  );

  if (error) return <div>404 TODO</div>;
  if (!categories) return <div>loading...</div>;

  const ctgs = [];

  categories.forEach((c) => {
    c.Categories.forEach((cc) => {
      if (!ctgs.filter((c) => c.Slug === cc.Slug).length) {
        ctgs.push({
          Name: cc.Name,
          Slug: cc.Slug,
          Children: [],
        });
      }
    });
  });

  return (
    <div className="container">
      <Head>
        <title>Amadeus</title>
      </Head>

      <Icon name="search" color="red.500" />
      <h1>amadeus2.hr</h1>

      <pre>DEBUG: {JSON.stringify(ctgs, null, 2)}</pre>

      <h2>---</h2>

      <TreeNav categories={categories} />

      <h2>---</h2>

      <List>
        {categories &&
          categories
            .filter((c) => c.Slug !== "amadeus-ii-shop")
            .sort((a, b) => a.Products.length < b.Products.length)
            .slice(0, 8)
            .map((c) => {
              return (
                <ListItem key={c.ID}>
                  <Link href={c.Slug}>
                    <ChakraLink href={c.Slug}>
                      {c.Name} {c.Products.length}{" "}
                      {JSON.stringify(c.Categories, null, 2)}
                    </ChakraLink>
                  </Link>
                </ListItem>
              );
            })}
      </List>

      <List>
        {categories &&
          categories
            .filter((c) => c.Slug === "amadeus-ii-shop")[0]
            .Products.map((p) => {
              return (
                <ListItem key={p.ID}>
                  <Link href={p.URL}>
                    <ChakraLink href={p.URL}>{p.Name}</ChakraLink>
                  </Link>
                </ListItem>
              );
            })}
      </List>
    </div>
  );
}

export default Index;
