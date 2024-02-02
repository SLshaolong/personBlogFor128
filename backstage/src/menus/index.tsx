import React from "react";
import { ProfileOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("settings", "/setting", <SettingOutlined />),
  getItem("blogs", "/blogs", <ProfileOutlined />),
];
// 初始化 navigate

export default function index() {
  const naviagte = useNavigate();
  const onClick: MenuProps["onClick"] = (e) => {
    naviagte(e.key);
  };
  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      defaultSelectedKeys={["/setting"]}
      defaultOpenKeys={["/setting"]}
      mode="inline"
      items={items}
    />
  );
}
