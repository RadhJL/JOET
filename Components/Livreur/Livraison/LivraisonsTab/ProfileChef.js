import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right, Icon } from 'native-base'
import * as firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicator from './../../../ActivityIndicator'
class ProfileChef extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Profile: {},
            wait: true
        }
    }
    async   componentDidMount() {
        var that = this
        await firebase.database().ref('Chef/' + this.props.navigation.getParam('IdChef')).once('value', async function (snap) {
            await that.setState({ Profile: snap.val() })
        })
        this.setState({ wait: false })
    }

    render() {
        return (
            <Container>
                {this.state.wait == true ?
                    <ActivityIndicator></ActivityIndicator>
                    :
                    <Content>
                        <Header transparent style={{ height: 50, backgroundColor: 'white' }}>
                            <Left><Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: 'red' }} name="arrow-back"></Icon></Button></Left>
                            <Body></Body>
                            <Right></Right>
                        </Header>
                        <Content>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Thumbnail large rounded source={{ uri: this.state.Profile.PhotoUrl }}></Thumbnail>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, paddingTop: 10 }}>{this.state.Profile.Nom}</Text>
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <Text>{this.state.Profile.Rate.Score + " "}</Text>
                                    <Text><AntDesign style={{ fontSize: 15 }} name="star"></AntDesign></Text>
                                    <Text style={{ color: 'gray' }}>{"  " + this.state.Profile.Rate.Nombre + " "}avis</Text>
                                </View>
                                <Text style={{ paddingTop: 10 }}>{this.state.Profile.Commandes} Commande(s) faite</Text>
                            </View>

                            <View style={{ paddingTop: 30 }}>
                                <Text style={{ fontWeight: 'bold' }}>Numero {this.state.Profile.Numero}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Adresse {this.state.Profile.Adresse}</Text>

                            </View>
                            <Text style={{ paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}>Prépare</Text>
                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                {this.state.Profile.Kosksi === "true" ? <Text>Koksi</Text> : console.log()}
                                {this.state.Profile.Makrouna === "true" ? <Text> Makrouna</Text> : console.log()}
                                {this.state.Profile.Rouz === "true" ? <Text> Rouz</Text> : console.log()}
                            </View>
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Travaille</Text>
                                {this.state.Profile.Shift === "DejeunerEtDinner" ? <Text style={{ paddingTop: 10 }}>Le Dejeuner et Le Diner</Text> : <Text style={{ paddingTop: 10 }}>Le {this.state.Profile.Shift}</Text>}
                            </View>
                        </Content>
                    </Content>
                }
            </Container>


        );
    }
}
export default ProfileChef;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});