import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ScrollView, RefreshControl
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right, Card, CardItem } from 'native-base'
import * as firebase from 'firebase'
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
            Refresh: false
        }
    }

    onRefresh = async (Day1, Day2, Day3, ch) => {
        var that = this
        if (ch === "1")
            await (this.state.Plats1.length == 0 && this.state.Plats2.length == 0 && this.state.Plats3.length == 0)

        await firebase.database().ref('Commandes/').orderByChild('IdLivreurSortDate')
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
        var that = this
        await firebase.auth().onAuthStateChanged(async (user) => {
            if (user == null) {
                console.log('Null user')
            } else {
                this.setState({ Plats1: [], Plats2: [], Plats3: [] })
                var Day1 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate()).toString())).toString()
                var Day2 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 1).toString())).toString()
                var Day3 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 2).toString())).toString()
                this.setState({ Day1: Day1 }); this.setState({ Day2: Day2 }); this.setState({ Day3: Day3 })
                var uid = user.uid
                this.setState({ Id: uid })

                await firebase.database().ref('Commandes/').orderByChild('IdLivreurSortDate')
                    .startAt(uid).endAt(uid + '\uf8ff')
                    .on('child_changed', async function (snap) {
                        await that.setState({ Plats1: [], Plats2: [], Plats3: [] })
                        await that.onRefresh(Day1, Day2, Day3, "1")
                    })

                await firebase.database().ref('Commandes/').orderByChild('IdLivreurSortDate')
                    .startAt(uid).endAt(uid + '\uf8ff')
                    .on('child_removed', async function (snap) {
                        await that.setState({ Plats1: [], Plats2: [], Plats3: [], })
                        await that.onRefresh(Day1, Day2, Day3, "1")
                    })

                this.onRefresh(Day1, Day2, Day3, "0")
            }
        })
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
                <View style={{ justifyContent: 'center', paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Aujourd'hui</Text>
                </View>
                <Card>
                    {this.state.Plats1.map((Data, Ind) => {
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
                                                <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}>{Data.Date.substr(16, 5)}H</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.Plat}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Pour {" "}</Text>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.Qte} personne(s)</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Du chef {" "}</Text>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.NomChef}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Au client {" "}</Text>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.NomClient}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'green' }}>{Data.Etat}</Text>
                                                {Data.Livraison == "Gratuite" ?
                                                    <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'gray' }}> INCLUS</Text> :
                                                    console.log()
                                                }
                                            </View>
                                        </Body>
                                        <Right>
                                            <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                                <Text style={{ fontWeight: 'bold', color: 'gray' }}><Ionicons style={{ fontSize: 33, color: 'red' }} name="ios-information-circle" /></Text>
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

                <View style={{ justifyContent: 'center', paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Demain</Text>
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
                                            <Body >
                                                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}>{Data.Date.substr(16, 5)}H</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Plat}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Pour {" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.Qte} personne(s)</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Du chef {" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.NomChef}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Au client {" "}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{Data.NomClient}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'green' }}>{Data.Etat}</Text>
                                                    {Data.Livraison == "Gratuite" ?
                                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'gray' }}> INCLUS </Text> :
                                                        console.log()
                                                    }
                                                </View>
                                            </Body>
                                            <Right>
                                                <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                                    <Text style={{ fontWeight: 'bold', color: 'gray' }}><Ionicons style={{ fontSize: 33, color: 'red' }} name="ios-information-circle" /></Text>
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
                <View style={{ justifyContent: 'center', paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>{this.state.Day3.substr(0, 11)}</Text>
                </View>
                <Card>
                    {this.state.Plats3.map((Data, Ind) => {
                        if (Data.IdCommande === IdCommande3 && Ind != 0) {

                        } else {
                            IdCommande3 = Data.IdCommande
                            return (
                                <List key={Ind}>
                                    <ListItem thumbnail>
                                        <Left>
                                            <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                        </Left>
                                        <Body >
                                            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}>{Data.Date.substr(16, 5)}H</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.Plat}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Pour {" "}</Text>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.Qte} personne(s)</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Du chef {" "}</Text>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.NomChef}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Au client {" "}</Text>
                                                <Text style={{ fontWeight: 'bold' }}>{Data.NomClient}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'green' }}>{Data.Etat}</Text>
                                                {Data.Livraison == "Gratuite" ?
                                                    <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'gray' }}> INCLUS</Text> :
                                                    console.log()
                                                }
                                            </View>
                                        </Body>
                                        <Right>
                                            <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                                <Text style={{ fontWeight: 'bold', color: 'gray' }}><Ionicons style={{ fontSize: 33, color: 'red' }} name="ios-information-circle" /></Text>
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
                <Content>
                    {this.state.Plats1.length > 0 ? this.renderAbonnement1() : console.log()}
                    {this.state.Plats2.length > 0 ? this.renderAbonnement2() : console.log()}
                    {this.state.Plats3.length > 0 ? this.renderAbonnement3() : console.log()}
                    {(this.state.Plats1.length > 0 || this.state.Plats2.length > 0 || this.state.Plats3.length) > 0 ?
                        console.log() : <View style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Pas de livraison</Text></View>}
                </Content>

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
    }
});