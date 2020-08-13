import React, { FC } from "react";

import Build from "./Build";
import Image from "./Image";
import Mount from "./Mount";
import { DockerPsContainer } from "../../../types";

type Props = {
  name: string;
  path?: string;
  state: string;
  dockerPs?: DockerPsContainer;
};

const Service: FC<Props> = ({ name, path, state, ...props }) => {
  switch (state) {
    case "build":
      return path ? (
        <Build name={name} path={path} {...props} />
      ) : (
        <>Missing Path for {name}</>
      );
    case "image":
      return <Image name={name} {...props} />;
    case "mount":
      return path ? (
        <Mount name={name} path={path} {...props} />
      ) : (
        <>Missing Path for {name}</>
      );
    default:
      return (
        <>
          Unknown state &quot;{state}&quot; for {name}
        </>
      );
  }
};

export default Service;
