import React, { FC } from "react";
import {
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/core";
import { FaCog } from "react-icons/fa";

const AccountMenu: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Menu>
      <MenuButton>
        <FaCog />
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
