import React from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import Cabecera from "../Menu/Cabecera";
import { useAppContext } from "../Session/Datos";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import alert from "../alert";
import { CommonActions } from "@react-navigation/native";
import {carrito} from "../endpoints";

var FormData = require("form-data");

const url = carrito;
var data = new FormData();

export default function LoginScreen({ navigation }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();
  const [imagePerfil, setimagePerfil] = React.useState({
    uri: isAuthenticated.foto,
  });

  const [txtNombre, settxtNombre] = React.useState(isAuthenticated.nombre);
  const [txtUser, settxtUser] = React.useState(isAuthenticated.username);
  const [txtTelefono, settxtTelefono] = React.useState(
    String(isAuthenticated.telefono)
  );

  const [txtPass, settxtPass] = React.useState("");
  const [txtPassNew, settxtPassNew] = React.useState("");
  const [txtPassConf, settxtPassConf] = React.useState("");
  const [editarTodo, seteditarTodo] = React.useState(true);
  const [showPass, setshowPass] = React.useState(true);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0,
      base64: true,
    });

    if (!result.cancelled) {
      const newImg = "data:image/jpg;base64," + String(result.base64);
      setimagePerfil({ uri: newImg });
      console.log(imagePerfil.uri);
      //'data:image/jpg;base64,'+result.base64
    }
  };

  const metodoCambiarInfo = () => {
    /* JSON DE EJEMPLO PARA CAMBIAR INFORMACIÓN 
    {
      "correo": "userprueba@gmail.com"
    }
    */

    fetch(url + isAuthenticated.id, {
      method: "PUT",
      headers: {
        "token-acceso": isAuthenticated.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: txtUser,
        nombre: txtNombre,
        telefono: txtTelefono,
        fotografia: imagePerfil.uri,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        alert(
          "Modificacion",
          String(responseData.message),
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
        if (responseData.message == "Usuario modificado") {
          isAuthenticated.username = txtUser;
          isAuthenticated.nombre = txtNombre;
          isAuthenticated.telefono = txtTelefono;
          isAuthenticated.foto = imagePerfil.uri;
          userHasAuthenticated(isAuthenticated);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "HomeApp" }],
            })
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const metodoCambiarPass = () => {
    /* JSON DE EJEMPLO PARA CAMBIAR PASSWORD 
    {
      "password": "1234"
    }
    */
    if (txtPass == isAuthenticated.pass) {
      if (txtPassNew == txtPassConf) {
        fetch(url + isAuthenticated.id, {
          method: "PUT",
          headers: {
            "token-acceso": isAuthenticated.token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: txtPassNew,
          }),
        })
          .then((response) => response.json())
          .then((responseData) => {
            alert(
              "Modificacion",
              String(responseData.message),
              [
                {
                  text: "OK",
                  onPress: () => console.log("OK Pressed"),
                },
              ],
              { cancelable: false }
            );
            if (responseData.message == "Usuario modificado") {
              isAuthenticated.pass = txtPassNew;
              userHasAuthenticated(isAuthenticated);
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: "HomeApp" }],
                })
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        alert(
          "Error",
          "Las contraseñas no coinciden.",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
      }
    } else {
      alert(
        "Error",
        "La contraseña actual es incorrecta!",
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
        <Cabecera
          isHome={false}
          navigation={navigation}
          title={isAuthenticated.nombre}
        />
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <View style={{ width: "40%" }}>
                <Image source={imagePerfil} style={styles.perfilImg} />
                <Button
                  mode="contained"
                  onPress={pickImage}
                  disabled={!editarTodo}
                >
                  Cambiar
                </Button>
              </View>
              <View style={{ width: "55%" }}>
                <TextInput
                  label="Nick/Usuario"
                  value={txtUser}
                  //editable={editarTodo}
                  editable={false}
                  onChangeText={(txtUser) => settxtUser(txtUser)}
                />
                <TextInput
                  label="Telefono"
                  value={txtTelefono}
                  editable={editarTodo}
                  onChangeText={(txtTelefono) => settxtTelefono(txtTelefono)}
                />
              </View>
            </View>
            <TextInput
              label="Nombre Completo"
              value={txtNombre}
              editable={editarTodo}
              onChangeText={(txtNombre) => settxtNombre(txtNombre)}
            />
            <View style={{ marginTop: 10, marginBottom: 25 }}>
              <Button mode="contained" onPress={() => metodoCambiarInfo()}>
                Cambiar Informacion
              </Button>
            </View>
            <View>
              <TextInput
                label="Contraseña Actual"
                value={txtPass}
                secureTextEntry={showPass}
                editable={editarTodo}
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
              <TextInput
                label="Contraseña Nueva"
                value={txtPassNew}
                secureTextEntry={showPass}
                editable={editarTodo}
                right={
                  <TextInput.Icon
                    name="eye"
                    color="purple"
                    onPress={() => {
                      setshowPass(!showPass);
                    }}
                  />
                }
                onChangeText={(txtPassNew) => settxtPassNew(txtPassNew)}
              />
              <TextInput
                label="Confirmar Contraseña"
                value={txtPassConf}
                secureTextEntry={showPass}
                editable={editarTodo}
                right={
                  <TextInput.Icon
                    name="eye"
                    color="purple"
                    onPress={() => {
                      setshowPass(!showPass);
                    }}
                  />
                }
                onChangeText={(txtPassConf) => settxtPassConf(txtPassConf)}
              />

              <View style={{ marginTop: 10, marginBottom: 30 }}>
                <Button mode="contained" onPress={() => metodoCambiarPass()}>
                  Cambiar Contraseña
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  perfilImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});
