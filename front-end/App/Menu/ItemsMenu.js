import React, { Component } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Divider } from "react-native-paper";
import { useAppContext } from "../Session/Datos";

export default function ItemsMenu({ navigation }) {
  //variable de sesion
  const { userHasAuthenticated, isAuthenticated } = useAppContext();
  const imagePerfil = {
    uri: isAuthenticated.foto,
  };
  const metodoSalir = () => {
    userHasAuthenticated(false);
    navigation.navigate("InicioApp");
  };
  const metodoRegistar = () => {
    navigation.navigate("Registro");
  };
  const metodoLogin = () => {
    navigation.navigate("Login");
  };
  const metodoPerfil = () => {
    navigation.navigate("Perfil");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <View style={{ height: "3%" }}></View>
      {isAuthenticated.tipo === 1 ? (
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{
                uri:
                  "http://www.facish.com/img/icones/23938578fb8d88c02bc59906d12230f3.png",
              }}
              style={styles.perfilImg}
            />
          </View>
          <Button
            icon="database-plus"
            color="#08213e"
            onPress={() => {
              navigation.navigate("GestionProductos", {});
            }}
          >
            Gestionar Productos
          </Button>
          <Button
            icon="history"
            color="#08213e"
            onPress={() => {
              navigation.navigate("GestionCompras", {});
            }}
          >
            Historial de  Compras
          </Button>
        </ScrollView>
      ) : (
        <ScrollView>
          {isAuthenticated ? (
            <View style={{ alignItems: "center" }}>
              <Image source={imagePerfil} style={styles.perfilImg} />
              <Button
                icon="account"
                width={"100%"}
                onPress={() => metodoPerfil()}
              >
                PERFIL
              </Button>
              <Button icon="history" width={"100%"} onPress={() => navigation.navigate("HistorialCompras", {})}>
                Mis Compras
              </Button>
            </View>
          ) : (
            <View>
              <Button icon="account-plus" onPress={() => metodoRegistar()}>
                Registro
              </Button>
              <Button icon="login" onPress={() => metodoLogin()}>
                Login
              </Button>
              <Divider />
            </View>
          )}
          <Button icon="home" onPress={() => navigation.navigate("Inicio", {})}>
            Inicio
          </Button>
          <Button
            icon="tag"
            onPress={() => navigation.navigate("Categorias", {})}
          >
            Categorias
          </Button>
          <Button
            icon="book-open-page-variant"
            onPress={() =>
              navigation.navigate("Productos", {
                itemId: undefined,
                itemName: undefined,
              })
            }
          >
            Productos
          </Button>
          {isAuthenticated ? (
            <Button
              icon="cart"
              width={"100%"}
              onPress={() =>
                navigation.navigate("Carrito", {
                  itemId: undefined,
                  itemName: undefined,
                })
              }
            >
              MI CARRITO
            </Button>
          ) : null}
        </ScrollView>
      )}

      <Button
        icon="exit-run"
        color="#991343"
        mode="contained"
        onPress={() => metodoSalir()}
      >
        Salir
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  perfilImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});
