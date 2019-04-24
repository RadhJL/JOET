import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    Alert, ToastAndroid
} from "react-native";
import { Container, Header, Title, Button, Left, Right, Body, Icon, Label, Input, Content, Form } from 'native-base';
import * as firebase from 'firebase'

class AddClient extends Component {
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


    async AddClient() {
        var that = this
        if (this.state.Numero.length < 8 || this.state.Adresse1.length < 5 || this.state.Adresse2.length < 5) {
            ToastAndroid.show('Completez votre profile', ToastAndroid.SHORT)
        }
        else {
            try {
                await firebase.database().ref('Users/' + await firebase.auth().currentUser.uid).set({
                    Type: "Client"
                })


                firebase.database().ref('Client/' + that.state.uid).set({
                    Nom: that.state.Nom,
                    Email: that.state.Email,
                    Numero: that.state.Numero,
                    Adresse1: that.state.Adresse1,
                    Adresse2: that.state.Adresse2,
                    Commandes: 0,
                    PhotoUrl: that.state.PhotoUrl
                })
                this.props.navigation.navigate('ClientTab')
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
                    <Form style={{ alignItems: 'center', paddingTop: 50 }}>
                        <Input maxLength={8} keyboardType='numeric' placeholder='Ajouter votre numero de telephone...' onChangeText={(Numero) => this.setState({ Numero })}></Input>
                        <Input placeholder='Ajouter votre adresse...' onChangeText={(Adresse1) => this.setState({ Adresse1 })}></Input>
                        <Input placeholder='Ajouter 2éme adresse en détails (Ex: Prés de ..)' onChangeText={(Adresse2) => this.setState({ Adresse2 })}></Input>
                        <Button full style={{}} onPress={() => this.AddClient()}><Label style={{ fontWeight: 'bold', color: 'white' }}>Continuer</Label></Button>
                    </Form>
                </Content>


            </Container>
        );
    }
}
export default AddClient;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});