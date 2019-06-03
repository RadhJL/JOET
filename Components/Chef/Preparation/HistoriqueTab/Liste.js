import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ScrollView, RefreshControl, Dimensions
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right } from 'native-base'
import * as firebase from 'firebase'

var Plat = [require('../../../../assets/Kosksi.jpg'), require('../../../../assets/Makrouna1.jpg'), require('../../../../assets/Rouz.jpg')]
let OldDate = ""
let AfficheDate = true
class Liste extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Id: '',
            Plats: [],
            Numero: '',
        }
    }

    async componentDidMount() {
        var that = this
        var uid = await firebase.auth().currentUser.uid
        await this.setState({ Id: uid })
        await firebase.auth().onAuthStateChanged(async (user) => {
            that.setState({ Plats: [] })
            if (user == null) {
                console.log('Null user')
            } else {
                await firebase.database().ref('Commandes/Historique').orderByChild('IdChefSortDate')
                    .startAt(that.state.Id).endAt(that.state.Id + '\uf8ff')
                    .on('child_added', function (snap) {
                        var newData = [...that.state.Plats]
                        newData.push(snap.val())
                        that.setState({ Plats: newData })
                    })
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


    renderAbonnement() {
        return (
            <View>
                {
                    this.state.Plats.map((Data, Ind) => {

                        if (Data.Date.substr(0, 15) == OldDate) {
                            AfficheDate = false
                            console.log("Date " + Data.Date.substr(0, 15) + " OldDate " + OldDate)
                        } else {
                            AfficheDate = true
                            console.log("Date " + Data.Date.substr(0, 15) + " OldDate " + OldDate)
                            OldDate = Data.Date.substr(0, 15);
                        }

                        return (
                            <List key={Ind}>
                                <ListItem thumbnail>
                                    <Left>
                                        <Thumbnail square source={Plat[this.choose(Data.Plat)]} />
                                    </Left>
                                    <Body>
                                        {AfficheDate == true ?
                                            <View style={{ alignSelf: 'center',paddingBottom:20 }}>
                                                <Text style={{ fontSize: 20, color: 'red' ,fontWeight: 'bold'}} note numberOfLines={1} >{Data.Date.substr(0, 15)} </Text>
                                            </View>
                                            : console.log()
                                        }

                                        <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{Data.Plat}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'gray' }}>Pour</Text>
                                            <Text style={{ fontWeight: 'bold' }}>{" " + Data.Qte} personne(s)</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'gray' }}>Livré a</Text>
                                            <Text note numberOfLines={1} style={{ fontWeight: 'bold' }}>{" " + Data.Date.substr(16, 5)}H</Text>
                                        </View>
                                    </Body>

                                    <Right>
                                        <Button transparent onPress={() => this.props.navigation.navigate('Details', { 'Data': Data })}>
                                            <Text style={{ color: 'gray', fontWeight: 'bold' }}> Details</Text>
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
                    {this.state.Plats.length > 0 ? this.renderAbonnement() :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: styles.dim.height - styles.dim.height / 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'gray' }}>Historique Vide</Text>
                        </View>}
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
    },
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});