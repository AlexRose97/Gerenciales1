import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, Link } from 'react-native-paper';
import alert from '../alert';
import Cabecera from '../Menu/Cabecera';
import { useAppContext } from '../Session/Datos';
import {contrasenia} from '../endpoints';

const url = contrasenia; 

export default function RecuperacionScreen({ navigation }) {
  const { userHasAuthenticated } = useAppContext();

  const [txtCorreo, settxtCorreo] = React.useState('');

  const metodoRecuperacion = () => {
    /* JSON DE EJEMPLO PARA RECUPERAR CONTRASEÑA POR MEDIO DEL CORREO  
    {
      "correo": "userprueba@gmail.com"
    }
    */

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: txtCorreo
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        alert(
            responseData.message
          );

        if (responseData.id != null) 
            userHasAuthenticated(true);
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View style={{ height: '100%' }}>
      <View>
        <Cabecera
          isHome={false}
          navigation={navigation}
          title={'Recuperar contraseña'}
        />
      </View>
      <View style={styles.container}>
        <View>
          <TextInput
            label='Correo'
            value={txtCorreo}
            onChangeText={(txtCorreo) => settxtCorreo(txtCorreo)}
          />
        </View>
        <Button mode='contained' onPress={() => metodoRecuperacion()}>
          Recuperar contraseña
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
});
