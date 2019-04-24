import React, { Component } from "react";
import {
    View,
    BackHandler,
    StyleSheet,
    Alert, ToastAndroid
} from "react-native";
import { Container, Header, Title, Button, CheckBox, Left, Right, Text, Body, Icon, Label, Input, Content, Form, ListItem, Radio } from 'native-base';
import * as firebase from 'firebase'

class AddChef extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Nom: '',
            PhotoUrl: '',
            Email: '',
            Numero: '',
            Adresse1: '',
            Adresse2: '',
            radio2: '',
            Kosksi: 'false',
            Makrouna: 'false',
            Rouz: 'false'
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);


    }





    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        var user = await firebase.auth().currentUser;
        this.setState({ PhotoUrl: user.photoURL })
        this.setState({ uid: user.uid })
        this.setState({ Nom: user.displayName })
        this.setState({ Email: user.providerData[0].email })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {

        Alert.alert(
            'Retourner',
            "Voulez-vous vraiment annuler l'inscription?",
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

    async AddChef() {
        var that = this
        if (this.state.Kosksi === 'false' && this.state.Makrouna === 'false' && this.state.Rouz === 'false'
            || this.state.radio2 === '' || this.state.Numero.length < 8 ||  this.state.Adresse1.length < 5 || this.state.Adresse2.length < 5)
            ToastAndroid.show('Completez votre profile', ToastAndroid.SHORT)
        else {

            try {
                await firebase.database().ref('Users/' + await firebase.auth().currentUser.uid).set({
                    Type: "Chef"
                })

                await firebase.database().ref('Chef/' + that.state.uid).set({
                    Nom: that.state.Nom,
                    Email: that.state.Email,
                    Numero: that.state.Numero,
                    Adresse1: that.state.Adresse1,
                    Adresse2: that.state.Adresse2,
                    Shift: that.state.radio2,
                    Kosksi: that.state.Kosksi,
                    Makrouna: that.state.Makrouna,
                    Rouz: that.state.Rouz,
                    Commandes: 0,
                    PhotoUrl: that.state.PhotoUrl
                })
                if (this.state.Kosksi === 'true') {
                    console.log("1")
                    if (this.state.radio2 === 'Dejeuner' || this.state.radio2 === 'DejeunerEtDinner') {
                        console.log('2')
                        await firebase.database().ref('Plats/1/Dejeuner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse1: that.state.Adresse1,
                            Adresse2: that.state.Adresse2,
                            Id: that.state.uid
                        })
                    }
                    if (this.state.radio2 === 'Dinner' || this.state.radio2 === 'DejeunerEtDinner') {
                        console.log('3')
                        await firebase.database().ref('Plats/1/Dinner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse1: that.state.Adresse1,
                            Adresse2: that.state.Adresse2,
                            Id: that.state.uid
                        })
                    }
                }
                if (this.state.Makrouna === 'true') {
                    if (this.state.radio2 === 'Dejeuner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/2/Dejeuner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse1: that.state.Adresse1,
                            Adresse2: that.state.Adresse2,
                            Id: that.state.uid
                        })
                    if (this.state.radio2 === 'Dinner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/2/Dinner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse1: that.state.Adresse1,
                            Adresse2: that.state.Adresse2,
                            Id: that.state.uid
                        })
                }
                if (this.state.Rouz === 'true') {
                    if (this.state.radio2 === 'Dejeuner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/3/Dejeuner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse1: that.state.Adresse1,
                            Adresse2: that.state.Adresse2,
                            Id: that.state.uid
                        })
                    if (this.state.radio2 === 'Dinner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/3/Dinner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse1: that.state.Adresse1,
                            Adresse2: that.state.Adresse2,
                            Id: that.state.uid
                        })
                }


                this.props.navigation.navigate("ChefTab")
            } catch (error) {
                alert("Error voire console log")
                console.log(error)
            }
        }


    }

    render() {
        return (
            <Container >
                <View style={{ alignItems: 'center', paddingTop: 50 }}>
                    <Label style={{ fontWeight: 'bold' }}>Vos informations</Label>
                </View>
                <Content >
                    <Input maxLength={8} keyboardType='numeric' placeholder='Ajouter votre numero de telephone...' onChangeText={(Numero) => this.setState({ Numero })}></Input>
                    <Input placeholder='Ajouter votre adresse...' onChangeText={(Adresse1) => this.setState({ Adresse1 })}></Input>
                    <Input placeholder='Ajouter 2éme adresse en détails (Ex: Prés de ..)' onChangeText={(Adresse2) => this.setState({ Adresse2 })}></Input>

                    <Text style={{ fontWeight: 'bold' }}>Vous travaillez</Text>
                    <ListItem>
                        <Left>
                            <Text>Dejeuner</Text>
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
                    <ListItem >
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
                    <ListItem>
                        <Left>
                            <Text>Dejeuner et Diner</Text>
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
                    <Text style={{ fontWeight: 'bold' }}>Vous pouvez preparer</Text>
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
                    <Button full style={{}} onPress={() => this.AddChef()}><Label style={{ fontWeight: 'bold', color: 'white' }}>Continuer</Label></Button>
                </Content>
            </Container>
        );
    }
}
export default AddChef;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});