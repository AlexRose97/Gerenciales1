import React, { Component } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, View, Image } from "react-native";
import { Button } from "react-native-paper";
import { useAppContext } from "../Session/Datos";

const image = {
  uri:
    //"https://i.pinimg.com/originals/bc/b8/aa/bcb8aaec6a6ea459136b28e2eac15367.jpg",
    //"https://image.freepik.com/free-vector/supermarket-logo-with-shopping-cart_23-2148470293.jpg",
    //"https://image.freepik.com/free-photo/blurred-background-blur-grocery-supermarket-shopping-mall-background_7190-2719.jpg",   
    "https://www.guatemala.com/fotos/201706/Mercado-de-Artesanias1-885x500.jpg"
  };

export default function InicioApp({ navigation }) {
  const { userHasAuthenticated } = useAppContext();
  const metodoLogin = () => {
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.container}>
          <Image
            source={{ uri: 'https://logos.textgiraffe.com/logos/logo-name/Kaan-designstyle-boots-m.png' }}
            style={{ width: 500, height: 250, alignSelf: "center", marginBottom: "4%"}}
          />
          <Button 
            style={styles.boton}
            icon="account-plus"
            mode="contained"
            color="orange"
            onPress={() => navigation.navigate("Registro")}
          >
            Registro
          </Button>
          <Button
            style={styles.boton}
            icon="login"
            mode="contained"
            color="orange"
            onPress={() => metodoLogin()}
          >
            Login
          </Button>
          <Button
            style={styles.boton}
            mode="contained"
            color="orange"
            icon="briefcase-search"
            onPress={() => navigation.navigate("HomeApp")}
          >
            Continuar Como Invitado
          </Button>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    //alignItems: "center",
    //justifyContent: "space-evenly",
  },
  boton: {
    marginLeft: "10%",
    marginHorizontal: "10%",
    marginBottom: "3%"
  }
});
