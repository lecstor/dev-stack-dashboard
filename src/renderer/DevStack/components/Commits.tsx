import React, { FC, ReactElement } from "react";
import { Flex, FlexProps, Text } from "@chakra-ui/core";

export type CommitsProps = {
  count: number;
  branch?: string | null;
  icon: ReactElement;
} & FlexProps;

const Commits: FC<CommitsProps> = ({ count, icon, ...props }) => {
  return (
    <Flex
      display="inline-flex"
      alignItems="center"
      {...props}
      minWidth="3rem"
      justifyContent="center"
    >
      {icon}
      <Text as="span" ml={1} fontWeight="bold">
        {count}
      </Text>
    </Flex>
  );
};

export default Commits;
