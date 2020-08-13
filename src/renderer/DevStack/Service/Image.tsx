import React, { FC } from "react";
import { FaImage } from "react-icons/fa";
import {
  Box,
  Flex,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/core";

import { DockerPsContainer } from "../../../types";

type Props = {
  name: string;
  dockerPs?: DockerPsContainer;
};

const ServiceImage: FC<Props> = ({ dockerPs, name, ...props }) => {
  return (
    <AccordionItem {...props}>
      <AccordionButton>
        <Flex flex="1" textAlign="left" alignItems="center" flexDirection="row">
          {name}
        </Flex>
        <Box mr={4} minWidth="5rem">
          {dockerPs?.state}
        </Box>
        <Box mr={4}>
          <FaImage />
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Box ml={8}>
          <Box>
            <FaImage
              style={{
                display: "inline-block",
                verticalAlign: "text-bottom",
              }}
            />{" "}
            Image pulled from production
          </Box>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ServiceImage;
