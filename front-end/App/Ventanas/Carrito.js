import * as React from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, TextInput, Title, Text } from "react-native-paper";
import { carrito } from "../endpoints";

import Cabecera from "../Menu/Cabecera";

//importar este archivo para las alertas web/android/ios
import alert from "../alert";
import { useAppContext } from "../Session/Datos";

export default function Carrito({ navigation }) {
  //Variable de sesion
  const { userHasAuthenticated, isAuthenticated } = useAppContext();

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

  const eliminarItem = (prod) => {
    if (isAuthenticated) {
      let pos = isAuthenticated.carrito.productos.indexOf(prod);
      isAuthenticated.carrito.productos.splice(pos, 1);
      //metodoCambiarInfo();
      //navergar a el mismo para recargar
      navigation.navigate("Carrito", {});
    }
  };

  const aumentarItem = (prod) => {
    if (isAuthenticated) {
      for (
        let index = 0;
        index < isAuthenticated.carrito.productos.length;
        index++
      ) {
        if (isAuthenticated.carrito.productos[index] == prod) {
          isAuthenticated.carrito.productos[index].cantidad++;
          break;
        }
      }
      //metodoCambiarInfo();
      //navergar a el mismo para recargar
      navigation.navigate("Carrito", {});
    }
  };

  const disminuirItem = (prod) => {
    if (isAuthenticated) {
      for (
        let index = 0;
        index < isAuthenticated.carrito.productos.length;
        index++
      ) {
        if (isAuthenticated.carrito.productos[index] == prod) {
          if (isAuthenticated.carrito.productos[index].cantidad > 1) {
            isAuthenticated.carrito.productos[index].cantidad--;
          }
          break;
        }
      }
      //metodoCambiarInfo();
      //navergar a el mismo para recargar
      navigation.navigate("Carrito", {});
    }
  };

  const ciclo_Carrito = () => {
    const listCar = [];
    if (isAuthenticated) {
      if (isAuthenticated.carrito.productos.length > 0) {
        //calcular total
        let total = 0;
        let tprod = 0;
        for (
          let index = 0;
          index < isAuthenticated.carrito.productos.length;
          index++
        ) {
          const element = isAuthenticated.carrito.productos[index];
          total = total + element.precio * element.cantidad;
          tprod = element.cantidad + tprod;
        }
        isAuthenticated.carrito.total = total;
        isAuthenticated.carrito.cantidadT = tprod;
        listCar.push(
          <View key={0}>
            <Title>Monto Total: Q. {total}.00 </Title>
            <Title>Cantidad De Productos: {tprod}</Title>
          </View>
        );

        for (
          let index = 0;
          index < isAuthenticated.carrito.productos.length;
          index++
        ) {
          const element = isAuthenticated.carrito.productos[index];
          //console.log(element);
          listCar.push(
            <View key={index + 1} style={{ width: "95%", paddingBottom: 20 }}>
              <Title>
                {String(element.nombre).toUpperCase() +
                  ": Q. " +
                  element.precio +
                  ".00 c/u"}
              </Title>
              <View style={styles.itemList}>
                <ImageBackground
                  key={index}
                  source={{
                    uri: element.imagen,
                  }}
                  style={styles.image}
                >
                  <Button
                    mode="contained"
                    color="#991343"
                    onPress={() => {
                      eliminarItem(element);
                    }}
                  >
                    X
                  </Button>
                </ImageBackground>
                <View style={styles.itemButt}>
                  <Button
                    labelStyle={{ fontSize: 25 }}
                    mode="contained"
                    onPress={() => {
                      aumentarItem(element);
                    }}
                  >
                    +
                  </Button>
                  <TextInput label={element.cantidad} />
                  <Button
                    labelStyle={{ fontSize: 25 }}
                    mode="contained"
                    onPress={() => {
                      disminuirItem(element);
                    }}
                  >
                    -
                  </Button>
                </View>
              </View>
            </View>
          );
        }
      } else {
        listCar.push(<Title key={0}>Aun No Tienes Productos</Title>);
      }
    }
    return listCar;
  };

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera isHome={true} navigation={navigation} title={"MI CARRITO"} />
      </View>
      <ScrollView>
        <View>
          <View style={{ alignItems: "center" }}>{ciclo_Carrito()}</View>
        </View>
      </ScrollView>
      <View style={styles.piePagina}>
        <Button
          labelStyle={{ color: "white" }}
          onPress={() => {
            isAuthenticated.carrito.total = 0;
            isAuthenticated.carrito.cantidadT = 0;
            isAuthenticated.carrito.productos = [];
            metodoCambiarInfo();
            navigation.navigate("Carrito", {});
          }}
        >
          Descartar
        </Button>
        <Button
          labelStyle={{ color: "white" }}
          onPress={() => {
            metodoCambiarInfo();
            alert(
              "Carrito",
              "Se guardo el carrito con éxito!",
              [
                {
                  text: "OK",
                  onPress: () => console.log("OK Pressed"),
                },
              ],
              { cancelable: false }
            );
          }}
        >
          Guardar
        </Button>
        <Button
          labelStyle={{ color: "white" }}
          onPress={() => {
            if (isAuthenticated.carrito.productos.length > 0) {
              navigation.navigate("PagoCarro", {});
            } else {
              alert(
                "Carrito",
                "No posees productos en el Carrito",
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
    </View>
  );
}

const styles = StyleSheet.create({
  itemList: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 8,
  },
  itemButt: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  piePagina: {
    backgroundColor: "#7c07ad",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "10%",
  },
});
