import React, { Component } from "react";
import {
  View, Alert,
  StyleSheet, Text, BackHandler, KeyboardAvoidingView
} from "react-native";
import { Container, Header, Title, Button, Left, Right, Body, Icon, Label, Input, Item } from 'native-base';
import * as firebase from 'firebase'
import ActivityIndicator from './ActivityIndicator'
export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      uid: '',
      Email: '',
      Password: '',
      wait: false
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

    await this.setState({ wait: true })

    var that = this
    try {
      await firebase.auth().signInWithEmailAndPassword(this.state.Email, this.state.Password)
      var userr = await firebase.auth().currentUser;
      var that = this
      firebase.database().ref('Users/' + userr.uid).once('value').then(async function (snapshot) {

        if (snapshot.val() == null) {
          await that.setState({ wait: false })
          that.props.navigation.navigate("TypeOfUser")
        } else {

          await that.setState({ wait: false })
          if (snapshot.val().Type === 'Client')
            that.props.navigation.navigate("ClientTab")
          else if (snapshot.val().Type === 'Livreur')
            that.props.navigation.navigate("LivreurTab")
          else if (snapshot.val().Type === 'Chef')
            that.props.navigation.navigate("ChefTab")
        }
      });

    } catch (error) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(this.state.Email, this.state.Password)
        var userr = await firebase.auth().currentUser;
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
          .catch(async (error) => {

          });
        firebase.database().ref('Users/' + userr.uid).once('value').then(async function (snapshot) {
          if (snapshot.val() == null) {
            await that.setState({ wait: false })
            that.props.navigation.navigate("TypeOfUser")
          } else {
            await that.setState({ wait: false })
            if (snapshot.val().Type === 'Client')
              that.props.navigation.navigate("ClientTab")
            else if (snapshot.val().Type === 'Livreur')
              that.props.navigation.navigate("LivreurTab")
            else if (snapshot.val().Type === 'Chef')
              that.props.navigation.navigate("ChefTab")
          }
        });

      } catch (error) {
        await this.setState({ wait: false })
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

  }




  signin = async () => {
    await this.setState({ wait: true })
    this.setState({ Email: "", Password: "" })
    var that = this
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('668586690257344', { permissions: ['public_profile', "email"] })

    if (type == 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      firebase.auth().signInAndRetrieveDataWithCredential(credential).then(() => {
        var user = firebase.auth().currentUser
        var uid = user.uid
        firebase.database().ref('Users/' + uid).once('value').then(async function (snapshot) {
          if (snapshot.val() == null) {
            user.updateProfile({
              photoURL: user.photoURL + "?type=large&redirect=true&width=600&height=600"
            })
            await that.setState({ wait: false })
            that.props.navigation.navigate("TypeOfUser")
          } else {
            await that.setState({ wait: false })
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

  render1() {
    return (
      <ActivityIndicator></ActivityIndicator>
    )
  }

  render2() {
    return (
      <View>
        <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding" enabled>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#FF2E2A', }}>JOET?</Text>
            <Text style={{ fontSize: 25 }}>
              Mangez, comme chez vous!
            </Text>
          </View>

          <View style={{ flex: 0.8, paddingBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Username</Text>
            <Item>
              <Input autoCapitalize='none' style={{ fontSize: 15 }} value={this.state.Email} placeholder="Type your username.." keyboardType={'email-address'} onChangeText={(Email) => this.setState({ Email })}></Input>
            </Item>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Password</Text>
            <Item>
              <Input autoCapitalize='none' style={{ fontSize: 15 }} value={this.state.Password} placeholder="Type you password.." secureTextEntry={true} onChangeText={(Password) => this.setState({ Password })}></Input>
            </Item>
          </View>

        </KeyboardAvoidingView>
        <View style={{ flex: 0.5, justifyContent: 'space-around', marginBottom: 30 }}>
          <Button rounded style={{ backgroundColor: '#FF2E2A', width: 300, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.login1()}><Label style={{ fontWeight: 'bold', color: 'white' }}>   Se connecter avec E-mail </Label></Button>
          <Button rounded style={{ backgroundColor: '#3c5a99', width: 300, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.signin()}><Label style={{ fontWeight: 'bold', color: 'white' }}>  Se connecter avec Facebook </Label></Button>
        </View>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {
          this.state.wait == true ?
            this.render1() :
            this.render2()
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
});