import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Cabecera from "../Menu/Cabecera";
import { useAppContext } from "../Session/Datos";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import alert from "../alert";
import {usuario} from "../endpoints";

var FormData = require("form-data");

const url = usuario;

var data = new FormData();

export default function Registro({ navigation }) {
  const [imagePerfil, setimagePerfil] = React.useState({
    uri:
      "https://dearce.com.uy/wp-content/uploads/2013/10/facebook-default.jpg",
  });
  const { userHasAuthenticated } = useAppContext();

  const [txtNombre, settxtNombre] = React.useState("");
  const [txtUser, settxtUser] = React.useState("");
  const [txtTelefono, settxtTelefono] = React.useState("");
  const [txtCorreo, settxtCorreo] = React.useState("");
  const [txtPass, settxtPass] = React.useState("");
  const [txtNac, settxtNac] = React.useState(new Date(1598051730000));
  const [showCalendar, setshowCalendar] = React.useState(false);
  const [showPass, setshowPass] = React.useState(true);

  const metodoRegistro = () => {
    /* JSON DE EJEMPLO PARA CREACIÓN DE UN NUEVO USUARIO
    {
      "username": "userpruebaa",
      "nombre": "userprueba",
      "fotografia": "foto userprueba",
      "fecha_nac": "24/12/1996",
      "telefono": "12345678",
      "correo": "userprueba@gmail.com",
      "password": "1234"
    }
    */

    if (
      txtNombre != "" &&
      txtUser != "" &&
      txtTelefono != "" &&
      txtCorreo != "" &&
      txtPass != ""
    ) {
      fetch(url, {
        method: "POST",
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: txtUser,
          nombre: txtNombre,
          fotografia:imagePerfil.uri,
          fecha_nac: txtNac,
          telefono: txtTelefono,
          correo: txtCorreo,
          password: txtPass,
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("RESULTS HERE:", responseData);

          alert(
            "Exito!",
            String(responseData.message) + "",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );

          if (responseData.message == "Usuario agregado exitosamente") {
            navigation.navigate("InicioApp");
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality:0,
      base64: true,
    });

    if (!result.cancelled) {
      const newImg="data:image/jpg;base64,"+String(result.base64)
      setimagePerfil({ uri:newImg});
      console.log(imagePerfil.uri)
      //'data:image/jpg;base64,'+result.base64  
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setshowCalendar(Platform.OS === "ios");
    settxtNac(currentDate);
  };

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera isHome={false} navigation={navigation} title={"REGISTRO"} />
      </View>
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
              <Button mode="contained" onPress={pickImage}>
                Cargar
              </Button>
            </View>
            <View style={{ width: "55%" }}>
              <TextInput
                label="Nick/Usuario"
                value={txtUser}
                onChangeText={(txtUser) => settxtUser(txtUser)}
              />
              <TextInput
                label="Telefono"
                value={txtTelefono}
                onChangeText={(txtTelefono) => settxtTelefono(txtTelefono)}
              />
            </View>
          </View>
          <TextInput
            label="Nombre Completo"
            value={txtNombre}
            onChangeText={(txtNombre) => settxtNombre(txtNombre)}
          />
          <TextInput
            label="Fecha de Nacimiento"
            value={String(txtNac.getDate())}
            disabled
            right={
              <TextInput.Icon
                name="calendar"
                color="purple"
                onPress={() => {
                  setshowCalendar(true);
                }}
              />
            }
          />
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
        </View>
        <Button mode="contained" onPress={() => metodoRegistro()}>
          Registrar
        </Button>
      </View>
      {showCalendar && (
        <DateTimePicker
          testID="dateTimePicker"
          value={txtNac}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
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
