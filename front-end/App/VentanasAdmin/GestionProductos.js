import React from "react";
import { StyleSheet, View, ScrollView, Image, Picker } from "react-native";
import { Button, Divider, TextInput, Title, List } from "react-native-paper";
import Cabecera from "../Menu/Cabecera";
import * as ImagePicker from "expo-image-picker";
import alert from "../alert";
import { carrito } from "../endpoints";
import { categoriass } from "../endpoints";
import { productos } from "../endpoints";
import { useAppContext } from "../Session/Datos";

const urlCat = categoriass;
const urlProd = productos;

export default function GestionProductos({ navigation }) {
  const { userHasAuthenticated, isAuthenticated } = useAppContext();
  const [newImgPro, setnewImgPro] = React.useState({
    uri:
      "https://image.freepik.com/vector-gratis/sello-nuevo-producto_23-2147503128.jpg",
  });
  const [modImgPro, setmodImgPro] = React.useState();

  //variables nuevo
  const [txtprecio, settxtprecio] = React.useState("");
  const [txtnombre, settxtnombre] = React.useState("");
  const [txtdescripcion, settxtdescripcion] = React.useState("");
  const [selectCategoria, setselectCategoria] = React.useState("");

  //variables modificar
  const [txtpreciomod, settxtpreciomod] = React.useState("");
  const [txtnombremod, settxtnombremod] = React.useState("");
  const [txtdescripcionmod, settxtdescripcionmod] = React.useState("");
  const [selectCategoriamod, setselectCategoriamod] = React.useState("");
  const [selectProductomod, setselectProductomod] = React.useState("");

  //variables eliminar
  const [eliImgPro, seteliImgPro] = React.useState("");
  const [txtprecioeli, settxtprecioeli] = React.useState("");
  const [txtnombreeli, settxtnombreeli] = React.useState("");
  const [selectCategoriaeli, setselectCategoriaeli] = React.useState("");
  const [selectProductoeli, setselectProductoeli] = React.useState("");
  const [recargar, setrecargar] = React.useState(0);

  const reiniciarTodo = () => {
    setnewImgPro({
      uri:
        "https://image.freepik.com/vector-gratis/sello-nuevo-producto_23-2147503128.jpg",
    });

    //variables nuevo
    settxtprecio("");
    settxtnombre("");
    settxtdescripcion("");
    setselectCategoria("");
    //variables modificar
    setselectCategoriamod("");
    setselectProductomod("");
    //variables eliminar
    setselectCategoriaeli("");
    setselectProductoeli("");

    //recargar lista de productos/categorias
    setrecargar(recargar + 1);
  };

  //----------metodo agregar foto nuevo producto
  const pickImageNew = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      //quality: 0,
      base64: true,
    });
    if (!result.cancelled) {
      const newImg = "data:image/jpg;base64," + String(result.base64);
      setnewImgPro({ uri: newImg });
      //'data:image/jpg;base64,'+result.base64
    }
  };

  //----------metodo agregar foto modificar producto
  const pickImageModif = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      //quality: 0,
      base64: true,
    });
    if (!result.cancelled) {
      const newImg = "data:image/jpg;base64," + String(result.base64);
      setmodImgPro({ uri: newImg });
      //'data:image/jpg;base64,'+result.base64
    }
  };

  //metodo para llenar los combobox
  const listCategoriasbox = () => {
    const listaC = [];
    for (let i = 0; i < categorias.length; i++) {
      const catActual = categorias[i];
      listaC.push(
        <Picker.Item
          key={i}
          label={catActual.nombre}
          value={catActual.codigo}
        />
      );
    }
    return listaC;
  };
  const listProdutosbox = () => {
    const listaC = [];
    for (let i = 0; i < productos.length; i++) {
      const catActual = productos[i];
      if (catActual.categoria == selectCategoriamod) {
        listaC.push(
          <Picker.Item
            key={i}
            label={catActual.nombre}
            value={catActual.codigo}
          />
        );
      }
    }
    return listaC;
  };
  const listProdutosboxeli = () => {
    const listaC = [];
    for (let i = 0; i < productos.length; i++) {
      const catActual = productos[i];
      if (catActual.categoria == selectCategoriaeli) {
        listaC.push(
          <Picker.Item
            key={i}
            label={catActual.nombre}
            value={catActual.codigo}
          />
        );
      }
    }
    return listaC;
  };
  //-------------------------cargar categorias-----------
  //consulta al servidor
  const [categorias, setCategorias] = React.useState([]);
  React.useEffect(() => {
    fetch(urlCat)
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
  }, [recargar]);

  const [productos, setProductos] = React.useState([]);
  React.useEffect(() => {
    fetch(urlProd)
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        return json;
      })
      .then((json) => {
        setProductos(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [recargar]);

  //-------------------------peticiones al servidor------
  const agregarP = () => {
    if (selectCategoria != "") {
      /* JSON DE EJEMPLO PARA CREAR UN PRODUCTO
    {
      codigo: 'p13',
      nombre: 'producto13',
      precio: 600.50,
      categoria: 'C3',
      descripcion: 'producto prueba',
      imagen: 'imagen'
    }
    */
      fetch(urlProd, {
        method: "POST",
        headers: {
          "token-acceso": isAuthenticated.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo: txtnombre + new Date().getTime(),
          nombre: txtnombre,
          precio: txtprecio,
          categoria: selectCategoria,
          descripcion: txtdescripcion,
          imagen: newImgPro.uri,
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
      //console.log(newImgPro.uri);
      //console.log(txtprecio);
      //console.log(txtnombre);
      //console.log(txtdescripcion);
      //console.log(selectCategoria);
    } else {
      alert(
        "Error",
        "Selecciona Una Categoria",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
    reiniciarTodo();
  };

  const modificarP = () => {
    if (txtpreciomod != "" && txtnombremod != "" && txtdescripcionmod != "") {
      fetch(urlProd + "/" + selectProductomod, {
        method: "PUT",
        headers: {
          "token-acceso": isAuthenticated.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "producto.nombre": txtnombremod,
          "producto.precio": txtpreciomod,
          "producto.categoria": selectCategoriamod,
          "producto.descripcion": txtdescripcionmod,
          "producto.imagen": modImgPro.uri,
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
      //console.log(modImgPro.uri);
      //console.log(txtpreciomod);
      //console.log(txtnombremod);
      //console.log(txtdescripcionmod);
      //console.log(selectCategoriamod);
      //console.log(selectProductomod);
    } else {
      alert(
        "Error",
        "Los datos son obligatorios",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
    reiniciarTodo();
  };

  const eliminarP = () => {
    fetch(urlProd + "/" + selectProductoeli, {
      method: "DELETE",
      headers: {
        "token-acceso": isAuthenticated.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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
    //console.log(eliImgPro.uri);
    //console.log(txtprecioeli);
    //console.log(txtnombreeli);
    //console.log(selectCategoriaeli);
    //console.log(selectProductoeli);

    reiniciarTodo();
  };

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Cabecera
          isHome={false}
          navigation={navigation}
          title={"Gestion de Productos"}
        />
      </View>

      <ScrollView>
        <List.Section>
          <List.Accordion
            title="Agregar Producto"
            left={(props) => <List.Icon {...props} icon="database-plus" />}
          >
            <View style={styles.container}>
              <View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ width: "45%" }}>
                    <Image source={newImgPro} style={styles.perfilImg} />
                    <Button
                      mode="contained"
                      color="green"
                      onPress={pickImageNew}
                    >
                      Cambiar
                    </Button>
                  </View>
                  <View style={{ width: "50%" }}>
                    <TextInput
                      label="Nombre"
                      value={txtnombre}
                      onChangeText={(txtnombre) => {
                        settxtnombre(txtnombre);
                      }}
                    />
                    <TextInput
                      label="Precio"
                      value={txtprecio}
                      onChangeText={(txtprecio) => {
                        if (!isNaN(txtprecio)) {
                          settxtprecio(txtprecio);
                        }
                      }}
                    />
                  </View>
                </View>
                <View style={{ marginTop: 10, marginBottom: 25 }}>
                  <TextInput
                    label="Descripcion"
                    value={txtdescripcion}
                    multiline
                    onChangeText={(txtdescripcion) => {
                      settxtdescripcion(txtdescripcion);
                    }}
                  />
                  <Picker
                    selectedValue={selectCategoria}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) =>
                      setselectCategoria(itemValue)
                    }
                  >
                    <Picker.Item label="Seleccionar Categoria..." value="" />
                    {listCategoriasbox()}
                  </Picker>

                  <Button
                    mode="contained"
                    color="#08213e"
                    onPress={() => {
                      agregarP();
                    }}
                  >
                    Agregar Producto
                  </Button>
                </View>
              </View>
            </View>
          </List.Accordion>
          <List.Accordion
            title="Modificar Producto"
            left={(props) => <List.Icon {...props} icon="database-edit" />}
          >
            <View style={styles.container}>
              <Picker
                //enabled={selectProductomod != "" ?(false):(true)}
                selectedValue={selectCategoriamod}
                style={{ height: 50, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setselectCategoriamod(itemValue);
                  setselectProductomod("");
                }}
              >
                <Picker.Item label="Seleccionar Categoria..." value="" />
                {listCategoriasbox()}
              </Picker>
              <Picker
                selectedValue={selectProductomod}
                style={{ height: 50, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setselectProductomod(itemValue);
                  for (let i = 0; i < productos.length; i++) {
                    const catActual = productos[i];
                    if (catActual.codigo == itemValue) {
                      settxtpreciomod(String(catActual.precio));
                      settxtnombremod(catActual.nombre);
                      settxtdescripcionmod(catActual.descripcion);
                      setmodImgPro({ uri: catActual.imagen });
                    }
                  }
                }}
              >
                <Picker.Item label="Seleccionar Producto..." value="" />
                {listProdutosbox()}
              </Picker>
              {selectProductomod != "" ? (
                <View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Image source={modImgPro} style={styles.perfilImg} />
                      <Button
                        mode="contained"
                        color="green"
                        onPress={pickImageModif}
                      >
                        Cambiar
                      </Button>
                    </View>
                    <View style={{ width: "50%" }}>
                      <TextInput
                        label="Nombre"
                        value={txtnombremod}
                        onChangeText={(txtnombremod) => {
                          settxtnombremod(txtnombremod);
                        }}
                      />
                      <TextInput
                        label="Precio"
                        value={txtpreciomod}
                        onChangeText={(txtpreciomod) => {
                          if (!isNaN(txtpreciomod)) {
                            settxtpreciomod(txtpreciomod);
                          }
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ marginTop: 10, marginBottom: 25 }}>
                    <TextInput
                      label="Descripcion"
                      value={txtdescripcionmod}
                      multiline
                      onChangeText={(txtdescripcionmod) => {
                        settxtdescripcionmod(txtdescripcionmod);
                      }}
                    />
                    <Button
                      mode="contained"
                      color="#08213e"
                      onPress={() => {
                        modificarP();
                      }}
                    >
                      Modificar Producto
                    </Button>
                  </View>
                </View>
              ) : null}
            </View>
          </List.Accordion>
          <List.Accordion
            title="Eliminar Producto"
            left={(props) => <List.Icon {...props} icon="database-remove" />}
          >
            <View style={styles.container}>
              <Picker
                //enabled={selectProductomod != "" ?(false):(true)}
                selectedValue={selectCategoriaeli}
                style={{ height: 50, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setselectCategoriaeli(itemValue);
                  setselectProductoeli("");
                }}
              >
                <Picker.Item label="Seleccionar Categoria..." value="" />
                {listCategoriasbox()}
              </Picker>
              <Picker
                selectedValue={selectProductoeli}
                style={{ height: 50, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setselectProductoeli(itemValue);
                  for (let i = 0; i < productos.length; i++) {
                    const catActual = productos[i];
                    if (catActual.codigo == itemValue) {
                      settxtprecioeli(String(catActual.precio));
                      settxtnombreeli(catActual.nombre);
                      seteliImgPro({ uri: catActual.imagen });
                    }
                  }
                }}
              >
                <Picker.Item label="Seleccionar Producto..." value="" />
                {listProdutosboxeli()}
              </Picker>
              {selectProductoeli != "" ? (
                <View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Image source={eliImgPro} style={styles.perfilImg} />
                    </View>
                    <View style={{ width: "50%" }}>
                      <TextInput
                        editable={false}
                        label="Nombre"
                        value={txtnombreeli}
                      />
                      <TextInput
                        label="Precio"
                        editable={false}
                        value={txtprecioeli}
                      />
                    </View>
                  </View>
                  <Button
                    mode="contained"
                    color="#08213e"
                    onPress={() => {
                      eliminarP();
                    }}
                  >
                    Eliminar Producto
                  </Button>
                </View>
              ) : null}
            </View>
          </List.Accordion>
        </List.Section>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  perfilImg: {
    width: 100,
    height: 100,
  },
});
