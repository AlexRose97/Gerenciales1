import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ItemsMenu from "./App/Menu/ItemsMenu";
import InicioApp from "./App/InicioApp/InicioApp";
import LoginScreen from "./App/InicioApp/login";
import RecuperacionScreen from "./App/InicioApp/RecuperacionPass";
import Registro from "./App/InicioApp/registro";
import Perfil from "./App/Ventanas/Perfil";
import Inicio from "./App/Ventanas/Inicio";
import Productos from "./App/Ventanas/Productos";
import Categorias from "./App/Ventanas/Categorias";
import Carrito from "./App/Ventanas/Carrito";
import PagoCarro from "./App/Ventanas/PagoCarro";
import HistorialCompras from "./App/Ventanas/HistorialCompras";
//adimn
import GestionProductos from "./App/VentanasAdmin/GestionProductos";
import GestionCompras from "./App/VentanasAdmin/GestionCompras";

//contexto para usar la variable de sesion
import { AppContext } from "./App/Session/Datos";

const navHead = () => ({
  headerShown: false,
});
//Ventana Principal Y Base de la APP
const StackHome = createStackNavigator();
function HomeStack() {
  return (
    <StackHome.Navigator initialRouteName="Inicio">
      <StackHome.Screen name="Inicio" component={Inicio} options={navHead} />
    </StackHome.Navigator>
  );
}

//Menu con items
const Drawer = createDrawerNavigator();
function DrawerNavigator({ navigation }) {
  return (
    <Drawer.Navigator
      initialRouteName="MenuTab"
      drawerContent={() => <ItemsMenu navigation={navigation} />}
    >
      <Drawer.Screen name="MenuTab" component={HomeStack} />
      <Drawer.Screen name="Inicio" component={Inicio} />
      <Drawer.Screen name="Categorias" component={Categorias} />
      <Drawer.Screen name="Productos" component={Productos} />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Carrito" component={Carrito} />
      <Drawer.Screen name="PagoCarro" component={PagoCarro} />
      <Drawer.Screen name="HistorialCompras" component={HistorialCompras} />
      <Drawer.Screen name="GestionProductos" component={GestionProductos} />
      <Drawer.Screen name="GestionCompras" component={GestionCompras} />
    </Drawer.Navigator>
  );
}

//iniciar la app desde el login
const StackApp = createStackNavigator();
export default function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  return (
    <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
      <NavigationContainer>
        <StackApp.Navigator initialRouteName="InicioApp">
          <StackApp.Screen
            name="HomeApp"
            component={DrawerNavigator}
            options={navHead}
          />
          <StackApp.Screen
            name="InicioApp"
            component={InicioApp}
            options={navHead}
          />
          <StackApp.Screen
            name="Registro"
            component={Registro}
            options={navHead}
          />
          <StackApp.Screen
            name="Login"
            component={LoginScreen}
            options={navHead}
          />
          <StackApp.Screen
            name="Recuperacion"
            component={RecuperacionScreen}
            options={navHead}
          />
        </StackApp.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
