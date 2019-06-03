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
        if (ch === 'Client') {
            this.props.navigation.navigate('ProfileClient', { IdClient: this.state.Commande.IdClient })
        } else {
            this.props.navigation.navigate('ProfileChef', { IdChef: this.state.Commande.IdChef })
        }

    }


    render() {
        return (
            <Container>
                {this.state.wait == true ?
                    <ActivityIndicator />
                    :
                    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding" enabled>

                        <Header style={{ height: styles.dim.height / 10, paddingTop: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' }}>
                            <Left style={{ flex: 2 }}>
                                <Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: '#FF2E2A' }} name="arrow-back"></Icon></Button>

                            </Left>
                            <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center', paddingLeft: 33 }}>
                                <Text style={{ fontWeight: 'bold', color: '#FF2E2A' }}>ID {this.state.Commande.IdCommande}</Text>
                                {this.state.Commande.Livraison == 2 ? console.log() :
                                    <Text style={{ fontWeight: 'bold', color: 'gray', fontSize: 13, paddingTop: 4 }}>Livraison INCLUS</Text>}
                            </Body>
                            <Right style={{ flex: 3 }}>
                            </Right>
                        </Header>
                        <Content>
                            <CardItem style={{ justifyContent: 'space-around', paddingTop: 10 }}>
                                <View >
                                    <Button style={{ flexDirection: 'column', width: 80, height: 80, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Chef')}>
                                        <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} large rounded source={{ uri: this.state.ChefPhoto }}></Thumbnail>
                                    </Button>
                                    <Text style={{ paddingTop: 30, fontWeight: 'bold', alignSelf: 'center', fontSize: 16 }}>CHEF {this.state.Commande.NomChef}</Text>
                                </View>
                            </CardItem>
                            <Card style={{ padding: 7 }}>
                                <Body>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', fontStyle: 'italic', alignSelf: 'center', fontSize: 20 }}>{this.state.Commande.Plat}</Text>
                                        <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}> pour {this.state.Commande.Qte}{" "} personne(s)</Text>
                                    </View>
                                    {this.state.Commande.Livraison == 2 ?
                                        <View style={{ fontWeight: 'bold', paddingTop: 10, flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Prix  </Text>
                                            <Text style={{ alignSelf: 'center' }}>{this.state.Commande.Prix + 2 + " "}DT</Text>
                                        </View>
                                        :
                                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Prix </Text>
                                            <Text style={{ alignSelf: 'center' }}>{this.state.Commande.Prix} DT {" "}</Text>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>INCLUS</Text>
                                        </View>
                                    }

                                    <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Date de livraison  </Text>
                                        <Text style={{}}>{this.state.Date}H</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Etat  </Text>
                                        <Text style={{ alignSelf: 'center', color: 'green', fontWeight: 'bold' }}>{this.state.Commande.Etat}</Text>

                                    </View>
                                </Body>
                            </Card>

                            <CardItem style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
                                <View >
                                    <Button style={{ flexDirection: 'column', width: 80, height: 80, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Client')}>
                                        <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} large rounded source={{ uri: this.state.ClientPhoto }}></Thumbnail>
                                    </Button>
                                    <Text style={{ paddingTop: 30, fontWeight: 'bold', alignSelf: 'center', fontSize: 16 }}>CLIENT {this.state.Commande.NomClient}</Text>


                                </View>
                            </CardItem>

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