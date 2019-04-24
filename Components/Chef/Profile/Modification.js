import React, { Component } from "react";
import {
    View,
    ToastAndroid,
    StyleSheet, Alert, BackHandler
} from "react-native";
import { Container, Header, Title, Button, CheckBox, Left, Right, Text, Body, Icon, Label, Input, Content, Form, ListItem, Radio } from 'native-base';
import * as firebase from 'firebase'
let Numero = ''
class Modification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Nom: '',
            Numero: '',
            AncienNumero: '',
            Adresse1: '',
            Adresse2: '',
            radio2: '',//Shift
            AncienShift: '',
            Kosksi: 'false',
            Makrouna: 'false',
            Rouz: 'false'
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

        this.setState({ uid: await firebase.auth().currentUser.uid });

        var that = this
        await firebase.database().ref('Chef/' + that.state.uid).once('value', function (snapshot) {
            that.setState({ Nom: snapshot.val().Nom })
            Numero = snapshot.val().Numero
            that.setState({ AncienNumero: snapshot.val().Numero })
            that.setState({ Numero: snapshot.val().Numero })
            that.setState({ AncienShift: snapshot.val().Shift })
            that.setState({ radio2: snapshot.val().Shift })
            that.setState({ Adresse1: snapshot.val().Adresse1 })
            that.setState({ Adresse2: snapshot.val().Adresse2 })
            that.setState({ Kosksi: snapshot.val().Kosksi })
            that.setState({ Makrouna: snapshot.val().Makrouna })
            that.setState({ Rouz: snapshot.val().Rouz })

        })


    }
    async  Confirmer() {
        var that = this
        let rootRef = firebase.database().ref()

        try {
            if (this.state.radio2 != this.state.AncienShift) {
                firebase.database().ref('Chef/' + that.state.uid).update({ Shift: that.state.radio2, })
            }

            firebase.database().ref('Chef/' + that.state.uid).update({
                Kosksi: that.state.Kosksi,
                Makrouna: that.state.Makrouna,
                Rouz: that.state.Rouz,
            })


            if (this.state.Numero === '' || this.state.Numero.length < 8) {
                ToastAndroid.show("Numero de téléphone invalide", ToastAndroid.SHORT)
            } else if (this.state.Numero != this.state.AncienNumero) {
                firebase.database().ref('Chef/' + that.state.uid).update({ Numero: that.state.Numero, })
                await firebase.database().ref('Commandes/')
                    .orderByChild('NumeroChef').equalTo(that.state.AncienNumero.toString()).once('value', function (snap) {
                        if (snap.val() != null) {
                            let Keys = Object.keys(snap.val())//Array of all keys (id)
                            let updateObj = {}
                            Keys.forEach(key => {
                                updateObj['Commandes/' + key + '/NumeroChef'] = that.state.Numero
                            })
                            rootRef.update(updateObj)
                        }
                        that.setState({ AncienNumero: that.state.Numero })
                    })
                ToastAndroid.show("Modification de Numero avec succes!", ToastAndroid.SHORT)
            }


            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (this.state.radio2 === 'Dejeuner') {
                if (this.state.Kosksi === 'true') {
                    await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).remove()
                } else {
                    await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).remove()

                }
                if (this.state.Makrouna === 'true') {
                    await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/2/Dinner/' + this.state.uid).remove()
                } else {
                    await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/2/Dinner/' + this.state.uid).remove()

                } if (this.state.Rouz === 'true') {
                    await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()

                } else {
                    await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()
                }
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            } else if (this.state.radio2 === 'Dinner') {

                if (this.state.Kosksi === 'true') {
                    await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).remove()

                } else {
                    await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).remove()

                }
                if (this.state.Makrouna === 'true') {
                    await firebase.database().ref('Plats/2/Dinner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).remove()


                } else {
                    await firebase.database().ref('Plats/2/Dinner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).remove()

                } if (this.state.Rouz === 'true') {
                    await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()

                } else {
                    await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()

                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            } else {

                if (this.state.Kosksi === 'true') {
                    await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })

                    await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })


                } else {
                    await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).remove()

                }
                if (this.state.Makrouna === 'true') {
                    await firebase.database().ref('Plats/2/Dinner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })

                } else {
                    await firebase.database().ref('Plats/2/Dinner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).remove()

                } if (this.state.Rouz === 'true') {
                    await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                    await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).set({
                        Numero: that.state.AncienNumero,
                        Adresse1: that.state.Adresse1,
                        Adresse2: that.state.Adresse2,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })

                } else {
                    await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()
                    await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()

                }

            }
            this.props.navigation.goBack(null)

        } catch (error) {
            alert("Error voire console log")
            console.log(error)
        }
    }

    render() {
        return (
            <Container >
                <View style={{ alignItems: 'center', paddingTop: 50 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 20 }}>Edition de profile</Label>
                </View>
                <Content >
                    <Text style={{ fontWeight: 'bold' }}>Numero de téléphone </Text>
                    <Input placeholder={Numero} keyboardType='numeric' maxLength={8} onChangeText={(Numero) => this.setState({ Numero })}></Input>
                    <Text style={{ fontWeight: 'bold' }}>Vous voulez travailler le</Text>
                    <ListItem selected={this.state.radio2 == 'Dejeuner'}
                    >
                        <Left>
                            <Text>Déjeuner</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio2 == 'Dejeuner'}
                                onPress={() => this.setState({ radio2: 'Dejeuner' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem selected={this.state.radio2 == 'Dinner'}
                    >
                        <Left>
                            <Text>Diner</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio2 == 'Dinner'}
                                onPress={() => this.setState({ radio2: 'Dinner' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem selected={this.state.radio2 == 'DejeunerEtDinner'}
                    >
                        <Left>
                            <Text>Déjeuner et Diner</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio2 == 'DejeunerEtDinner'}
                                onPress={() => this.setState({ radio2: 'DejeunerEtDinner' })}
                            />
                        </Right>
                    </ListItem>
                    <Text style={{ fontWeight: 'bold' }}>Vous pouvez préparer ?</Text>
                    <ListItem>
                        <CheckBox checked={this.state.Kosksi === 'true'} onPress={() => this.state.Kosksi === 'true' ?

                            this.setState({ Kosksi: 'false' }) : this.setState({ Kosksi: 'true' })} />
                        <Body>
                            <Text>Kosksi</Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <CheckBox checked={this.state.Makrouna === 'true'} onPress={() => this.state.Makrouna === 'true' ?

                            this.setState({ Makrouna: 'false' }) : this.setState({ Makrouna: 'true' })} />
                        <Body>
                            <Text>Makrouna</Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <CheckBox checked={this.state.Rouz === 'true'} onPress={() => this.state.Rouz === 'true' ?

                            this.setState({ Rouz: 'false' }) : this.setState({ Rouz: 'true' })} />
                        <Body>
                            <Text>Rouz</Text>
                        </Body>
                    </ListItem>

                    <Button full style={{}} onPress={() => this.Confirmer()}><Label style={{ fontWeight: 'bold', color: 'white' }}>Confirmer</Label></Button>
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