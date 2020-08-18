import React, { FC, ReactElement } from "react";
import { Box, Code } from "@chakra-ui/core";

import { FaArrowDown, FaArrowUp, FaArrowCircleDown } from "react-icons/fa";

import { GitStatus } from "../../../types";

import formatSinceLastFetch from "../formatSinceLastFetch";

import OriginCommits from "../components/OriginCommits";

type Props = {
  branch?: string;
  gitCommitsBehindMaster?: number;
  gitStatus?: GitStatus;
  label: string | ReactElement;
  lastFetch?: number;
};

const GitServicePanel: FC<Props> = ({
  gitCommitsBehindMaster,
  gitStatus,
  branch,
  lastFetch,
  label,
}) => {
  return (
    <Box ml={8}>
      <Box>
        {label}{" "}
        {branch ? (
          <>
            on branch <Code>{branch}</Code>
          </>
        ) : null}
      </Box>
      {gitStatus ? (
        <>
          {gitCommitsBehindMaster ? (
            <OriginCommits
              type="behind"
              icon={<FaArrowCircleDown />}
              count={gitCommitsBehindMaster}
              branch="master"
            />
          ) : null}
          <OriginCommits
            type="behind"
            icon={<FaArrowDown />}
            count={gitStatus.behind}
            branch={branch}
          />
          <OriginCommits
            type="ahead"
            icon={<FaArrowUp />}
            count={gitStatus.ahead}
            branch={branch}
          />
        </>
      ) : null}
      {lastFetch ? (
        <div>Last fetch: over {formatSinceLastFetch(lastFetch)} ago</div>
      ) : null}
    </Box>
  );
};

export default GitServicePanel;
