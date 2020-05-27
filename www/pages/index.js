import Head from "next/head";
import { Icon, Box } from "@chakra-ui/core";

function Index() {
  return (
    <div className="container">
      <Head>
        <title>Amadeus</title>
      </Head>

      <Icon name="search" color="red.500" />
      <h1>Amadeus2.hr</h1>

      <Box
        height="40px"
        bg="teal.400"
        width={[
          "100%", // base
          "50%", // 480px upwards
          "25%", // 768px upwards
          "15%", // 992px upwards
        ]}
      />
      {/* responsive font size */}
      <Box fontSize={["sm", "md", "lg", "xl"]}>Font Size</Box>
      {/* responsive margin */}
      <Box mt={[2, 4, 6, 8]} width="full" height="24px" bg="tomato" />
      {/* responsive padding */}
      <Box bg="papayawhip" p={[2, 4, 6, 8]}>
        Padding
      </Box>
    </div>
  );
}

export default Index;
