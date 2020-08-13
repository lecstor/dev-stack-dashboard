import React, { FC } from "react";
import { Code, Flex } from "@chakra-ui/core";
import Commits, { CommitsProps } from "./Commits";

const OriginCommits: FC<CommitsProps & { type: string }> = ({
  count,
  type,
  icon,
  branch,
  ...props
}) => {
  const commits = `commit${count !== 1 ? "s" : ""}`;
  let label = "";
  if (type === "ahead") {
    label = "ahead of ";
  } else {
    label = "behind ";
  }
  return (
    <Flex flexDirection="row" alignItems="center" {...props}>
      <Commits count={count} icon={icon} mr={2} />{" "}
      <span>
        {commits} {label} <Code>origin/{branch}</Code>
      </span>
    </Flex>
  );
};

export default OriginCommits;
