import * as React from "react";
import { View, ScrollView, StyleSheet, Picker } from "react-native";
import { Button, TextInput, Text, List, Title } from "react-native-paper";
import { TextInputMask } from "react-native-masked-text";

import Cabecera from "../Menu/Cabecera";
import { compras } from "../endpoints";
import { carrito } from "../endpoints";
const comprasAPI = compras;

//importar este archivo para las alertas web/android/ios
import alert from "../alert";
import { useAppContext } from "../Session/Datos";
import { CommonActions } from "@react-navigation/routers";

export default function PagoCarro({ navigation }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();
  //variables pago con tarjeta
  const [txtTarjeta, settxtTarjeta] = React.useState("");
  const [txtFecha, settxtFecha] = React.useState("");
  const [txtCVV, settxtCVV] = React.useState("");
  const [txtdepa, settxtdepa] = React.useState("");
  const [txtdireccion, settxtdireccion] = React.useState("");
  const [txthorario, settxthorario] = React.useState("");

  const pagarPedido = (tipoPago) => {
    //tipo de pago 0=efectivo
    //tipo de pago nnnn=tarjeta
    /* JSON DE EJEMPLO PARA CAMBIAR EL CARRITO 
    {
        "username": "user1",
        "fecha": 13/04/2021,
        "metodoPago": 1,
        "productos": [
          {
            "nombre": "frijol",
            "cantidad": 2,
            "precio": 18
          },
          {
            "nombre": "carne adobada",
            "cantidad": 2,
            "precio": 18
          }],
        "total": 500
    }*/
    if (txthorario !== "" && txtdireccion !== "" && txtdepa !== "") {
      fetch(comprasAPI, {
        method: "POST",
        headers: {
          "token-acceso": isAuthenticated.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          direccion: txtdepa + "," + txtdireccion,
          horario: txthorario,
          estado: 0,
          username: isAuthenticated.username,
          metodoPago: tipoPago,
          productos: isAuthenticated.carrito.productos,
          total: isAuthenticated.carrito.total + 25,
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          alert(
            "Carrito",
            responseData.message,
            [
              {
                text: "OK",
                onPress: () => {
                  isAuthenticated.carrito.total = 0;
                  isAuthenticated.carrito.cantidadT = 0;
                  isAuthenticated.carrito.productos = [];
                  metodoCambiarInfo();
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [{ name: "HomeApp" }],
                    })
                  );
                },
              },
            ],
            { cancelable: false }
          );
          console.log(responseData);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert(
        "Error",
        "Ingresa el Horario y la Direccion de entrega",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  };
  const metodoCambiarInfo = () => {
    /* JSON DE EJEMPLO PARA CAMBIAR EL CARRITO 
    {
      "carrito":[{
        "total": 100,
        "cantidadT": 4,
        "productos": [{
          "nombre": "frijol",
          "cantidad": 2,
          "precio": 18
        },
        {
          "nombre": "carne adobada",
          "cantidad": 2,
          "precio": 18
        }]
      }]
    }
    */
    console.log(isAuthenticated.carrito);
    fetch(carrito + isAuthenticated.id, {
      method: "PUT",
      headers: {
        "token-acceso": isAuthenticated.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carrito: [isAuthenticated.carrito],
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {})
      .catch((error) => {
        console.error(error);
      });
  };

  //variables pago efectivo

  //metodos para expandir las opciones de pago
  const [expadTarj, setExpadTarj] = React.useState(false);
  const [expadEfect, setExpadEfect] = React.useState(false);
  const mostrarTarjeta = () => {
    setExpadTarj(!expadTarj);
    setExpadEfect(false);
  };
  const mostrarEfectivo = () => {
    setExpadTarj(false);
    setExpadEfect(!expadEfect);
  };

  const datosLista = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={{ width: "35%" }}
          editable={false}
          label="Costo Entrega"
          value="Q25"
        />
        <TextInput
          style={{ width: "30%" }}
          editable={false}
          label="Productos"
          value={String(isAuthenticated.carrito.cantidadT)}
        />
        <TextInput
          style={{ width: "35%" }}
          editable={false}
          label="Monto Total"
          value={"Q" + String(isAuthenticated.carrito.total + 25)}
        />
      </View>
    );
  };

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera
          isHome={false}
          navigation={navigation}
          title={"Metodo de Pago"}
        />
      </View>
      <ScrollView>
        {isAuthenticated ? datosLista() : null}
        <View style={{ flexDirection: "row" }}>
          <Picker
            //enabled={selectProductomod != "" ?(false):(true)}
            selectedValue={txtdepa}
            style={{ height: 50, width: "50%" }}
            onValueChange={(itemValue, itemIndex) => {
              settxtdepa(itemValue);
            }}
          >
            <Picker.Item label="Departamento..." value="" />
            <Picker.Item label="Alta Verapaz" value="Alta Verapaz" />
            <Picker.Item label="Baja Verapaz" value="Baja Verapaz" />
            <Picker.Item label="Chimaltenago" value="Chimaltenago" />
            <Picker.Item label="Chiquimula" value="Chiquimula" />
            <Picker.Item label="Guatemala" value="Guatemala" />
            <Picker.Item label="El Progreso" value="El Progreso" />
            <Picker.Item label="Escuintla" value="Escuintla" />
            <Picker.Item label="Huehuetenango" value="Huehuetenango" />
            <Picker.Item label="Izabal" value="Izabal" />
            <Picker.Item label="Jalapa" value="Jalapa" />
            <Picker.Item label="Jutiapa" value="Jutiapa" />
            <Picker.Item label="Petén" value="Petén" />
            <Picker.Item label="Quetzaltenango" value="Quetzaltenango" />
            <Picker.Item label="Quiché" value="Quiché" />
            <Picker.Item label="Retalhuleu" value="Retalhuleu" />
            <Picker.Item label="Sacatepequez" value="Sacatepequez" />
            <Picker.Item label="San Marcos" value="San Marcos" />
            <Picker.Item label="Santa Rosa" value="Santa Rosa" />
            <Picker.Item label="Sololá" value="Sololá" />
            <Picker.Item label="Suchitepequez" value="Suchitepequez" />
            <Picker.Item label="Totonicapán" value="Totonicapán" />
            <Picker.Item label="Zacapa" value="Zacapa" />
          </Picker>
          <TextInput
            style={{ width: "50%" }}
            label="Direccion"
            value={txtdireccion}
            onChangeText={(txtdireccion) => settxtdireccion(txtdireccion)}
          />
        </View>
        {txtdireccion && txtdepa ? (
          <Text>
            El producto sera entregado en: {" " + txtdepa + ", " + txtdireccion}
          </Text>
        ) : null}
        <Picker
          //enabled={selectProductomod != "" ?(false):(true)}
          selectedValue={txthorario}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue, itemIndex) => {
            settxthorario(itemValue);
          }}
        >
          <Picker.Item label="Horario de entrega..." value="" />
          <Picker.Item label="8:00 am a 12:00 pm" value="matutino" />
          <Picker.Item label="1:00 pm a 7:00 pm" value="vespertino" />
        </Picker>
        {txthorario ? (
          <Text>
            El producto sera entregado en los proximos 3 dias hábiles en horario
            {" " + txthorario}
          </Text>
        ) : null}
        <List.Section>
          <List.Accordion
            title="Pagar Con Tarjeta"
            expanded={expadTarj}
            onPress={mostrarTarjeta}
            left={(props) => <List.Icon {...props} icon="credit-card" />}
          >
            <View style={styles.container}>
              <View>
                <Text>Credit Card: Visa or Master</Text>
                <TextInputMask
                  label="Numero de Tarjeta"
                  type={"credit-card"}
                  options={{
                    obfuscated: false,
                    issuer: "visa-or-mastercard",
                  }}
                  value={txtTarjeta}
                  onChangeText={(txtTarjeta) => settxtTarjeta(txtTarjeta)}
                  style={styles.textInputStype}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "45%" }}>
                    <Text>Fecha de Exp:</Text>
                    <TextInputMask
                      type={"datetime"}
                      options={{
                        format: "DD/MM/YYYY",
                      }}
                      value={txtFecha}
                      onChangeText={(txtFecha) => settxtFecha(txtFecha)}
                      style={styles.textInputStype}
                    />
                  </View>
                  <View style={{ width: "45%" }}>
                    <Text>CVV:</Text>
                    <TextInputMask
                      type={"only-numbers"}
                      maxLength={3}
                      value={txtCVV}
                      onChangeText={(txtCVV) => settxtCVV(txtCVV)}
                      style={styles.textInputStype}
                    />
                  </View>
                </View>
              </View>
              <Button
                icon="credit-card"
                mode="contained"
                onPress={() => {
                  if (txtCVV !== "" && txtFecha !== "" && txtTarjeta !== "") {
                    pagarPedido(txtTarjeta);
                  } else {
                    alert(
                      "Error",
                      "Completa toda la informacion de la Tarjeta",
                      [
                        {
                          text: "OK",
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                }}
              >
                Pagar
              </Button>
            </View>
          </List.Accordion>
          <List.Accordion
            title="Pagar En Efectivo"
            left={(props) => <List.Icon {...props} icon="cash" />}
            expanded={expadEfect}
            onPress={mostrarEfectivo}
          >
            <View style={styles.container}>
              <Text>Deberas realizar el pago al recibir tu pedido</Text>
              <Button
                icon="cash"
                mode="contained"
                onPress={() => {
                  pagarPedido(1);
                }}
              >
                Pagar
              </Button>
            </View>
          </List.Accordion>
        </List.Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputStype: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    fontSize: 18,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-evenly",
  },
});
