//usac.sistemas2021@gmail.com
//admin
import * as React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { List, Title, Searchbar, Button, Text } from "react-native-paper";

import Cabecera from "../Menu/Cabecera";

//importar este archivo para las alertas web/android/ios
import alert from "../alert";
import { useAppContext } from "../Session/Datos";
import { compras } from "../endpoints";
const comprasAPI = compras;

export default function GestionCompras({ navigation }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();

  //consulta al servidor
  const [compras, setCompras] = React.useState([]);
  const [recarga, setrecarga] = React.useState(0);

  //variables para el buscador
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  React.useEffect(() => {
    fetch(comprasAPI, {
      method: "GET",
      headers: {
        "token-acceso": isAuthenticated.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .then((json) => {
        setCompras(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [recarga]);

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
      const idCompra = elemet.id;
      const dirP = elemet.direccion;
      const horP = elemet.horario;
      const idC = elemet.id;
      if (
        elemet.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery == ""
      ) {
        newLista.push(
          <View style={styles.container} key={index}>
            {estado === 0 ? (
              <Button
                icon="clock"
                color="orange"
                onPress={() => {
                  cambiarEstadoCompra(idCompra, estado);
                }}
              >
                Estado:Pendiente, {fecha} - Q{total}
              </Button>
            ) : (
              <Button
                icon="check"
                color="green"
                onPress={() => {
                  cambiarEstadoCompra(idCompra, estado);
                }}
              >
                Estado:Entregado, {fecha} - Q{total}
              </Button>
            )}
            <List.Section title={"Usuario: " + elemet.username}>
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
    }

    return newLista;
  };

  const cambiarEstadoCompra = (idCompra, estadoCompra) => {
    //ESTADO 0 PENDIENTE
    //ESTADO 1 ENTREGADO
    if (estadoCompra === 0) {
      //Estado:Pendiente
      alert(
        "Cambiar Estado",
        "Desea Cambiar a Entregado?",
        [
          {
            text: "SI",
            onPress: () => {
              //---mandar solicitud de cambio al server
              metodoPutCompra(idCompra, 1);
              //recargar datos con el metodo get
              setrecarga(recarga + 1);
            },
          },
          {
            text: "NO",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else {
      //Estado:Entregado
      alert(
        "Cambiar Estado",
        "Desea Cambiar a Pendiente?",
        [
          {
            text: "SI",
            onPress: () => {
              //---mandar solicitud de cambio al server
              metodoPutCompra(idCompra, 0);
              //recargar datos con el metodo get
              setrecarga(recarga + 1);
            },
          },
          {
            text: "NO",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    }
  };

  const metodoPutCompra = (idCompra, estado) => {
    fetch(comprasAPI + "/" + idCompra, {
      method: "PUT",
      headers: {
        "token-acceso": isAuthenticated.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: estado,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        alert(
          "",
          responseData.message,
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
      })
      .catch((error) => {
        console.error(error);
      });
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
        <Cabecera
          isHome={true}
          navigation={navigation}
          title={"Historial de Compras"}
        />
      </View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Text>presiona el estado del envio para modificarlo</Text>
      <ScrollView>{isAuthenticated ? listaCompras() : null}</ScrollView>
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
