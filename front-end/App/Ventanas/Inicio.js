import * as React from "react";
import { ImageBackground, StyleSheet, View, Platform } from "react-native";
import { Button } from "react-native-paper";

import Cabecera from "../Menu/Cabecera";

//importar este archivo para las alertas web/android/ios
import alert from "../alert";
import { ScrollView } from "react-native-gesture-handler";
import { useAppContext } from "../Session/Datos";
const image = {
  //"https://i.pinimg.com/originals/1f/da/13/1fda138d88aa23d817a3b0c4567b2063.gif",
  uri:
    //"https://image.freepik.com/free-vector/supermarket-logo-with-shopping-cart_23-2148470293.jpg",
    //"https://image.freepik.com/free-photo/blurred-background-blur-grocery-supermarket-shopping-mall-background_7190-2719.jpg",
    "https://www.guatemala.com/fotos/201706/Mercado-de-Artesanias1-885x500.jpg"
  };
const image2 = {
  //"https://i.pinimg.com/originals/1f/da/13/1fda138d88aa23d817a3b0c4567b2063.gif",
  uri:
    //"https://image.freepik.com/free-vector/supermarket-logo-with-shopping-cart_23-2148470293.jpg",
    //"https://image.freepik.com/vector-gratis/tecnologia-alta-tecnologia-geometrica-fondo-sistema-conexion-datos-digitales-abstractos_29971-307.jpg",
    "https://www.guatemala.com/fotos/201706/Mercado-de-Artesanias1-885x500.jpg"
  };

export default function Inicio({ navigation }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();
  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera isHome={true} navigation={navigation} title={"INICIO"} />
      </View>
      {isAuthenticated.tipo === 1 ? (
        <View style={styles.container}>
          <ImageBackground source={image2} style={styles.image}>
            <Button
              style={styles.boton}
              mode="contained"
              icon="database-plus"
              color="green"
              onPress={() => {
                navigation.navigate("GestionProductos", {});
              }}
            >
              Gestionar Productos
            </Button>
            <Button
              style={styles.boton}
              mode="contained"
              icon="archive"
              color="green"
              onPress={() => {
                navigation.navigate("GestionCompras", {});
              }}
            >
              Historial de Compras
            </Button>
          </ImageBackground>
        </View>
      ) : (
        <View style={styles.container}>
          <ImageBackground source={image} style={styles.image}>
            <Button
              style={styles.boton}
              mode="contained"
              icon="briefcase-search"
              color="green"
              onPress={() => navigation.navigate("Categorias", {})}
            >
              Ver categorías
            </Button>
            <Button
              style={styles.boton}
              mode="contained"
              icon="briefcase-search"
              color="green"
              onPress={() =>
                navigation.navigate("Productos", {
                  itemId: undefined,
                  itemName: undefined,
                })
              }
            >
              Ver productos
            </Button>
          </ImageBackground>
        </View>
      )}
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
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  boton: {
    marginLeft: "10%",
    marginHorizontal: "10%",
    marginBottom: "4%",
  },
});
