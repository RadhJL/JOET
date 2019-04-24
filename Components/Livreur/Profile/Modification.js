import React, { Component } from "react";
import {
    View,
    ToastAndroid,
    StyleSheet,Alert,BackHandler
} from "react-native";
import { Toast, Container, Header, Title, Button, Left, Right, Text, Body, Icon, Label, Input, Content, Form, ListItem, Radio } from 'native-base';
import * as firebase from 'firebase'
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
            AncienShift: ''
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

    }

    async Confirmer() {
        var that = this

        try {
            //Update Deplacement
            if (this.state.radio1 != this.state.Ancienradio1) {
                await firebase.database().ref('Livreur/' + that.state.uid).update({
                    Deplacement: that.state.radio1,
                })
                this.setState({ Ancienradio1: this.state.radio1 })
            }
            //Update Shift
            if (this.state.radio2 !== this.state.AncienShift) {
                // console.log("Ancien" + this.state.AncienShift + " Nouveau " + this.state.radio2)
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

            //Update Numero
            if (this.state.Numero == '' || this.state.Numero.length < 8) {
                ToastAndroid.show(
                    " Numero de Téléphone incorrect! ",
                    ToastAndroid.SHORT,
                );
            }

            else if (this.state.AncienNumero !== this.state.Numero) {
                await firebase.database().ref('Livreur/' + that.state.uid).update({
                    Numero: that.state.Numero,
                })
                if (this.state.radio2 === 'DejeunerEtDinner') {
                    await firebase.database().ref('Livreur/Dejeuner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Livreur/Dinner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                }

                if (this.state.radio2 === 'Dejeuner') {
                    await firebase.database().ref('Livreur/Dejeuner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                }
                if (this.state.radio2 === 'Dinner') {
                    await firebase.database().ref('Livreur/Dinner/' + that.state.uid).set({
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

                ToastAndroid.show(
                    'Modification avec succes !',
                    ToastAndroid.SHORT,

                );
            }

           this.props.navigation.goBack(null) 

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
                <View style={{ alignItems: 'center', paddingTop: 50 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 20 }}>Changer vos informations</Label>
                </View>
                <Content >
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Numero de téléphone </Text>
                    <Input keyboardType='numeric' maxLength={8} placeholder={Numero} onChangeText={(Numero) => this.setState({ Numero })}></Input>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Vous vous déplacez avec</Text>
                    <ListItem selected={this.state.radio1 === 'Bicyclette'}>
                        <Left>
                            <Text>Bicyclette</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio1 === 'Bicyclette'}
                                onPress={() => this.setState({ radio1: 'Bicyclette' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem selected={this.state.radio1 == 'Moto'}>
                        <Left>
                            <Text>Moto</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio1 === 'Moto'}
                                onPress={() => this.setState({ radio1: 'Moto' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem selected={this.state.radio1 === 'Voiture'}>
                        <Left>
                            <Text >Voiture</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio1 === 'Voiture'}
                                onPress={() => this.setState({ radio1: 'Voiture' })}
                            />
                        </Right>
                    </ListItem>

                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Vous voulez travailler le</Text>
                    <ListItem selected={this.state.radio2 === 'Dejeuner'}>
                        <Left>
                            <Text>Déjeuner</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio2 === 'Dejeuner'}
                                onPress={() => this.setState({ radio2: 'Dejeuner' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem selected={this.state.radio2 === 'Dinner'}>
                        <Left>
                            <Text>Diner</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio2 === 'Dinner'}
                                onPress={() => this.setState({ radio2: 'Dinner' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem selected={this.state.radio2 === 'DejeunerEtDinner'}>
                        <Left>
                            <Text>Déjeuner et Diner</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio2 === 'DejeunerEtDinner'}
                                onPress={() => this.setState({ radio2: 'DejeunerEtDinner' })}
                            />
                        </Right>
                    </ListItem>
                    <View style={{ justifyContent: 'space-around' }}>
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
        alignItems: 'center',
        justifyContent: 'center'
    }
});