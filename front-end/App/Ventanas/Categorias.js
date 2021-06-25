import * as React from "react";
import { StyleSheet, ScrollView, View, Platform } from "react-native";
import Cabecera from "../Menu/Cabecera";
import { Avatar, Button, Card, Title, Searchbar } from "react-native-paper";
import {categoriass} from "../endpoints";

import * as listCat from "../listCat.json";
const url =
  // PRUEBA CATEGORIAS JSON S3
  //"https://s3.us-east-2.amazonaws.com/supermercado.g1/categorias.json";
  // API GET CATEGORIAS
  categoriass;

export default function Productos({ navigation }) {
  //variables para el buscador
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  //lista categorias
  //const misCat = listCat.listaCategorias;

  //variable para el icono
  const LeftContent = (props) => <Avatar.Icon {...props} icon="shopping" />;

  //consulta al servidor

  const [categorias, setCategorias] = React.useState([]);

  React.useEffect(() => {
    fetch("https://gerenciales1.s3.amazonaws.com/categorias.json")
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .then((json) => {
        setCategorias(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const ciclo_Cards = () => {
    const cards = [];
    for (var i = 0; i < categorias.length; i++) {
      const catActual = categorias[i];
      if (
        catActual.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery == ""
      ) {
        cards.push(
          <Card style={styles.item} key={i}>
            <Card.Content>
              <Title>{String(catActual.nombre)}</Title>
            </Card.Content>
            <Card.Cover source={{ uri: catActual.imagen }} />
            <Card.Actions>
              <View style={styles.cardView}>
                <Button
                  icon="eye"
                  mode="contained"
                  onPress={() =>
                    navigation.navigate("Productos", {
                      itemId: catActual.codigo,
                      itemName: catActual.nombre,
                    })
                  }
                >
                  ver productos
                </Button>
              </View>
            </Card.Actions>
          </Card>
        );
      }
    }
    return cards;
  };

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera isHome={true} navigation={navigation} title={"CATEGORIAS"} />
        <Card style={styles.card}>
          <Card.Title title="Categorias" left={LeftContent} />
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
  chipView: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
