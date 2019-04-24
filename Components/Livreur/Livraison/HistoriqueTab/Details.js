import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import * as firebase from 'firebase'
import { Button, Container, Header, Content, Card, CardItem, Body } from 'native-base';

class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Commande: [],
            Date: ''
        }
    }
    componentDidMount() {
        this.setState({ Commande: this.props.navigation.getParam('Data') })
        this.setState({ Date: this.props.navigation.getParam('Data').Date.toString().substr(0, 21) })
    }

    async ShowProfile(ch) {
        var that = this
        if (ch === 'Client') {
            firebase.database().ref('Client/' + this.state.Commande.IdClient).once('value', function (snap) {
                that.props.navigation.navigate('ProfileClient', { Profile: snap.val() })
            })
        } else {
            firebase.database().ref('Chef/' + this.state.Commande.IdChef).once('value', function (snap) {
                that.props.navigation.navigate('ProfileChef', { Profile: snap.val() })
            })
        }

    }

    render() {
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem header>
                            <Text style={{ fontWeight: 'bold' }}>ID COMMANDE :{this.state.Commande.IdCommande}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>


                                <Text style={{ fontWeight: 'bold' }}>Preparé par le chef: </Text>
                                <Button style={{height:20}} transparent onPress={() => this.ShowProfile('Chef')}>
                                    <Text style={{ fontWeight: 'bold', color: 'blue' }}>{this.state.Commande.NomChef}</Text>
                                </Button>
                                <Text>{this.state.Commande.Adresse1Chef} {this.state.Commande.Adresse2Chef}</Text>
                                <Text>{this.state.Commande.NumeroChef}</Text>

                                <Text style={{ fontWeight: 'bold' }}>Pour le Client: </Text>
                                <Button style={{height:20}} transparent onPress={() => this.ShowProfile('Client')}>
                                    <Text style={{ fontWeight: 'bold', color: 'blue' }}>{this.state.Commande.NomClient}</Text>
                                </Button>
                                <Text>{this.state.Commande.Adresse1Client} {this.state.Commande.Adresse2Client}</Text>
                                <Text>{this.state.Commande.NumeroClient}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Date: </Text>
                                <Text>{this.state.Date}H </Text>
                                <Text style={{ fontWeight: 'bold' }}>Plat: </Text>
                                <Text>{this.state.Commande.Qte}x {this.state.Commande.Plat}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Etat: </Text>
                                <Text>{this.state.Commande.Etat}</Text>
                            </Body>
                        </CardItem>
                        <CardItem footer>

                        </CardItem>
                    </Card>
                    <Button full onPress={() => this.props.navigation.navigate('Liste')}><Text style={{ fontWeight: 'bold', color: 'white' }}>Retour</Text></Button>

                </Content>
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
    }
});