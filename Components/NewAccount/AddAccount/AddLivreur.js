import React, { Component } from "react";
import {
    View,
    BackHandler,
    StyleSheet,
    Alert, ToastAndroid
} from "react-native";
import { Container, Header, Title, Button, Left, Right, Text, Body, Icon, Label, Input, Content, Form, ListItem, Radio } from 'native-base';
import * as firebase from 'firebase'

class AddLivreur extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Nom: '',
            PhotoUrl: '',
            Email: '',
            Numero: '',
            radio1: '',//Deplacement
            radio2: ''//Shift
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


    async AddLivreur() {
        var that = this
        if (this.state.Numero.length < 8 || this.state.radio1 === '' || this.state.radio2 === '') {
            ToastAndroid.show('Completez votre profile', ToastAndroid.SHORT)
        } else {
            try {
                await firebase.database().ref('Users/' + await firebase.auth().currentUser.uid).set({
                    Type: "Livreur"
                })

                await firebase.database().ref('Livreur/' + that.state.uid).set({
                    Nom: that.state.Nom,
                    Email: that.state.Email,
                    Numero: that.state.Numero,
                    Deplacement: that.state.radio1,
                    Shift: that.state.radio2,
                    Commandes: 0,
                    PhotoUrl: that.state.PhotoUrl

                })

                if (that.state.radio2 === 'Dejeuner' || that.state.radio2 === 'DejeunerEtDinner')
                    await firebase.database().ref('Livreur/Dejeuner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })
                if (that.state.radio2 === 'Dinner' || that.state.radio2 === 'DejeunerEtDinner')
                    await firebase.database().ref('Livreur/Dinner/' + that.state.uid).set({
                        Numero: that.state.Numero,
                        Nom: that.state.Nom,
                        Id: that.state.uid
                    })

                this.props.navigation.navigate("LivreurTab")
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

                    <Text style={{ fontWeight: 'bold' }}>Vous vous deplacez avec</Text>
                    <ListItem>
                        <Left>
                            <Text>Bicyclette</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio1 == 'Bicyclette'}
                                onPress={() => this.setState({ radio1: 'Bicyclette' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem >
                        <Left>
                            <Text>Moto</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio1 == 'Moto'}
                                onPress={() => this.setState({ radio1: 'Moto' })}
                            />
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Voiture</Text>
                        </Left>
                        <Right>
                            <Radio
                                color={"black"}
                                selectedColor={"black"}
                                selected={this.state.radio1 == 'Voiture'}
                                onPress={() => this.setState({ radio1: 'Voiture' })}
                            />
                        </Right>
                    </ListItem>

                    <Text style={{ fontWeight: 'bold' }}>Vous travaillez le</Text>
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
                    <Button full style={{}} onPress={() => this.AddLivreur()}><Label style={{ fontWeight: 'bold', color: 'white' }}>Continuer</Label></Button>

                </Content>


            </Container>
        );
    }
}
export default AddLivreur;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});