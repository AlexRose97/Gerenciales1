import * as React from "react";
import { ScrollView, StyleSheet, View, Platform } from "react-native";
import { CommonActions, useRoute } from "@react-navigation/native";
import Cabecera from "../Menu/Cabecera";
import { productos } from "../endpoints";
import {
  Avatar,
  Card,
  Title,
  Searchbar,
  FAB,
  IconButton,
  Dialog,
  Paragraph,
  Button,
  Portal,
  TextInput,
} from "react-native-paper";

//importar este archivo para las alertas web/android/ios
import alert from "../alert";
import { useAppContext } from "../Session/Datos";

const url = productos;
// PRUEBA PRODUCTOS S3
//"https://s3.us-east-2.amazonaws.com/supermercado.g1/productos.json";

// PRUEBA PRODUCTOS S3
//"https://s3.us-east-2.amazonaws.com/supermercado.g1/productos.json";

// API GET PRODUCTOS

export default function Productos({ route, navigation }) {
  //variable de sesion
  const { userHasAuthenticated, isAuthenticated } = useAppContext();
  //variables carrito
  const [visible, setVisible] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const [cantidadP, setCantidadP] = React.useState(1);
  const [productoNew, setproductoNew] = React.useState("");
  //variables para el buscador
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  //variable post
  const { itemId, itemName } = useRoute().params ?? {};

  //variable para el icono
  const LeftContent = (props) => <Avatar.Icon {...props} icon="shopping" />;

  //consulta al servidor
  const [productos, setProductos] = React.useState([]);

  React.useEffect(() => {
    fetch("https://gerenciales1.s3.amazonaws.com/productos.json")
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        return json;
      })
      .then((json) => {
        setProductos(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const titulo = () => {
    if (itemId == undefined) {
      return "Todos los productos";
    } else {
      return String(itemName);
    }
  };

  const bloqueCarrito = () => {
    if (visible) {
      return (
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Agregar {String(productoNew.nombre)}</Dialog.Title>
          <Dialog.Content>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "stretch",
              }}
            >
              <Button
                mode="contained"
                labelStyle={{ fontSize: 25 }}
                onPress={() => {
                  if (cantidadP > 1) {
                    setCantidadP(cantidadP - 1);
                  }
                }}
              >
                -
              </Button>
              <TextInput style={{ width: 70 }} label={cantidadP} />
              <Button
                mode="contained"
                labelStyle={{ fontSize: 25 }}
                onPress={() => {
                  setCantidadP(cantidadP + 1);
                }}
              >
                +
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                agregarAlista();
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      );
    } else {
    }
  };

  const agregarACarrito = (prod) => {
    setCantidadP(1); //iniciar con un producto en el box
    if (isAuthenticated) {
      //buscar si ya agrego el producto
      for (
        let index = 0;
        index < isAuthenticated.carrito.productos.length;
        index++
      ) {
        if (isAuthenticated.carrito.productos[index].codigo == prod.codigo) {
          //copiar la cantidad existente
          setCantidadP(isAuthenticated.carrito.productos[index].cantidad);
          break;
        }
      }
      prod.cantidad = cantidadP; //agregar atributo cantidad
      setproductoNew(prod);
      setVisible(true);
    } else {
      alert(
        "Error",
        "Solo los usuarios pueden agregar productos al carrito de compras",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const agregarAlista = () => {
    if (isAuthenticated) {
      //buscar si ya agrego el producto
      let prod = productoNew;
      prod.cantidad = cantidadP;
      let existe = false;

      //si existe actualizar
      for (
        let index = 0;
        index < isAuthenticated.carrito.productos.length;
        index++
      ) {
        if (isAuthenticated.carrito.productos[index].codigo == prod.codigo) {
          //actualizar si ya existe
          existe = true;
          isAuthenticated.carrito.productos[index].cantidad = cantidadP;
          break;
        }
      }
      //si no existe agregar
      if (!existe) {
        isAuthenticated.carrito.productos.push(prod);
      }
      console.log("--------------Lista-------------");
      for (
        let index = 0;
        index < isAuthenticated.carrito.productos.length;
        index++
      ) {
        console.log(
          isAuthenticated.carrito.productos[index].nombre,
          isAuthenticated.carrito.productos[index].cantidad
        );
      }
      setVisible(false);
    }
  };

  const ciclo_Cards = () => {
    const cards = [];
    for (var i = 0; i < productos.length; i++) {
      const catActual = productos[i];
      if (itemId == catActual.categoria || itemId == undefined) {
        if (
          catActual.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          searchQuery == ""
        ) {
          cards.push(
            <Card style={styles.item} key={i}>
              <Card.Content>
                <Title>{String(catActual.nombre)}</Title>
              </Card.Content>
              <Card.Cover
                source={{
                  uri: catActual.imagen,
                }}
              />
              <Card.Actions>
                <View style={styles.cardView}>
                  <IconButton
                    style={{ backgroundColor: "#1900ff" }}
                    color="#FFFF"
                    size={30}
                    icon="eye"
                    onPress={() => {
                      alert(
                        "Descripcion: " + String(catActual.descripcion),
                        "Precio: Q." + catActual.precio,
                        [
                          {
                            text: "OK",
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                  />
                  <IconButton
                    style={{ backgroundColor: "#1900ff" }}
                    color="#FFFF"
                    size={30}
                    icon="cart"
                    onPress={() => {
                      agregarACarrito(catActual);
                    }}
                  />
                  <IconButton
                    style={{ backgroundColor: "#ffd700" }}
                    color="#FFFF"
                    size={30}
                    icon="star"
                  />
                </View>
              </Card.Actions>
            </Card>
          );
        }
      }
    }
    return cards;
  };

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera isHome={true} navigation={navigation} title={"PRODUCTOS"} />
        <Card style={styles.card}>
          <Card.Title title={titulo()} left={LeftContent} />
          <Card.Content>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
          </Card.Content>
        </Card>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {ciclo_Cards()}
      </ScrollView>
      <FAB
        color="#7c07ad"
        style={styles.fab}
        icon="credit-card"
        onPress={() => {
          if (isAuthenticated) {
            navigation.navigate("Carrito", {});
          } else {
            alert(
              "Error",
              "Solo los usuarios pueden realizar pagos",
              [
                {
                  text: "OK",
                },
              ],
              { cancelable: false }
            );
          }
        }}
      />
      {bloqueCarrito()}
    </View>
  );
}

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      content: {
        // there is no 'grid' type in RN :(
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gridRowGap: "10px",
        gridColumnGap: "10px",
        padding: 8,
      },
      item: {
        width: "100%",
        height: "100%",
      },
    },
    default: {
      content: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 4,
      },
      item: {
        width: "100%",
        padding: 4,
      },
    },
  }),
  photo: {
    flex: 1,
    resizeMode: "cover",
  },
  cardView: {
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
});
