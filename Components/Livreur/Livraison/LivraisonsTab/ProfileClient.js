import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right, Icon, Card } from 'native-base'
import * as firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicator from './../../../ActivityIndicator'
class ProfileChef extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Profile: {},
            Adresse: "",
            wait: true
        }
    }
    async   componentDidMount() {
        var that = this
        await firebase.database().ref('Client/' + this.props.navigation.getParam('IdClient')).once('value', async function (snap) {
            await that.setState({ Profile: snap.val() })
        })
        this.setState({ Adresse: this.props.navigation.getParam("AdresseClient") })
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
                            <Left><Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: '#FF2E2A' }} name="arrow-back"></Icon></Button></Left>
                            <Body></Body>
                            <Right></Right>
                        </Header>
                        <Content>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Thumbnail large rounded source={{ uri: this.state.Profile.PhotoUrl }}></Thumbnail>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, paddingTop: 10 }}>{this.state.Profile.Nom}</Text>

                                <Text style={{ paddingTop: 10,color:'gray',fontWeight:'bold' }}>{this.state.Profile.Commandes} Commande(s) faite</Text>
                            </View>
                            <Card style={{padding:10,marginTop:20}}>
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Numero </Text>
                                    <Text>{this.state.Profile.Numero}</Text>
                                </View>
                                <View style={{ paddingTop: 10, flexDirection: 'column' }}>
                                    <Text style={{ fontWeight: 'bold' }}>Adresse de livraison </Text>
                                    <Text style={{alignSelf:'center',paddingTop:5}}> {this.state.Adresse}</Text>
                                </View>

                            </Card>

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