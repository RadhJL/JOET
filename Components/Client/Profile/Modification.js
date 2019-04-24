import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ToastAndroid, Alert, BackHandler
} from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Form, Input, Label } from 'native-base';
import * as firebase from 'firebase'

let Numero = ''
let Adresse1 = ''
let Adresse2 = ''
class Modification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Numero: '',
            Adresse1: '',
            Adresse2: '',
            AncienNumero: ''
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

        var user = await firebase.auth().currentUser
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user)
            }
        });



        this.setState({ uid: user.uid });
        var that = this
        await firebase.database().ref('Client/' + user.uid).once('value', function (snap) {
            Numero = snap.val().Numero.toString()
            Adresse1 = snap.val().Adresse1
            Adresse2 = snap.val().Adresse2
            that.setState({ AncienNumero: snap.val().Numero })
            that.setState({ Numero: snap.val().Numero })
            that.setState({ Adresse1: snap.val().Adresse1 })
            that.setState({ Adresse2: snap.val().Adresse2 })
        })

    }
    IsValid(ch) {
        if (ch.length != 8)
            return false

        return true
    }

    async Confirmer() {

        var that = this
        let rootRef = firebase.database().ref()
        if (this.IsValid(this.state.Numero) == false) {
            ToastAndroid.show(
                "  Numero Contient 8 chiffre!",
                ToastAndroid.SHORT,
            );
        } else if (this.state.Adresse1 === '' || this.state.Adresse2 === '') {
            ToastAndroid.show(
                " Adresse Invalide ",
                ToastAndroid.SHORT,
            );
        } else {
            try {

                await firebase.database().ref('Client/' + that.state.uid).update({
                    Numero: that.state.Numero,
                })

                await firebase.database().ref('Commandes/')
                    .orderByChild('NumeroClient').equalTo(that.state.AncienNumero.toString()).once('value', function (snap) {
                        if (snap.val() != null) {
                            let Keys = Object.keys(snap.val())//Array of all keys (id)
                            let updateObj = {}
                            Keys.forEach(key => {
                                updateObj['Commandes/' + key + '/NumeroClient'] = that.state.Numero
                            })
                            rootRef.update(updateObj)
                            that.setState({ AncienNumero: that.state.Numero })
                        }
                    })


                await firebase.database().ref('Client/' + that.state.uid).update({
                    Adresse1: that.state.Adresse1,
                })

                await firebase.database().ref('Client/' + that.state.uid).update({
                    Adresse2: that.state.Adresse2,
                })
                ToastAndroid.show(
                    'Modification avec succes !',
                    ToastAndroid.SHORT,
                );
                this.props.navigation.goBack(null)
            } catch (error) {
                ToastAndroid.show(
                    " Erreur l'hors de le la modification ",
                    ToastAndroid.SHORT,
                );
                console.log(error)
            }

        }
    }



    render() {

        return (

            <Container  >
                <View style={{ paddingTop: 25 }}>
                    <Header style={{ backgroundColor: 'white' }}>
                        <Body style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Edition Profile</Text>
                        </Body>
                    </Header>
                </View>
                <Content >
                    <Form style={{ paddingTop: 50 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Numero de Téléphone </Text>
                        <Input keyboardType='numeric' maxLength={8} placeholder={Numero} onChangeText={(Numero) => this.setState({ Numero })}></Input>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Adresse</Text>
                        <Input placeholder={Adresse1} onChangeText={(Adresse1) => this.setState({ Adresse1 })}></Input>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Adresse en détails (Ex: Prés de ..)</Text>
                        <Input placeholder={Adresse2} onChangeText={(Adresse2) => this.setState({ Adresse2 })}></Input>

                    </Form>

                    <View style={{ justifyContent: 'space-around', flex: 1 }}>
                        <Button full style={{}} onPress={() => this.Confirmer()}><Label style={{ fontWeight: 'bold', color: 'white' }}>Enregistrer</Label></Button>
                    </View>
                </Content>

            </Container>
        );
    }
}
export default Modification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});



