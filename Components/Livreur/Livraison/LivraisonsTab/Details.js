import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ToastAndroid, Image, Dimensions, BackHandler, KeyboardAvoidingView, Alert
} from "react-native";
import * as firebase from 'firebase'
import { Button, Container, Header, Content, Card, CardItem, Body, Input, Left, Right, Icon, Thumbnail, Item } from 'native-base';
var Plat = [require('./../../../../assets/Kosksi.jpg'), require('./../../../../assets/Makrouna1.jpg'), require('./../../../../assets/Rouz.jpg')]
import ActivityIndicator from '../../../ActivityIndicator'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Commande: [],
            Date: '',
            Code: '',
            ChefPhoto: '',
            ClientPhoto: '',
            wait: true
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    async componentDidMount() {
        await BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        await this.setState({ Commande: this.props.navigation.getParam('Data') })
        var that = this
        this.setState({ Date: this.props.navigation.getParam('Data').Date.substr(0, 11) + ' ' + this.props.navigation.getParam('Data').Date.substr(16, 5) })
        await firebase.database().ref("Chef/" + this.state.Commande.IdChef + "/PhotoUrl").once("value", async function (snap) {
            await that.setState({ ChefPhoto: snap.val() })
        })
        await firebase.database().ref("Client/" + this.state.Commande.IdClient + "/PhotoUrl").once("value", async function (snap) {
            await that.setState({ ClientPhoto: snap.val() })
        })
        this.setState({ wait: false })
    }

    async ShowProfile(ch) {
        var that = this
        if (ch === 'Client') {
            this.props.navigation.navigate('ProfileClient', { IdClient: this.state.Commande.IdClient, AdresseClient: this.state.Commande.AdresseClient })
        } else {
            this.props.navigation.navigate('ProfileChef', { IdChef: this.state.Commande.IdChef })
        }

    }

    async ChangeState() {
        try {
            if (this.state.Commande.Etat === 'En Preparation') {
                if (this.state.Code === this.state.Commande.CleChef.toString()) {
                    await this.setState({ wait: true })

                    await firebase.database().ref('Commandes/' + this.state.Commande.IdCommande).update({
                        Etat: 'En Livraison'
                    })
                    await this.setState({ wait: false })
                    alert("Confirmation chef avec succes")

                    this.props.navigation.navigate('Liste')
                } else {
                    alert("Verifier le code s'il vous plait !")
                }
            } else {
                if (this.state.Code === this.state.Commande.CleClient.toString()) {
                    await this.setState({ wait: true })

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
                    firebase.database().ref('Chef/' + this.state.Commande.IdChef).update({
                        Commandes: (CommandesChef.val() + 1)
                    })
                    firebase.database().ref('Livreur/' + this.state.Commande.IdLivreur).update({
                        Commandes: (CommandesLivreur.val() + 1)
                    })
                    firebase.database().ref('Client/' + this.state.Commande.IdClient).update({
                        Commandes: (CommandesClient.val() + 1)
                    })

                    alert("Confirmation client avec succes")
                    await this.setState({ wait: false })
                    this.props.navigation.goBack(null)
                } else {
                    alert("Ce code n'est pas correct prier de verifier!")
                }
            }
        } catch (error) {
            alert("Error")
            console.log(error)

        }

    }
    getInd(ch) {
        if (ch == "Couscous") {
            return 0
        }
        if (ch == "Makrouna")
            return 1
        else return 2
    }
    render() {
        return (
            <Container>
                {this.state.wait == true ?
                    <ActivityIndicator />
                    :
                    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding" enabled>

                        {/* <Header transparent style={{ height: 60, backgroundColor: 'white' }}>
                            <Left><Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: '#FF2E2A' }} name="arrow-back"></Icon></Button></Left>
                            <Body style={{ alignSelf: 'center', flex: 3, alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold', color: '#FF2E2A' }}>ID {this.state.Commande.IdCommande}</Text>
                                {this.state.Commande.Livraison == 2 ? console.log() :
                                    <Text style={{ fontWeight: 'bold', color: 'gray' }}>Livraison INCLUS</Text>}
                            </Body>
                            <Right>
                            </Right>
                        </Header> */}

                        <Header style={{ height: styles.dim.height / 10, paddingTop: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' }}>
                            <Left style={{ flex: 2 }}>
                                <Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: '#FF2E2A' }} name="arrow-back"></Icon></Button>

                            </Left>
                            <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center', paddingLeft: 33 }}>
                                <Text style={{ fontWeight: 'bold', color: '#FF2E2A' }}>ID {this.state.Commande.IdCommande}</Text>
                                {this.state.Commande.Livraison == 2 ? console.log() :
                                    <Text style={{ fontWeight: 'bold', color: 'gray',fontSize:13,paddingTop:4 }}>Livraison INCLUS</Text>}
                            </Body>
                            <Right style={{ flex: 3 }}>
                            </Right>
                        </Header>


                        <Content>
                            {this.state.Commande.Etat == "En Livraison" ?
                                <CardItem style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
                                    <View >
                                        <Button style={{ flexDirection: 'column', width: 80, height: 80, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Client')}>
                                            <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} large rounded source={{ uri: this.state.ClientPhoto }}></Thumbnail>
                                        </Button>
                                        <Text style={{ paddingTop: 30, fontWeight: 'bold', alignSelf: 'center' }}>CLIENT {this.state.Commande.NomClient}</Text>
                                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                            <Text style={{ alignSelf: 'center', }}>{this.state.Commande.AdresseClient} </Text>
                                            <Text style={{ paddingTop: 3, paddingLeft: 2 }}><FontAwesome style={{ fontSize: 15 }} name="home" /></Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 5 }}>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>{this.state.Commande.NumeroClient} </Text>
                                            <Text style={{ paddingTop: 3 }}><MaterialIcons name="phone-iphone" /></Text>
                                        </View>

                                    </View>
                                </CardItem> :
                                <CardItem style={{ justifyContent: 'space-around', paddingTop: 10 }}>
                                    <View >
                                        <Button style={{ flexDirection: 'column', width: 80, height: 80, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Chef')}>
                                            <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} large rounded source={{ uri: this.state.ChefPhoto }}></Thumbnail>
                                        </Button>
                                        <Text style={{ paddingTop: 30, fontWeight: 'bold', alignSelf: 'center' }}>CHEF {this.state.Commande.NomChef}</Text>
                                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                            <Text style={{ alignSelf: 'center', }}>{this.state.Commande.AdresseChef} </Text>
                                            <Text style={{ paddingTop: 3 }}><FontAwesome style={{ fontSize: 15 }} name="home" /></Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 5 }}>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>{this.state.Commande.NumeroChef} </Text>
                                            <Text style={{ paddingTop: 3 }}><MaterialIcons name="phone-iphone" /></Text>
                                        </View>
                                    </View>
                                </CardItem>

                            }
                            <Card style={{ padding: 3, paddingBottom: 4, margin: 5 }}>
                                <CardItem>
                                    <Body>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', alignSelf: 'center', fontSize: 20 }}>{this.state.Commande.Plat}</Text>
                                            <Text style={{ alignSelf: 'center', fontWeight: 'bold', paddingTop: 1 }}> pour {this.state.Commande.Qte}{" "} personne(s)</Text>
                                        </View>
                                        {this.state.Commande.Livraison == 2 ?
                                            <View style={{ fontWeight: 'bold', paddingTop: 10, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Prix   </Text>
                                                <Text style={{ alignSelf: 'center' }}>{this.state.Commande.Prix + 2 + " "}DT</Text>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Prix   </Text>
                                                <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>{this.state.Commande.Prix} DT {" "}</Text>
                                                <Text style={{ fontWeight: 'bold', color: 'gray' }}>INCLUS</Text>
                                            </View>
                                        }
                                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Etat   </Text>
                                            <Text style={{ alignSelf: 'center', color: 'green', fontWeight: 'bold' }}>{this.state.Commande.Etat}</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Date  </Text>
                                            <Text style={{}}>{this.state.Date}H</Text>
                                        </View>
                                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 13, paddingTop: 5, color: 'gray' }}>Code Chef {this.state.Commande.CleChef} Code client {this.state.Commande.CleClient}  </Text>
                                    </Body>
                                </CardItem>
                                {this.state.Commande.Etat == "En Preparation" ?
                                    <Card>
                                        <Item>
                                            <Input keyboardType={"number-pad"} maxLength={6} style={{ fontSize: 15 }} placeholder="Entrer code chef" onChangeText={(Code) => this.setState({ Code })}></Input>
                                        </Item>
                                        <Button transparent full style={{ backgroundColor: '#fafafa', marginTop: 10 }} onPress={() => this.ChangeState()}>
                                            <Text style={{}}><MaterialCommunityIcons style={{ fontSize: 40, color: '#FF2E2A' }} name="briefcase-check" /></Text>
                                        </Button>
                                    </Card> :
                                    <Card>
                                        <Item>
                                            <Input keyboardType={"number-pad"} maxLength={6} style={{ fontSize: 15 }} placeholder="Entrer code client" onChangeText={(Code) => this.setState({ Code })}  ></Input>
                                        </Item>
                                        <Button transparent full style={{ backgroundColor: '#fafafa', marginTop: 10 }} onPress={() => this.ChangeState()} >
                                            <Text style={{}}><MaterialCommunityIcons style={{ fontSize: 40, color: '#FF2E2A' }} name="briefcase-check" /></Text>
                                        </Button>
                                    </Card>
                                }
                            </Card>

                            {this.state.Commande.Etat == "En Preparation" ?
                                <CardItem style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
                                    <View >
                                        <Button style={{ flexDirection: 'column', width: 80, height: 80, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Client')}>
                                            <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} large rounded source={{ uri: this.state.ClientPhoto }}></Thumbnail>
                                        </Button>
                                        <Text style={{ paddingTop: 30, fontWeight: 'bold', alignSelf: 'center' }}>CLIENT {this.state.Commande.NomClient}</Text>
                                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                            <Text style={{ alignSelf: 'center' }}>{this.state.Commande.AdresseClient} </Text>
                                            <Text style={{ paddingTop: 3, paddingLeft: 2 }}><FontAwesome style={{ fontSize: 15 }} name="home" /></Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 5 }}>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>{this.state.Commande.NumeroClient} </Text>
                                            <Text style={{ paddingTop: 3 }}><MaterialIcons name="phone-iphone" /></Text>
                                        </View>

                                    </View>
                                </CardItem> :
                                <CardItem style={{ justifyContent: 'space-around', paddingTop: 10 }}>
                                    <View >
                                        <Button style={{ flexDirection: 'column', width: 80, height: 80, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Chef')}>
                                            <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} large rounded source={{ uri: this.state.ChefPhoto }}></Thumbnail>
                                        </Button>
                                        <Text style={{ paddingTop: 30, fontWeight: 'bold', alignSelf: 'center' }}>CHEF {this.state.Commande.NomChef}</Text>
                                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                            <Text style={{ alignSelf: 'center' }}>{this.state.Commande.AdresseChef} </Text>
                                            <Text style={{ paddingTop: 3 }}><FontAwesome style={{ fontSize: 15 }} name="home" /></Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 5 }}>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>{this.state.Commande.NumeroChef} </Text>
                                            <Text style={{ paddingTop: 3 }}><MaterialIcons name="phone-iphone" /></Text>
                                        </View>
                                    </View>
                                </CardItem>

                            }


                        </Content>

                    </KeyboardAvoidingView>
                }

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
    },
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});