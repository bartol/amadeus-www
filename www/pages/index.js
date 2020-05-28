import { useRef } from "react";
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
  Drawer,
  useDisclosure,
  Button,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Input,
} from "@chakra-ui/core";

const fetcher = (url) => fetch(url).then((r) => r.json());

function createNode(path, tree) {
  const name = path.shift();
  const idx = tree.findIndex((e) => {
    return e.name == name;
  });
  if (idx < 0) {
    tree.push({
      name: name,
      children: [],
    });
    if (path.length !== 0) {
      createNode(path, tree[tree.length - 1].children);
    }
  } else {
    createNode(path, tree[idx].children);
  }
}

function getTree(categories) {
  const tree = [];
  for (let i = 0; i < categories.length; i++) {
    const path = categories[i];
    const split = path.Categories.map((c) => c.Slug);
    createNode(split, tree);
  }
  return tree;
}

function TreeNav({ categories }) {
  return (
    <Accordion allowMultiple>
      {categories &&
        categories
          // .sort((a, b) => a.Products.length < b.Products.length)
          .map((c) => {
            return <TreeNavItem category={c} />;
          })}
    </Accordion>
  );
}

function TreeNavItem({ category }) {
  return category.children.length ? (
    <AccordionItem>
      <AccordionHeader>
        <Box flex="1" textAlign="left">
          {category.name}
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        {category.children.map((cc) => (
          <TreeNavItem category={cc} />
        ))}
      </AccordionPanel>
    </AccordionItem>
  ) : (
    <Box px={4} py={2}>
      <Link href={`/${category.name}`}>
        <ChakraLink href={category.name}>{category.name}</ChakraLink>
      </Link>
    </Box>
  );
}

function Index() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

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

  var tree = getTree(categories);

  return (
    <div className="container">
      <Head>
        <title>Amadeus</title>
      </Head>

      <Icon name="search" color="red.500" />
      <h1>amadeus2.hr</h1>

      <Button ref={btnRef} variantColor="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Proizvodi</DrawerHeader>

          <DrawerBody>
            <TreeNav categories={tree[0].children} />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <h2>---</h2>

      <pre>DEBUG: {JSON.stringify(tree, null, 2)}</pre>
      {/* <pre>DEBUG: {JSON.stringify(categories, null, 2)}</pre> */}

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
