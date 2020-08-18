import React, { FC } from "react";
import { FaBuilding } from "react-icons/fa";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from "@chakra-ui/core";

import { DockerPsContainer } from "../../../types";

import GitServiceHeader from "../components/GitServiceHeader";
import GitServicePanel from "../components/GitServicePanel";

import useManageGit from "../useManageGit";

type Props = {
  name: string;
  path: string;
  dockerPs?: DockerPsContainer;
};

const ServiceBuild: FC<Props> = ({ dockerPs, name, path, ...props }) => {
  const {
    branch,
    gitCommitsBehindMaster,
    gitStatus,
    lastFetch,
  } = useManageGit({ name, path });

  return (
    <AccordionItem {...props}>
      <AccordionButton>
        <Flex flex="1" textAlign="left" alignItems="center" flexDirection="row">
          {name}
        </Flex>
        <GitServiceHeader
          branch={branch}
          gitCommitsBehindMaster={gitCommitsBehindMaster}
          gitStatus={gitStatus}
        />
        <Box mr={4} minWidth="5rem">
          {dockerPs?.state}
        </Box>
        <Box mr={4}>
          <FaBuilding />
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <GitServicePanel
          branch={branch}
          gitCommitsBehindMaster={gitCommitsBehindMaster}
          gitStatus={gitStatus}
          label={
            <span>
              <FaBuilding
                style={{
                  display: "inline-block",
                  verticalAlign: "text-bottom",
                }}
              />{" "}
              Build of local source
            </span>
          }
          lastFetch={lastFetch}
        />
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ServiceBuild;
