import React, { FC } from "react";
import { Flex, useColorModeValue } from "@chakra-ui/core";
import AccountMenu from "./AccountMenu";

const TitleBar: FC = () => {
  const bg = useColorModeValue("blue.200", "blue.900");
  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        py={1}
        px={2}
        bg={bg}
      >
        <div />
        <AccountMenu />
      </Flex>
    </>
  );
};

export default TitleBar;
