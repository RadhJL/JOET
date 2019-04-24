import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ToastAndroid
} from "react-native";
import * as firebase from 'firebase'
import { Button, Container, Header, Content, Card, CardItem, Body, Input } from 'native-base';

class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Commande: [],
            Date: '',
            Code: '',
        }
    }
    componentDidMount() {
        this.setState({ Commande: this.props.navigation.getParam('Data') })
        this.setState({ Date: this.props.navigation.getParam('Data').Date.substr(0, 11) + ' ' + this.props.navigation.getParam('Data').Date.substr(16, 5) })
        //      console.log(this.props.navigation.getParam('Data'), this.state.Commande)


    }

    async ShowProfile(ch) {
        var that = this
        if (ch === 'Client') {
            firebase.database().ref('Client/' + this.state.Commande.IdClient).once('value', function (snap) {
                that.props.navigation.navigate('ProfileClient', { Profile: snap.val() })
            })
        } else {
            firebase.database().ref('Chef/' + this.state.Commande.IdChef).once('value', function (snap) {
                that.props.navigation.navigate('ProfileChef', { Profile: snap.val() })
            })
        }

    }


    async ChangeState() {

        try {
            // console.log(this.state.Code,this.state.Commande.CleClient.toString())
            if (this.state.Commande.Etat === 'En Preparation') {

                if (this.state.Code === this.state.Commande.CleChef.toString()) {
                    await firebase.database().ref('Commandes/' + this.state.Commande.IdCommande).update({
                        Etat: 'En Livraison'
                    })
                    ToastAndroid.show("Confirmation chef avec succes!", ToastAndroid.SHORT)
                    this.props.navigation.navigate('Liste')

                } else {

                    alert("Ce code n'est pas correct prier de verifier!")
                }
            } else {
                console.log(this.state.Code == this.state.Commande.CleClient)
                if (this.state.Code === this.state.Commande.CleClient.toString()) {
                    await firebase.database().ref('Commandes/' + this.state.Commande.IdCommande).remove()
                    await firebase.database().ref('Commandes/Historique/' + this.state.Commande.IdCommande).set(this.state.Commande)
                    await firebase.database().ref('Commandes/Historique/' + this.state.Commande.IdCommande).update({
                        Etat: 'Terminé'
                    })
                    var CommandesChef = await firebase.database().ref('Chef/' + this.state.Commande.IdChef + "/Commandes").once('value', function (s) {
                        return s.val()
                    })
                    var CommandesLivreur = await firebase.database().ref('Livreur/' + this.state.Commande.IdLivreur + "/Commandes").once('value', function (s) {
                        return s.val()
                    })
                    var CommandesClient = await firebase.database().ref('Client/' + this.state.Commande.IdClient + "/Commandes").once('value', function (s) {
                        return s.val()
                    })
                    console.log(CommandesChef, CommandesClient, CommandesLivreur)
                    await firebase.database().ref('Chef/' + this.state.Commande.IdChef).update({
                        Commandes: (CommandesChef.val() + 1)
                    })
                    await firebase.database().ref('Livreur/' + this.state.Commande.IdLivreur).update({
                        Commandes: (CommandesLivreur.val() + 1)
                    })
                    await firebase.database().ref('Client/' + this.state.Commande.IdClient).update({
                        Commandes: (CommandesClient.val() + 1)
                    })
                    ToastAndroid.show("Confirmation client avec succes!", ToastAndroid.SHORT)

                    this.props.navigation.navigate('Liste')
                } else {

                    alert("Ce code n'est pas correct prier de verifier!")
                }
            }
        } catch (error) {
            alert("Error")
            console.log(error)

        }

    }
    render() {
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem header>
                            <Text style={{ fontWeight: 'bold' }}>ID COMMANDE :{this.state.Commande.IdCommande}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>


                                <Text style={{ fontWeight: 'bold' }}>Du chef: </Text>
                                <Button style={{ height: 20 }} transparent onPress={() => this.ShowProfile('Chef')}>
                                    <Text style={{ fontWeight: 'bold', color: 'blue' }}>{this.state.Commande.NomChef}</Text>
                                </Button>
                                <Text>{this.state.Commande.Adresse1Chef} {this.state.Commande.Adresse2Chef}</Text>
                                <Text>{this.state.Commande.NumeroChef}</Text>

                                <Text style={{ fontWeight: 'bold' }}>Au Client: </Text>
                                <Button style={{ height: 20 }} transparent onPress={() => this.ShowProfile('Client')}>
                                    <Text style={{ fontWeight: 'bold', color: 'blue' }}>{this.state.Commande.NomClient}</Text>
                                </Button>
                                {/* TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST  */}
                                <Text style={{ fontWeight: 'bold' }}>CodeClient {this.state.Commande.CleClient}</Text>
                                <Text style={{ fontWeight: 'bold' }} > CodeChef {this.state.Commande.CleChef}</Text>
                                {/* TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST  */}
                                <Text>{this.state.Commande.Adresse1Client} {this.state.Commande.Adresse2Client}</Text>
                                <Text>{this.state.Commande.NumeroClient}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Date: </Text>
                                <Text>{this.state.Date} </Text>
                                <Text style={{ fontWeight: 'bold' }}>Plat: </Text>
                                <Text>{this.state.Commande.Qte}x {this.state.Commande.Plat}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Etat: </Text>
                                <Text>{this.state.Commande.Etat}</Text>
                                {this.state.Commande.Etat === 'En Preparation' ?
                                    <Text>Code Chef</Text>
                                    : <Text>Code Client</Text>}
                                <View style={{ flexDirection: 'row' }}>
                                    <Input placeholder={'Code...'} keyboardType='numeric' maxLength={6} onChangeText={(Code) => this.setState({ Code })}></Input>
                                    <Button onPress={() => this.ChangeState()}><Text style={{ fontWeight: 'bold', color: 'white' }}>Confirmer</Text></Button>
                                </View>
                            </Body>
                        </CardItem>
                        <CardItem footer>

                        </CardItem>
                    </Card>
                    <Button full onPress={() => this.props.navigation.navigate('Liste')}><Text style={{ fontWeight: 'bold', color: 'white' }}>Retour</Text></Button>

                </Content>
            </Container>
        );
    }
}
export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});