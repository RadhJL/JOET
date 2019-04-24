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
            Plats: [],
            Numero: '',
        }
    }

    async componentDidMount() {
        var that = this

        await firebase.auth().onAuthStateChanged((user) => {
            if (user == null) {
                console.log('Null user')
            } else {
                this.setState({ Plats1: [], Plats2: [], Plats3: [] })
                var uid=user.uid
                firebase.database().ref('Commandes/Historique').orderByChild('Date')
                    .on('child_added', function (snap) {
                        if (snap.val().IdLivreur == uid) {
                            var newData = [...that.state.Plats]
                            newData.push(snap.val())
                            that.setState({ Plats: newData })
                        }
                    })
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

    renderAbonnement() {
        return (
            <View>
                {
                    this.state.Plats.map((Data, Ind) => {
                        return (
                            <List key={Ind}>
                                <ListItem thumbnail>
                                    <Left>
                                        <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                    </Left>
                                    <Body>
                                        <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>{Data.Date.substr(0, 21)}H</Text>
                                        <Text style={{ fontWeight: 'bold' }}>{Data.Qte}x {Data.Plat} </Text>
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

                    {this.state.Plats.length > 0 ? this.renderAbonnement() : console.log()}
                    {this.state.Plats.length > 0 ?
                        console.log() : <View style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Historique Vide</Text></View>}
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