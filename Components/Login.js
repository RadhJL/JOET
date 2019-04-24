import React, { Component } from "react";
import {
  View, Alert,
  StyleSheet, Text, BackHandler
} from "react-native";
import { Container, Header, Title, Button, Left, Right, Body, Icon, Label, Input } from 'native-base';
import * as firebase from 'firebase'
export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      uid: '',

      /* TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST */
      Email: '',
      Password: '',
      /* TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST */

    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }





  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    BackHandler.exitApp()
    return true;
  }


  async login1() {
    var that = this

    try {
      await firebase.auth().signInWithEmailAndPassword(this.state.Email, this.state.Password)
      var userr = await firebase.auth().currentUser;
      var that = this
      var ref = firebase.database().ref('Users/' + userr.uid).once('value').then(function (snapshot) {
        if (snapshot.val() == null) {
          that.props.navigation.navigate("TypeOfUser")
        } else {
          if (snapshot.val().Type === 'Client')
            that.props.navigation.navigate("ClientTab")
          else if (snapshot.val().Type === 'Livreur')
            that.props.navigation.navigate("LivreurTab")
          else if (snapshot.val().Type === 'Chef')
            that.props.navigation.navigate("ChefTab")
        }
      });

    } catch (error) {

      console.log(error)

      Alert.alert(
        'Erreur',
        'Vérifiez E-mail ou mot de passe',
        [
          {
            text: 'Cancel',
            onPress: () => console.log(),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log() },
        ],
        { cancelable: false },
      );
    }

  }

  async login() {
    var that = this
    try {
      await firebase.auth().createUserWithEmailAndPassword(this.state.Email, this.state.Password)
      var userr = await firebase.auth().currentUser;
      ////////////////////////////////////////////////////////////////////////////
      await fetch('https://randomuser.me/api/')
        .then((response) => response.json())
        .then((responseJson) => {
          console.log();
          console.log();
          userr.updateProfile({
            displayName: responseJson.results[0].name.first + " " + responseJson.results[0].name.last,
            photoURL: responseJson.results[0].picture.large
          }).then(function () {
            // Update successful.
          }).catch(function (error) {
            console.log(error)
          });
        })
        .catch((error) => {
          console.error(error);
        });
      ////////////////////////////////////////////////////



      var that = this
      firebase.database().ref('Users/' + userr.uid).once('value').then(function (snapshot) {
        if (snapshot.val() == null) {
          that.props.navigation.navigate("TypeOfUser")
        } else {
          if (snapshot.val().Type === 'Client')
            that.props.navigation.navigate("ClientTab")
          else if (snapshot.val().Type === 'Livreur')
            that.props.navigation.navigate("LivreurTab")
          else if (snapshot.val().Type === 'Chef')
            that.props.navigation.navigate("ChefTab")
        }
      });

    } catch (error) {

      Alert.alert(
        'Erreur',
        'Incorrect E-mail ou Mot de passe',
        [
          {
            text: 'Cancel',
            onPress: () => console.log(),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log() },
        ],
        { cancelable: false },
      );

    }
  }


  signin = async () => {
    var that = this
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('2364674057099765', { permissions: ['public_profile', "email"] })

    if (type == 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      firebase.auth().signInAndRetrieveDataWithCredential(credential).then(() => {
        var user = firebase.auth().currentUser
        var uid = user.uid
        firebase.database().ref('Users/' + uid).once('value').then(function (snapshot) {
          if (snapshot.val() == null) {
            user.updateProfile({
              photoURL: user.photoURL+"?type=large&redirect=true&width=600&height=600"
            })
            that.props.navigation.navigate("TypeOfUser")
            } else {
            if (snapshot.val().Type === 'Client')
              that.props.navigation.navigate("ClientTab")
            else if (snapshot.val().Type === 'Livreur')
              that.props.navigation.navigate("LivreurTab")
            else if (snapshot.val().Type === 'Chef')
              that.props.navigation.navigate("ChefTab")
          }
        });
      }).catch((error) => {
        console.log(error)
      })
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', fontFamily: 'sans-serif-medium', }}>JOET?</Text>
          <Text style={{ fontSize: 25 }}>
            Mangez, comme chez vous!
         </Text>
        </View>

        {/* TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST */}
        <View style={{ flex: 1, width: 300 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>E-mail</Text>
          <Input placeholder="Type your E-mail.." keyboardType={'email-address'} onChangeText={(Email) => this.setState({ Email })}></Input>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Password</Text>
          <Input placeholder="Type you password.." secureTextEntry={true} onChangeText={(Password) => this.setState({ Password })}></Input>
        </View>
        {/* TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST */}

        <View style={{ flex: 1, justifyContent: 'space-around' }}>
          <Button rounded style={{ backgroundColor: 'green', width: 300, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.login()}><Label style={{ fontWeight: 'bold', color: 'white' }}>  Créer Compte avec E-mail </Label></Button>
          <Button rounded style={{ backgroundColor: 'green', width: 300, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.login1()}><Label style={{ fontWeight: 'bold', color: 'white' }}>   Se connecter avec E-mail </Label></Button>
          <Button rounded style={{ backgroundColor: '#3c5a99', width: 300, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.signin()}><Label style={{ fontWeight: 'bold', color: 'white' }}>  Se connecter avec Facebook </Label></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});