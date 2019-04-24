import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ScrollView, RefreshControl
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right } from 'native-base'
import * as firebase from 'firebase'

var Plat = [require('../../../../assets/Kosksi.jpg'), require('../../../../assets/Makrouna1.jpg'), require('../../../../assets/Rouz.jpg')]

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
        }
    }

    onRefresh = async (Day1, Day2, Day3) => {
        var that = this
        await firebase.database().ref('Commandes/').orderByChild('IdClient').equalTo(this.state.Id)
            .on('child_added', function (snap) {
                //console.log("TEST : "+JSON.stringify(snap.val()),Numero)
                if (snap.val().Date.substr(0, 15) === Day1.substr(0, 15)) {
                    var newData = [...that.state.Plats1]
                    newData.push(snap.val())
                    that.setState({ Plats1: newData })
                } else if (snap.val().Date.substr(0, 15) === Day2.substr(0, 15)) {
                    var newData = [...that.state.Plats2]
                    newData.push(snap.val())
                    that.setState({ Plats2: newData })
                }
                else if (snap.val().Date.substr(0, 15) === Day3.substr(0, 15)) {
                    var newData = [...that.state.Plats3]
                    newData.push(snap.val())
                    that.setState({ Plats3: newData })
                }
            })


    }


    async componentDidMount() {



        await firebase.auth().onAuthStateChanged((user) => {
            if (user == null) {
                console.log('Null user')
            } else {
                this.setState({ Plats1: [], Plats2: [], Plats3: [], })
                var Day1 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate()).toString())).toString()
                var Day2 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 1).toString())).toString()
                var Day3 = (new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 2).toString())).toString()
                this.setState({ Day1: Day1 }); this.setState({ Day2: Day2 }); this.setState({ Day3: Day3 })
                var uid = firebase.auth().currentUser.uid
                this.setState({ Id: uid })
                var that = this


                 firebase.database().ref('Commandes/').orderByChild('IdClient').equalTo(uid)
                    .on('child_changed', function (snap) {
                        that.setState({ Plats1: [], Plats2: [], Plats3: [], })
                        that.onRefresh(Day1, Day2, Day3)
                    })
                 firebase.database().ref('Commandes/').orderByChild('IdClient').equalTo(uid)
                    .on('child_removed', function (snap) {
                        that.setState({ Plats1: [], Plats2: [], Plats3: [], })
                        that.onRefresh(Day1, Day2, Day3)

                    })
                that.onRefresh(Day1, Day2, Day3)
            }
        })

    }

    choose(x) {
        if (x === "Kosksi")
            return 0
        if (x == "Makrouna")
            return 1
        return 2
    }

    renderAbonnement1() {
        return (
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Aujourd'hui</Text>
                {
                    this.state.Plats1.map((Data, Ind) => {
                        return (
                            <List key={Ind}>
                                <ListItem thumbnail>
                                    <Left>
                                        <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                    </Left>
                                    <Body>
                                        <Text style={{ fontWeight: 'bold' }}>{Data.Plat} x{Data.Qte}</Text>
                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>{Data.Date.substr(16, 5)}H</Text>
                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>{Data.Etat}</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>Voir Details</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                            </List>
                        )
                    })
                }
            </View>
        )

    }
    renderAbonnement2() {
        return (
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Demain</Text>

                {

                    this.state.Plats2.map((Data, Ind) => {
                        return (
                            <List key={Ind}>
                                <ListItem thumbnail>
                                    <Left>
                                        <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                    </Left>
                                    <Body>
                                        <Text style={{ fontWeight: 'bold' }}>{Data.Plat} x{Data.Qte}</Text>
                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>{Data.Date.substr(16, 5)}H</Text>
                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>{Data.Etat}</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>Voir Details</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                            </List>
                        )
                    })
                }
            </View>
        )

    }
    renderAbonnement3() {
        return (
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{this.state.Day3.substr(0, 11)}</Text>

                {
                    this.state.Plats3.map((Data, Ind) => {
                        return (
                            <List key={Ind}>
                                <ListItem thumbnail>
                                    <Left>
                                        <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                    </Left>
                                    <Body>
                                        <Text style={{ fontWeight: 'bold' }}>{Data.Qte}x {Data.Plat} </Text>
                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>à {Data.Date.substr(16, 5)}H</Text>
                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>Etat: {Data.Etat}</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>Voir Details</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                            </List>
                        )
                    })
                }
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
                        console.log() : <View style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Vous n'avez pas de commande</Text></View>}
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