import * as React from "react";
import { Button, View, StyleSheet } from "react-native";
import { DefaultTheme, useNavigation } from "@react-navigation/native";
import { Appbar, Menu } from "react-native-paper";
import { useAppContext } from "../Session/Datos";

export default function Cabecera({ isHome, title }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();
  const navigation = useNavigation();
  return (
    <Appbar.Header theme={isAuthenticated.tipo === 1 ? themeAdmin : themeUser}>
      <Menu
        anchor={
          isHome ? (
            <Appbar.Action
              icon="menu"
              color="white"
              onPress={() => navigation.openDrawer()}
            />
          ) : (
            <Appbar.Action
              icon="arrow-left"
              color="white"
              onPress={() => navigation.goBack()}
            />
          )
        }
      ></Menu>

      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

const themeUser = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.color,
    primary: "#7c07ad",
    accent: "#f1c40f",
  },
};
const themeAdmin = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.color,
    primary: "#08213e",
    accent: "#f1c40f",
  },
};
