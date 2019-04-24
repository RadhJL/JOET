import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ToastAndroid, Alert
} from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Form, Input, Label, Thumbnail } from 'native-base';
import * as firebase from 'firebase'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Nom: '',
            PhotoUrl: null,
            Commandes: 0,

        }
    }

    async componentDidMount() {


        var that = this
        await firebase.auth().onAuthStateChanged((user) => {
            if (user == null) {
                console.log('Null user')
            } else {
                that.setState({ Nom: user.displayName })
                that.setState({ PhotoUrl: user.photoURL })
                firebase.database().ref('Client/' + user.uid + "/Commandes").once('value', function (s) {
                    //console.log(s.val())
                    that.setState({ Commandes: s.val() })
                })
            }
        })

    }


    async SignOut() {
        try {
            var that = this
            await firebase.auth().signOut().then(
                that.props.navigation.navigate('Login')
            )
        } catch (error) {
            alert(error)
        }
    }


    render() {

        return (

            <Container  >
                <Content >
                    <View style={{ paddingTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Thumbnail large source={{ uri: this.state.PhotoUrl }}></Thumbnail>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}> {this.state.Nom}</Text>
                        <Text>{this.state.Commandes} Commande(s)</Text>
                    </View>
                    <View style={{ paddingTop: 100, justifyContent: 'space-around' }}>
                        <Button
                            full onPress={() => this.props.navigation.navigate('ModificationClient')}
                        >
                            <Label style={{ fontWeight: 'bold', color: 'white' }}>Edition Profile</Label>
                        </Button>
                        <Button full style={{ backgroundColor: 'green' }} onPress={() => Alert.alert(
                            'Déconnecter',
                            'Voulez-vous vraiment se déconnecter?',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log(),
                                    style: 'cancel',
                                },
                                { text: 'OK', onPress: () => this.SignOut() },
                            ],
                            { cancelable: false },
                        )}><Label style={{ fontWeight: 'bold', color: 'white' }}>Déconnecter</Label></Button>
                    </View>
                </Content>

            </Container>
        );
    }
}
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});