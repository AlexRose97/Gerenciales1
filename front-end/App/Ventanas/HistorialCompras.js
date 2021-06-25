import * as React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Button,
  List,
  TextInput,
  Title,
  Text,
  IconButton,
} from "react-native-paper";

import Cabecera from "../Menu/Cabecera";

//importar este archivo para las alertas web/android/ios
import alert from "../alert";
import { useAppContext } from "../Session/Datos";
import { compras } from "../endpoints";
const comprasAPI = compras;

export default function HistorialCompras({ navigation }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();

  //consulta al servidor
  const [compras, setCompras] = React.useState([]);

  React.useEffect(() => {
    fetch(comprasAPI + isAuthenticated.id)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        return json;
      })
      .then((json) => {
        setCompras(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //lista de compras
  const listaCompras = () => {
    const newLista = [];
    for (let index = 0; index < compras.length; index++) {
      const elemet = compras[index];
      const fecha = new Date(elemet.fecha.replace(" ", "T")).toLocaleDateString(
        "en-US"
      );
      const total = String(elemet.total);
      const estado = elemet.estado;
      const metodoP = elemet.metodoPago;
      const dirP = elemet.direccion;
      const horP = elemet.horario;
      const idC = elemet.id;
      newLista.push(
        <View style={styles.container} key={index}>
          {estado === 0 ? (
            <Button icon="clock" color="orange">
              Estado:Pendiente, {fecha} - Q{total}
            </Button>
          ) : (
            <Button icon="check" color="green">
              Estado:Entregado, {fecha} - Q{total}
            </Button>
          )}
          <List.Section>
            <List.Accordion
              title={"Productos"}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={metodoP === "1" ? "cash" : "credit-card"}
                />
              )}
            >
              <Button
                color="blue"
                icon="bus"
                onPress={() => {
                  alert(
                    "Pedido No." + idC,
                    "Horario: " + horP + "\nDireccion: " + dirP,
                    [
                      {
                        text: "OK",
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                Información del envío
              </Button>
              {listaProductos(elemet.productos)}
            </List.Accordion>
          </List.Section>
        </View>
      );
    }

    return newLista;
  };

  //lista de productos de una compra
  const listaProductos = (lista) => {
    const newLista = [];
    for (let index = 0; index < lista.length; index++) {
      const prod = lista[index];
      newLista.push(
        <List.Item
          key={index}
          title={
            prod.cantidad + " " + prod.nombre + " Q" + prod.precio + " c/u"
          }
        ></List.Item>
      );
    }
    return newLista;
  };

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera isHome={true} navigation={navigation} title={"Mis Compras"} />
      </View>
      <ScrollView>
        <Text>
          Recuerda que el envio tiene un costo de Q25 y fue agregado al precio
          final de tu compra
        </Text>
        {isAuthenticated ? listaCompras() : null}
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
    paddingBottom: 10,
  },
});
