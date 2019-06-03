import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right, Icon, Card } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicator from './../../../ActivityIndicator'
import * as firebase from 'firebase'
class ProfileLivreur extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Profile: {},
            wait: true
        }
    }
    async componentDidMount() {
        var that = this
        await firebase.database().ref('Livreur/' + this.props.navigation.getParam('IdLivreur')).once('value', async function (snap) {
            await that.setState({ Profile: snap.val() })
        })
        this.setState({ wait: false })

    }

    render() {
        return (
            <Container>
                {this.state.wait == true ?
                    <ActivityIndicator /> :
                    <Content>
                        <Header transparent style={{ height: 50, backgroundColor: 'white' }}>
                            <Left><Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: '#FF2E2A' }} name="arrow-back"></Icon></Button></Left>
                            <Body></Body>
                            <Right></Right>
                        </Header>
                        <Content>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Thumbnail large rounded source={{ uri: this.state.Profile.PhotoUrl }}></Thumbnail>
                                <Text style={{ fontWeight: 'bold', fontSize: 25, paddingTop: 10 }}>{this.state.Profile.Nom}</Text>

                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.Profile.Rate.Score + " "}</Text>
                                    <Text style={{ paddingTop: 3 }}><AntDesign style={{ fontSize: 20, color: '#FF2E2A' }} name="star"></AntDesign></Text>
                                    <Text style={{ color: 'gray', paddingTop: 4, fontWeight: 'bold' }}>{"  " + this.state.Profile.Rate.Nombre + " "}avis</Text>
                                </View>

                                <Text style={{ paddingTop: 10 }}>{this.state.Profile.Commandes} livraison(s) faite</Text>
                            </View>

                            <Card style={{ padding: 10, marginTop: 15 }}>
                                <View style={{ flexDirection: 'row',paddingTop:10 }}>
                                    <Text style={{fontWeight:'bold'}}>Numero </Text>
                                    <Text>{this.state.Profile.Numero} </Text>
                                </View>


                                <Text style={{ paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}>Se déplace avec</Text>
                                <View style={{ paddingTop: 5 }}>
                                    <Text>{this.state.Profile.Deplacement} </Text>
                                </View>
                                <View style={{ paddingTop: 20 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Travaille</Text>
                                    {this.state.Profile.Shift === "DejeunerEtDinner" ? <Text style={{ paddingTop: 5 }}>Le Dejeuner et Le Diner</Text> : <Text style={{ paddingTop: 5 }}>Le {this.state.Profile.Shift}</Text>}
                                </View>
                            </Card>
                        </Content>
                    </Content>
                }

            </Container>

        );
    }
}
export default ProfileLivreur;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});