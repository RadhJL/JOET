import React, { Component } from "react";
import {
    View,
    StyleSheet, Text
} from "react-native";
import { Container, Header, Title, Button, Left, Right, Body, Icon, Label, Input,Content } from 'native-base';
import * as firebase from 'firebase'

export default class Acceuil extends React.Component {

    constructor(props) {
        super(props)

    }

    async componentDidMount() {
        var that = this
        await firebase.auth().onAuthStateChanged((user) => {
            if (user == null)
                that.props.navigation.navigate("Login")
          else {
                var userr = firebase.auth().currentUser;
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

            }

        })
    }



    render() {
        return (

            <Container>
                <Content >
                    <View style={{justifyContent:'center',alignItems:'center',flex:1,paddingTop:250}}>
                        <Label style={{ fontWeight: 'bold', fontSize: 30 }}>JOET</Label>
                        <Label style={{ fontSize: 25 }}>Manger, comme chez vous!</Label>
                    </View>
                </Content>
            </Container>

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