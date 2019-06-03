import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, Image, Dimensions
} from "react-native";

import { Button, Container, Header, Content, Card, CardItem, Body, Left, Icon, Thumbnail } from 'native-base';
import * as firebase from 'firebase'
import ActivityIndcator from '../../../ActivityIndicator'
var Plat = [require('./../../../../assets/Kosksi.jpg'), require('./../../../../assets/Makrouna1.jpg'), require('./../../../../assets/Rouz.jpg')]

class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Commande: [],
            ChefPhoto: '',
            LivreurPhoto: '',
            wait: true
        }
    }
    async componentDidMount() {
        await this.setState({ Commande: this.props.navigation.getParam('Data') })
        var that = this
        await firebase.database().ref("Chef/" + this.state.Commande.IdChef + "/PhotoUrl").once("value", async function (snap) {
            that.setState({ ChefPhoto: snap.val() })
            console.log(that.state.ChefPhoto)
        })
        await firebase.database().ref("Livreur/" + this.state.Commande.IdLivreur + "/PhotoUrl").once("value", async function (snap) {
            that.setState({ LivreurPhoto: snap.val() })
            console.log(that.state.LivreurPhoto)
        })
        this.setState({ wait: false })

    }

    async ShowProfile(ch) {

        if (ch === 'Chef') {
            this.props.navigation.navigate('ProfileChef', { IdChef: this.state.Commande.IdChef })
        } else {
            this.props.navigation.navigate('ProfileLivreur', { IdLivreur: this.state.Commande.IdLivreur })
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
                    <ActivityIndcator />
                    :
                    <Container>
                        <Header transparent style={{ height: 50, backgroundColor: 'white' }}>
                            <Left><Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: '#FF2E2A' }} name="arrow-back"></Icon></Button></Left>
                            <Body style={{ alignSelf: 'center', flex: 3, alignItems: 'center', paddingRight: 55 }}>
                                <Text style={{ fontWeight: 'bold', color: '#FF2E2A' }}>ID {this.state.Commande.IdCommande}</Text>
                            </Body>

                        </Header>
                        <Content>

                            <CardItem style={{ alignContent: 'center', justifyContent: 'center', width: styles.dim.width - 100, alignSelf: 'center' }}>
                                <Image source={Plat[this.getInd(this.state.Commande.Plat)]} style={{ height: styles.dim.height / 4, width: null, flex: 1 }} />
                            </CardItem>

                            <CardItem >

                                <Body>
                                    <Card style={{ width: styles.dim.width - styles.dim.width / 30, alignSelf: 'center', padding: 10 }}>

                                        <Text style={{ fontWeight: 'bold', fontStyle: 'italic', alignSelf: 'center', fontSize: 20 }}>{this.state.Commande.Plat}</Text>
                                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Quantité </Text>
                                            <Text style={{ alignSelf: 'center', fontWeight: 'bold',color:'gray' }}> {this.state.Commande.Qte}{" "}personne(s)</Text>
                                        </View>

                                        {this.state.Commande.Livraison == 2 ?
                                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Prix</Text>
                                                <Text style={{ alignSelf: 'center',fontWeight:'bold',color:'gray' }}>  {this.state.Commande.Prix + 2 + " "}DT</Text>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Prix</Text>
                                                <Text style={{ fontWeight: 'bold' }}> {this.state.Commande.Prix} DT {" "}</Text>
                                                <Text style={{ fontWeight: 'bold', color: 'gray' }}>Livraison INCLUS</Text>

                                            </View>
                                        }
                                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Etat </Text>
                                            <Text style={{ color: 'green', fontWeight: 'bold' }}> {this.state.Commande.Etat}</Text>
                                        </View>

                                        <Text style={{ fontWeight: 'bold', paddingTop: 10 }}>Lieu de livraison </Text>
                                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', paddingTop: 8, color: 'gray' }}>{this.state.Commande.AdresseClient}</Text>
                                    </Card>

                                </Body>
                            </CardItem>
                            <Card style={{marginBottom:10}}>
                                <CardItem style={{ justifyContent: 'space-around', paddingTop: 10 }}>
                                    <View >
                                        <Button style={{ flexDirection: 'column', width: 60, height: 60, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Chef')}>
                                            <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} rounded source={{ uri: this.state.ChefPhoto }}></Thumbnail>
                                        </Button>
                                        <Text style={{ paddingTop: 10, fontWeight: 'bold' }}>Chef {this.state.Commande.NomChef}</Text>
                                    </View>
                                </CardItem>

                                <CardItem style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
                                    <View >
                                        <Button style={{ flexDirection: 'column', width: 60, height: 60, alignSelf: 'center' }} transparent onPress={() => this.ShowProfile('Livreur')}>
                                            <Thumbnail style={{ borderWidth: 2, borderColor: '#FF2E2A' }} rounded source={{ uri: this.state.LivreurPhoto }}></Thumbnail>
                                        </Button>
                                        <Text style={{ paddingTop: 10, fontWeight: 'bold' }}>Livreur {this.state.Commande.NomLivreur}</Text>
                                    </View>
                                </CardItem>
                            </Card>
                        </Content>

                    </Container>


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