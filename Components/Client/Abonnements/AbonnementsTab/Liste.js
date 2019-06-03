import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ScrollView, RefreshControl, Dimensions
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right, CardItem, Card } from 'native-base'
import * as firebase from 'firebase'
import ActivityIndicator from './../../../ActivityIndicator'
import { Ionicons } from '@expo/vector-icons'
var Plat = [require('../../../../assets/Kosksi.jpg'), require('../../../../assets/Makrouna1.jpg'), require('../../../../assets/Rouz.jpg')]
let IdCommande1 = ""
let IdCommande2 = ""
let IdCommande3 = ""
class Liste extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Id: '',
            Plats1: [],
            Plats2: [],
            Plats3: [],
            Day1: '',
            Day2: '',
            Day3: '',
            Numero: '',
            wait: true
        }
    }

    onRefresh = async (Day1, Day2, Day3) => {
        var that = this
        await firebase.database().ref('Commandes/').orderByChild('IdClientSortDate')
            .startAt(this.state.Id).endAt(this.state.Id + '\uf8ff')
            .on('child_added', async function (snap) {

                if (snap.val().Date.substr(0, 15) === Day1.substr(0, 15)) {
                    var newData = [...that.state.Plats1]
                    newData.push(snap.val())
                    await that.setState({ Plats1: newData })
                } else if (snap.val().Date.substr(0, 15) === Day2.substr(0, 15)) {
                    var newData = [...that.state.Plats2]
                    newData.push(snap.val())
                    await that.setState({ Plats2: newData })
                }
                else if (snap.val().Date.substr(0, 15) === Day3.substr(0, 15)) {
                    var newData = [...that.state.Plats3]
                    newData.push(snap.val())
                    await that.setState({ Plats3: newData })
                }
            })


    }


    async componentDidMount() {
        await firebase.auth().onAuthStateChanged(async (user) => {
            if (user == null) {
                console.log('Null user')
                //////????????????????? normalement tokhrej mel app ?
            } else {
                this.setState({ Plats1: [], Plats2: [], Plats3: [], })
                var Day1 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate()).toString())).toString()
                var Day2 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 1).toString())).toString()
                var Day3 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 2).toString())).toString()
                this.setState({ Day1: Day1 }); this.setState({ Day2: Day2 }); this.setState({ Day3: Day3 })
                var uid = firebase.auth().currentUser.uid
                this.setState({ Id: uid })
                var that = this


                await firebase.database().ref('Commandes/').orderByChild('IdClientSortDate')
                    .startAt(uid).endAt(uid + '\uf8ff')
                    .on('child_changed', async function (snap) {
                        await that.setState({ Plats1: [], Plats2: [], Plats3: [], })
                        await that.onRefresh(Day1, Day2, Day3)
                    })
                await firebase.database().ref('Commandes/').orderByChild('IdClientSortDate')
                    .startAt(uid).endAt(uid + '\uf8ff')
                    .on('child_removed', async function (snap) {
                        await that.setState({ Plats1: [], Plats2: [], Plats3: [], })
                        await that.onRefresh(Day1, Day2, Day3)

                    })
                await that.onRefresh(Day1, Day2, Day3)

            }
        })
        await this.setState({ wait: false })

    }

    choose(x) {
        if (x === "Couscous")
            return 0
        if (x == "Makrouna")
            return 1
        return 2
    }

    renderAbonnement1() {
        return (
            <View>
                <View style={{ justifyContent: 'center', paddingLeft: 10,paddingTop:10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#FF2E2A' }}>Aujourd'hui</Text>
                </View>
                <Card>
                    {
                        this.state.Plats1.map((Data, Ind) => {

                            {/* console.log(Data.IdCommande,IdCommande1) */ }
                            if (Data.IdCommande === IdCommande1 && Ind != 0) {

                            } else {
                                IdCommande1 = Data.IdCommande
                                return (
                                    <List key={Ind}>
                                        <ListItem thumbnail>
                                            <Left>
                                                <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                            </Left>
                                            <Body >
                                                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}>{Data.Plat}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Pour {" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Qte} personne(s)</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Livré a{" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Date.substr(16, 5)}H</Text>
                                                </View>

                                                {/* <Text note numberOfLines={1} style={{}}>Livré a{" "}{Data.Date.substr(16, 5)}H</Text> */}

                                                {/* <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'green' }}>{Data.Etat}</Text> */}
                                                {Data.Livraison == "Gratuite" ?
                                                    <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'gray' }}>Livraison INCLUS</Text> :
                                                    console.log()
                                                }
                                            </Body>
                                            <Right>

                                                <Button transparent style={{ backgroundColor: 'white' }} onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                                    <Text style={{ fontWeight: 'bold', color: 'gray' }}><Ionicons style={{ fontSize: 33, color: '#FF2E2A' }} name="ios-information-circle" /></Text>
                                                </Button>

                                            </Right>

                                        </ListItem>
                                    </List>
                                )


                            }

                        })

                    }
                </Card>
            </View>
        )

    }
    renderAbonnement2() {
        return (
            <View>
                <View style={{ justifyContent: 'center', paddingLeft: 10,paddingTop:10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#FF2E2A' }}>Demain</Text>
                </View>
                <Card>
                    {

                        this.state.Plats2.map((Data, Ind) => {
                            if (Data.IdCommande === IdCommande2 && Ind != 0) {

                            } else {
                                IdCommande2 = Data.IdCommande
                                return (
                                    <List key={Ind}>
                                        <ListItem thumbnail>
                                            <Left>
                                                <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                            </Left>
                                            <Body>
                                                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}>{Data.Plat}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Pour {" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Qte} personne(s)</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Livré a{" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Date.substr(16, 5)}H</Text>
                                                </View>

                                                {/* <Text note numberOfLines={1} style={{}}>Livré a{" "}{Data.Date.substr(16, 5)}H</Text> */}

                                                {/* <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'green' }}>{Data.Etat}</Text> */}
                                                {Data.Livraison == "Gratuite" ?
                                                    <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'gray' }}>Livraison INCLUS</Text> :
                                                    console.log()
                                                }
                                            </Body>
                                            <Right>
                                                <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                                    <Text style={{ fontWeight: 'bold', color: 'gray' }}><Ionicons style={{ fontSize: 33, color: '#FF2E2A' }} name="ios-information-circle" /></Text>
                                                </Button>
                                            </Right>
                                        </ListItem>
                                    </List>
                                )


                            }
                        })
                    }
                </Card>
            </View>
        )

    }
    renderAbonnement3() {
        return (
            <View>
                <View style={{ justifyContent: 'center', paddingLeft: 10,paddingTop:10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#FF2E2A' }}>{this.state.Day3.substr(0, 11)}</Text>
                </View>
                <Card>
                    {
                        this.state.Plats3.map((Data, Ind) => {

                            if (Data.IdCommande === IdCommande3 && Ind != 0) {

                            } else {
                                IdCommande3 = Data.IdCommande
                                return (
                                    <List key={Ind}>
                                        <ListItem thumbnail>
                                            <Left>
                                                <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                            </Left>
                                            <Body>
                                                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}>{Data.Plat}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Pour {" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Qte} personne(s)</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Livré a{" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Date.substr(16, 5)}H</Text>
                                                </View>

                                                {/* <Text note numberOfLines={1} style={{}}>Livré a{" "}{Data.Date.substr(16, 5)}H</Text> */}

                                                {/* <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'green' }}>{Data.Etat}</Text> */}
                                                {Data.Livraison == "Gratuite" ?
                                                    <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'gray' }}>Livraison INCLUS</Text> :
                                                    console.log()
                                                }
                                            </Body>
                                            <Right>
                                                <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                                    <Text style={{ fontWeight: 'bold', color: 'gray' }}><Ionicons style={{ fontSize: 33, color: '#FF2E2A' }} name="ios-information-circle" /></Text>
                                                </Button>
                                            </Right>
                                        </ListItem>
                                    </List>
                                )


                            }
                        })
                    }
                </Card>
            </View>
        )

    }

    render() {
        return (

            <Container>
                {this.state.wait == true ?
                    <ActivityIndicator></ActivityIndicator>
                    :
                    <Content>
                        {this.state.Plats1.length > 0 ? this.renderAbonnement1() : console.log()}
                        {this.state.Plats2.length > 0 ? this.renderAbonnement2() : console.log()}
                        {this.state.Plats3.length > 0 ? this.renderAbonnement3() : console.log()}
                        {(this.state.Plats1.length > 0 || this.state.Plats2.length > 0 || this.state.Plats3.length) > 0 ?
                            console.log() :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: styles.dim.height - styles.dim.height / 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'gray' }}>Vous n'avez pas de commande</Text>
                            </View>
                        }
                    </Content>
                }
            </Container>

        );
    }
}
export default Liste;

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