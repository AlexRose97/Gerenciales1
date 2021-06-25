import { CommonActions } from "@react-navigation/native";
import React, { Component } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput, Link } from "react-native-paper";
import alert from "../alert";
import Cabecera from "../Menu/Cabecera";
import { urlLogin } from "../endpoints";
import { useAppContext } from "../Session/Datos";

const url = urlLogin;

export default function LoginScreen({ navigation }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();

  const [txtCorreo, settxtCorreo] = React.useState("");
  const [txtPass, settxtPass] = React.useState("");
  const [showPass, setshowPass] = React.useState(true);

  const metodoLogin = () => {
    /* JSON DE EJEMPLO PARA LOGGEARSE 
    {
      "correo": "userprueba@gmail.com",
      "password": "1234"
    }
    */
    if (txtCorreo != "" && txtPass != "") {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: txtCorreo,
          password: txtPass,
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          responseData.pass = txtPass;
          //responseData.tipo = 1;
          //console.log("RESULTS HERE:", responseData);

          if (responseData.id != null) {
            let user;
            if (responseData.carrito.length == 0) {
              responseData.carrito = {
                total: 0,
                cantidadT: 0,
                productos: [],
              };
              user = responseData;
              //console.log(responseData.carrito)
            } else {
              user = responseData;
              user.carrito = responseData.carrito[0];
            }
            userHasAuthenticated(user);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: "HomeApp" }],
              })
            );
          } else {
            userHasAuthenticated(false);
            alert(
              "Error",
              "Datos no encontrados",
              [
                {
                  text: "OK",
                  onPress: () => console.log("OK Pressed"),
                },
              ],
              { cancelable: false }
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert(
        "Error",
        "Campos requeridos",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    }
  };
  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera isHome={false} navigation={navigation} title={"LOGIN"} />
      </View>
      <View style={styles.container}>
        <View>
          <TextInput
            label="Correo"
            value={txtCorreo}
            onChangeText={(txtCorreo) => settxtCorreo(txtCorreo)}
          />
          <TextInput
            label="Contraseña"
            value={txtPass}
            secureTextEntry={showPass}
            right={
              <TextInput.Icon
                name="eye"
                color="purple"
                onPress={() => {
                  setshowPass(!showPass);
                }}
              />
            }
            onChangeText={(txtPass) => settxtPass(txtPass)}
          />

          <Button onPress={() => navigation.navigate("Recuperacion")}>
            <Text>¿Olvidaste tu contraseña?</Text>
          </Button>
        </View>
        <Button icon="login" mode="contained" onPress={() => metodoLogin()}>
          Entrar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "80%",
    alignSelf: "center",
    justifyContent: "space-evenly",
  },
});
