import React, { FC } from "react";
import { Box, Code } from "@chakra-ui/core";
import { FaArrowDown, FaArrowUp, FaArrowCircleDown } from "react-icons/fa";

import { GitStatus } from "../../../types";

import Commits from "../components/Commits";

type Props = {
  branch?: string;
  gitCommitsBehindMaster?: number;
  gitStatus?: GitStatus;
};

const getBehindColor = (count?: number) => {
  let color: string | undefined;
  let backgroundColor: string | undefined;

  if (count) {
    // backgroundColor = "#2D3748";
    if ((count || 0) > 3) {
      color = "#f44336"; // "#ffc107";
    } else {
      color = "#ff9800"; // "#ffeb3b";
    }
  }
  return { color, backgroundColor };
};

const GitServiceHeader: FC<Props> = ({
  branch,
  gitCommitsBehindMaster,
  gitStatus,
}) => {
  return (
    <>
      {branch ? (
        <Box mr={4}>
          <Code>{branch}</Code>
        </Box>
      ) : null}
      {gitStatus ? (
        <>
          {gitCommitsBehindMaster !== undefined ? (
            <Code mr={4}>
              <Commits
                icon={<FaArrowCircleDown />}
                count={gitCommitsBehindMaster}
                {...getBehindColor(gitCommitsBehindMaster)}
                borderRadius="3px"
                px={1}
              />
            </Code>
          ) : null}
          <Code mr={4}>
            <Commits
              icon={<FaArrowDown />}
              count={gitStatus.behind}
              {...getBehindColor(gitStatus.behind)}
              borderRadius="3px"
              px={1}
            />
            <Commits icon={<FaArrowUp />} count={gitStatus.ahead} />
          </Code>
        </>
      ) : null}
    </>
  );
};

export default GitServiceHeader;
