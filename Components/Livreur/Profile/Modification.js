import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ToastAndroid, Alert, BackHandler, Dimensions
} from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Form, Input, Label, Picker, CheckBox, ListItem, Card, CardItem, Item, Radio } from 'native-base';
import * as firebase from 'firebase'
import ActivityIndicator from '../../ActivityIndicator'

var Numero = ""
class Modification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Nom: '',
            Numero: '',
            AncienNumero: '',
            radio1: '',//Deplacement
            Ancienradio1: '',
            radio2: '',//Shift
            AncienShift: '',
            wait: true
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        Alert.alert(
            'Retourn',
            'Voulez-vous vraiment retourner?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log(),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.props.navigation.goBack(null) },
            ],
            { cancelable: false },
        );
        return true;
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        let uid = await firebase.auth().currentUser.uid
        var that = this
        this.setState({ uid: uid });
        await firebase.database().ref('Livreur/' + uid).once('value', function (snap) {
            that.setState({ Nom: snap.val().Nom })
            Numero = snap.val().Numero
            that.setState({ Numero: snap.val().Numero })
            that.setState({ AncienNumero: snap.val().Numero })

            that.setState({ radio1: snap.val().Deplacement })
            that.setState({ Ancienradio1: snap.val().Deplacement })

            that.setState({ radio2: snap.val().Shift })
            that.setState({ AncienShift: snap.val().Shift })
        })

        this.setState({ wait: false })
    }

    async Confirmer() {
        var that = this

        try {
            if (this.state.radio1 != this.state.Ancienradio1) {
                await firebase.database().ref('Livreur/' + that.state.uid).update({
                    Deplacement: that.state.radio1,
                })
                this.setState({ Ancienradio1: this.state.radio1 })
            }

            if (this.state.radio2 !== this.state.AncienShift) {
                this.setState({ wait: true })
                await firebase.database().ref('Livreur/' + that.state.uid).update({
                    Shift: that.state.radio2,
                })

                if (this.state.AncienShift === 'DejeunerEtDinner') {
                    if (this.state.radio2 === 'Dejeuner') {
                        await firebase.database().ref('Livreur/Dinner/' + this.state.uid).remove()
                        this.setState({ AncienShift: 'Dejeuner' })
                    }
                    if (this.state.radio2 === 'Dinner') {

                        await firebase.database().ref('Livreur/Dejeuner/' + this.state.uid).remove()
                        this.setState({ AncienShift: 'Dinner' })
                    }
                }
                if (this.state.AncienShift === 'Dejeuner') {

                    if (this.state.radio2 === 'Dinner') {
                        await firebase.database().ref('Livreur/Dejeuner/' + this.state.uid).remove()
                        await firebase.database().ref('Livreur/Dinner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        this.setState({ AncienShift: 'Dinner' })
                    }
                    if (this.state.radio2 === 'DejeunerEtDinner') {
                        await firebase.database().ref('Livreur/Dinner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        this.setState({ AncienShift: 'DejeunerEtDinner' })
                    }
                }
                if (this.state.AncienShift === 'Dinner') {
                    if (this.state.radio2 === 'Dejeuner') {
                        await firebase.database().ref('Livreur/Dinner/' + this.state.uid).remove()
                        await firebase.database().ref('Livreur/Dejeuner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        this.setState({ AncienShift: 'Dinner' })
                    }
                    if (this.state.radio2 === 'DejeunerEtDinner') {
                        await firebase.database().ref('Livreur/Dejeuner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        this.setState({ AncienShift: 'DejeunerEtDinner' })
                    }
                }
            }


            if (this.state.Numero == this.state.AncienNumero) {
                this.setState({ wait: false })
                this.props.navigation.goBack(null)
            }
            else if (this.state.Numero.length < 8) {
                this.setState({ wait: false })
                this.setState({ Line1: true })
            }
            else if (this.state.AncienNumero !== this.state.Numero) {
                if (this.state.wait == false)
                    this.setState({ wait: true })

                firebase.database().ref('Livreur/' + that.state.uid).update({
                    Numero: that.state.Numero,
                })

                if (this.state.radio2 === 'DejeunerEtDinner') {
                    firebase.database().ref('Livreur/Dejeuner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    firebase.database().ref('Livreur/Dinner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                }

                if (this.state.radio2 === 'Dejeuner') {
                    firebase.database().ref('Livreur/Dejeuner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                }
                if (this.state.radio2 === 'Dinner') {
                    firebase.database().ref('Livreur/Dinner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                }
                let rootRef = firebase.database().ref()

                await firebase.database().ref('Commandes/')
                    .orderByChild('NumeroLivreur').equalTo(that.state.AncienNumero.toString()).once('value', function (snap) {
                        if (snap.val() != null) {
                            let Keys = Object.keys(snap.val())//Array of all keys (id)
                            let updateObj = {}
                            Keys.forEach(key => {
                                updateObj['Commandes/' + key + '/NumeroLivreur'] = that.state.Numero
                            })
                            rootRef.update(updateObj)
                        }
                    })
                this.setState({ AncienNumero: this.state.Numero })
                this.setState({ wait: false })
                this.props.navigation.goBack(null)
            }


        } catch (error) {
            ToastAndroid.show(
                "Erreur l'hors de la modification :(",
                ToastAndroid.SHORT,

            );
            console.log(error)
        }
    }


    render() {
        return (
            <Container >
                {this.state.wait == true ?
                    <ActivityIndicator />
                    :
                    <Container>

                        <Header style={{ height: styles.dim.height / 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                            <Left style={{ flex: 2 }}>
                                <Button transparent onPress={() => this.handleBackButtonClick()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>

                            </Left>
                            <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center', paddingLeft: 33 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Profile</Text>
                            </Body>
                            <Right style={{ flex: 4 }}>
                                <Button transparent onPress={() => this.Confirmer()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                                </Button>
                            </Right>
                        </Header>

                        <Content >
                            <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 15), width: styles.dim.width - (styles.dim.width / 10) }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Numero de telephone</Text>
                                <Item>
                                    <Input style={{ fontSize: 14 }} maxLength={8} keyboardType={'number-pad'} placeholder={"Ajouter numero de telephone"} value={this.state.Numero} onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false })}></Input>
                                </Item>
                                {this.state.Line1 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                                    </View>
                                    : console.log()}
                                <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 20 }}>Vous vous deplacez avec</Text>

                                <Card>
                                    <CardItem button style={{ backgroundColor: this.state.radio1 == 'Bicyclette' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio1: 'Bicyclette', })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio1 == 'Bicyclette' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Bicyclette</Text>
                                    </CardItem>
                                </Card>
                                <Card >

                                    <CardItem button style={{ backgroundColor: this.state.radio1 == 'Moto' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio1: 'Moto', })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio1 == 'Moto' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Moto</Text>
                                    </CardItem>
                                </Card>
                                <Card>
                                    <CardItem button style={{ backgroundColor: this.state.radio1 == 'Voiture' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio1: 'Voiture', })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio1 == 'Voiture' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Voiture</Text>
                                    </CardItem>
                                </Card>

                                <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 20 }}>Vous travaillez le</Text>

                                <Card>
                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dejeuner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dejeuner', })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dejeuner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner</Text>
                                    </CardItem>
                                </Card>

                                <Card >
                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dinner', })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Diner</Text>
                                    </CardItem>
                                </Card>

                                <Card>

                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'DejeunerEtDinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'DejeunerEtDinner', })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'DejeunerEtDinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner et Diner</Text>
                                    </CardItem>

                                </Card>

                            </Form>
                        </Content>
                    </Container>
                }
            </Container>
        );
    }
}
export default Modification;

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