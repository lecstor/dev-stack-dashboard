import React, { FC } from "react";
import {
  Avatar,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/core";

const AccountMenu: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Menu>
      <MenuButton>
        <Avatar size="sm" />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={toggleColorMode}>
          Switch to {colorMode === "light" ? "dark" : "light"} mode
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AccountMenu;
