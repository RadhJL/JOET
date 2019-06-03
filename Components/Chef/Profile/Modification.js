import React, { Component } from "react";
import {
    View,
    BackHandler,
    StyleSheet,
    Alert, ToastAndroid, Dimensions, Platform, KeyboardAvoidingView
} from "react-native";
import { Container, Header, Title, Button, CheckBox, Left, Right, Text, Body, Icon, Label, Input, Content, Form, ListItem, Radio, Picker, Card, CardItem, Item } from 'native-base';
import * as firebase from 'firebase'
import ActivityIndicator from '../../ActivityIndicator'
let Numero = ''
class Modification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Nom: '',
            Numero: '',
            AncienNumero: '',
            Adresse: '',
            radio2: '',//Shift
            AncienShift: '',
            Kosksi: 'false',
            Makrouna: 'false',
            Rouz: 'false',
            wait: true,
            Line1: false,
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
            that.setState({ Adresse: snapshot.val().Adresse })

            that.setState({ Kosksi: snapshot.val().Kosksi })
            that.setState({ Makrouna: snapshot.val().Makrouna })
            that.setState({ Rouz: snapshot.val().Rouz })

        })

        this.setState({ wait: false })
    }
    async  Confirmer() {
        var that = this
        let rootRef = firebase.database().ref()

        try {

            this.setState({ wait: true })
            if (this.state.Numero.length < 8) {
                await this.setState({ Line1: true })
                this.setState({ wait: false })
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
            }


            if (this.state.radio2 != this.state.AncienShift && this.state.Line1 == false) {
                firebase.database().ref('Chef/' + that.state.uid).update({ Shift: that.state.radio2, })

            }
            if (this.state.Line1 == false) {
                firebase.database().ref('Chef/' + that.state.uid).update({
                    Kosksi: that.state.Kosksi,
                    Makrouna: that.state.Makrouna,
                    Rouz: that.state.Rouz,
                })
            }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.state.radio2 === 'Dejeuner' && this.state.Line1 == false) {
                    if (this.state.Kosksi === 'true') {
                        await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Adresse: that.state.Adresse,

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
                            Adresse: that.state.Adresse,
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
                            Adresse: that.state.Adresse,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()

                    } else {
                        await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()
                        await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()
                    }
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                } else if (this.state.radio2 === 'Dinner' && this.state.Line1 == false) {

                    if (this.state.Kosksi === 'true') {
                        await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Adresse: that.state.Adresse,
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
                            Adresse: that.state.Adresse,
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
                            Adresse: that.state.Adresse,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()

                    } else {
                        await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()
                        await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()

                    }

                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                } else if (this.state.Line1 == false) {

                    if (this.state.Kosksi === 'true') {
                        await firebase.database().ref('Plats/1/Dinner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Adresse: that.state.Adresse,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })

                        await firebase.database().ref('Plats/1/Dejeuner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Adresse: that.state.Adresse,
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
                            Adresse: that.state.Adresse,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Adresse: that.state.Adresse,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })

                    } else {
                        await firebase.database().ref('Plats/2/Dinner/' + this.state.uid).remove()
                        await firebase.database().ref('Plats/2/Dejeuner/' + this.state.uid).remove()

                    } if (this.state.Rouz === 'true') {
                        await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Adresse: that.state.Adresse,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })
                        await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).set({
                            Numero: that.state.AncienNumero,
                            Adresse: that.state.Adresse,
                            Nom: that.state.Nom,
                            Id: that.state.uid
                        })

                    } else {
                        await firebase.database().ref('Plats/3/Dinner/' + this.state.uid).remove()
                        await firebase.database().ref('Plats/3/Dejeuner/' + this.state.uid).remove()

                    }
                }

                if (this.state.Line1 == false) {
                    this.setState({ wait: false })
                    this.props.navigation.goBack(null)
                }
            } catch (error) {
                alert("Error voire console log")
                console.log(error)
            }
        }

    render() {
            return (
                <Container >
                    {this.state.wait == true ?
                        <ActivityIndicator /> :
                        <Container>

                            <Header style={{ height: styles.dim.height / 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                                <Left style={{ flex: 1 }}>
                                    <Button transparent onPress={() => this.handleBackButtonClick()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>
                                </Left>

                                <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Profile</Text>
                                </Body>

                                <Right style={{ flex: 4 }}>
                                    <Button transparent onPress={() => this.Confirmer()}>
                                        <Label style={{ fontWeight: 'bold', color: 'white' }}>Save</Label>
                                    </Button>
                                </Right>
                            </Header>

                            <Content >
                                <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 15), width: styles.dim.width - (styles.dim.width / 10) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }} >Numero de telephone</Text>
                                    <Item>
                                        <Input style={{ fontSize: 14 }} maxLength={8} keyboardType='numeric' placeholder={Numero} onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false })}></Input>
                                    </Item>
                                    {this.state.Line1 == true ?
                                        <View>
                                            <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                            <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                                        </View>
                                        : console.log()}

                                    <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Vous travaillez le</Text>

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


                                    <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Vous pouvez preparer</Text>


                                    <Card transparent>

                                        <CardItem button onPress={() => this.state.Kosksi == 'true' ? this.setState({ Kosksi: 'false' }) : this.setState({ Kosksi: 'true', })}>
                                            <View style={{ paddingRight: 20 }}>
                                                <CheckBox
                                                    onPress={() => this.state.Kosksi == 'true' ? this.setState({ Kosksi: 'false' }) : this.setState({ Kosksi: 'true', })}
                                                    style={{ backgroundColor: this.state.Kosksi == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Kosksi === 'true'} />
                                            </View>
                                            <View style={{ paddingLeft: 20 }}>
                                                <Text >Kosksi</Text>
                                            </View>
                                        </CardItem>
                                    </Card>
                                    <Card transparent>

                                        <CardItem button onPress={() => this.state.Makrouna == 'true' ? this.setState({ Makrouna: 'false' }) : this.setState({ Makrouna: 'true', })}>
                                            <View style={{ paddingRight: 20 }}>
                                                <CheckBox
                                                    onPress={() => this.state.Makrouna == 'true' ? this.setState({ Makrouna: 'false' }) : this.setState({ Makrouna: 'true', })}
                                                    style={{ backgroundColor: this.state.Makrouna == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Makrouna === 'true'} />
                                            </View>
                                            <View style={{ paddingLeft: 20 }}>
                                                <Text >Makrouna</Text>
                                            </View>
                                        </CardItem>
                                    </Card>
                                    <Card transparent >

                                        <CardItem button onPress={() => this.state.Rouz == 'true' ? this.setState({ Rouz: 'false' }) : this.setState({ Rouz: 'true', })}>
                                            <View style={{ paddingRight: 20 }}>
                                                <CheckBox
                                                    onPress={() => this.state.Rouz == 'true' ? this.setState({ Rouz: 'false' }) : this.setState({ Rouz: 'true', })}
                                                    style={{ backgroundColor: this.state.Rouz == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Rouz === 'true'} />
                                            </View>
                                            <View style={{ paddingLeft: 20 }}>
                                                <Text >Rouz</Text>
                                            </View>
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