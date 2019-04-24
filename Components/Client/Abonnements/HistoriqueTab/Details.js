import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";

import { Button, Container, Header, Content, Card, CardItem, Body } from 'native-base';
import * as firebase from 'firebase'
class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Commande: []
        }
    }
    componentDidMount() {
        this.setState({ Commande: this.props.navigation.getParam('Data') })
    }

    async ShowProfile(ch) {
        var that = this
        if (ch === 'Chef') {
             firebase.database().ref('Chef/' + this.state.Commande.IdChef).once('value', function (snap) {
                that.props.navigation.navigate('ProfileChef', { Profile: snap.val() })
            })
        } else {
             firebase.database().ref('Livreur/' + this.state.Commande.IdLivreur).once('value', function (snap) {
                that.props.navigation.navigate('ProfileLivreur', { Profile: snap.val() })
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
                                <Text style={{ fontWeight: 'bold' }}>Plat: </Text>
                                <Text>{this.state.Commande.Plat}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Quantité: </Text>
                                <Text>{this.state.Commande.Qte} Plat(s)</Text>
                                <Text style={{ fontWeight: 'bold' }}>Prix: </Text>
                                <Text>{this.state.Commande.Prix} DT ({this.state.Commande.Prix / this.state.Commande.Qte} DT/Une)</Text>
                                <Text style={{ fontWeight: 'bold' }}>Etat: </Text>
                                <Text>{this.state.Commande.Etat}</Text>
                            </Body>
                        </CardItem>
                        <CardItem footer>
                            <View>
                                <View >
                                    <Text style={{ fontWeight: 'bold' }}>Preparé par :</Text>
                                    <Button style={{height:20}} transparent onPress={() => this.ShowProfile('Chef')}>
                                        <Text style={{ fontWeight: 'bold', color: 'blue' }}>Le Chef {this.state.Commande.NomChef}</Text>
                                    </Button>
                                    <Text>Numero: {this.state.Commande.NumeroChef}</Text>
                                </View>
                                <View>

                                    <Text style={{ fontWeight: 'bold' }}>Livré Par</Text>
                                    <Button style={{height:20}} transparent onPress={() => this.ShowProfile('Livreur')}>
                                        <Text style={{ fontWeight: 'bold', color: 'blue' }}>{this.state.Commande.NomLivreur}</Text>
                                    </Button>
                                    <Text>Numero: {this.state.Commande.NumeroLivreur}</Text>
                                </View>
                            </View>
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