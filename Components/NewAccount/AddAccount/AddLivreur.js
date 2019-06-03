import React, { Component } from "react";
import {
    View,
    BackHandler,
    StyleSheet,
    Alert, ToastAndroid, Dimensions, Platform
} from "react-native";
import { Container, Header, Title, Card, CardItem, Button, Left, Right, Text, Body, Icon, Label, Input, Content, Form, ListItem, Radio, Item } from 'native-base';
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
            radio2: '',//Shift
            Line1: false,
            Square1: false,
            Square2: false,
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

        if (this.state.Numero.length < 8 || isNaN(this.state.Numero)) {
            this.setState({ Line1: true })
        } else if (this.state.radio1 == '') {
            this.setState({ Square1: true })
        } else if (this.state.radio2 == '') {
            this.setState({ Square2: true })
        }
        else {
            try {
                var uid = await firebase.auth().currentUser.uid

                await firebase.database().ref('Users/' + uid).set({
                    Type: "Livreur"
                })

                await firebase.database().ref("Livreur/" + uid + "/Rate/").set({
                    Nombre: 0,
                    Somme: 0,
                    Score: 0,
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
                await firebase.database().ref("Livreur/" + that.state.uid + "/Rate/").set({
                    Nombre: 0,
                    Somme: 0,
                    Score: 0,
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
                <Header style={{ height: styles.dim.height / 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.handleBackButtonClick()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>

                    </Left>
                    <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Livreur</Text>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>

                <Content >
                    <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 15), width: styles.dim.width - (styles.dim.width / 10) }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Numero de telephone</Text>
                        <Item>
                            <Input style={{ fontSize: 14 }} maxLength={8} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'} placeholder='Ajouter numero de telephone..' onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false })}></Input>
                        </Item>
                        {this.state.Line1 == true ?
                            <View>
                                <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                            </View>
                            : console.log()}
                        <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 20 }}>Vous vous deplacez avec</Text>

                        <View style={{ borderWidth: this.state.Square1 == true ? 2.5 : 0, borderColor: this.state.Square1 == true ? '#5e0231' : 'white', }}>
                            <Card>
                                <CardItem button style={{ backgroundColor: this.state.radio1 == 'Bicyclette' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio1: 'Bicyclette', Square1: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.radio1 == 'Bicyclette' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Bicyclette</Text>
                                </CardItem>
                            </Card>
                            <Card >

                                <CardItem button style={{ backgroundColor: this.state.radio1 == 'Moto' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio1: 'Moto', Square1: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.radio1 == 'Moto' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Moto</Text>
                                </CardItem>


                            </Card>
                            <Card>
                                <CardItem button style={{ backgroundColor: this.state.radio1 == 'Voiture' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio1: 'Voiture', Square1: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.radio1 == 'Voiture' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Voiture</Text>
                                </CardItem>
                            </Card>
                            {this.state.Square1 == true ?
                                <Text style={{ color: '#5e0231', fontWeight: 'bold', fontStyle: 'italic',fontSize:14 }}>Vous devez choisir le moyen de transport</Text>
                                : console.log()}
                        </View>

                        <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 20 }}>Vous travaillez le</Text>
                        <View style={{ borderWidth: this.state.Square2 == true ? 2.5 : 0, borderColor: this.state.Square2 == true ? '#5e0231' : 'white', }}>

                            <Card>
                                <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dejeuner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dejeuner', Square2: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dejeuner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner</Text>
                                </CardItem>
                            </Card>

                            <Card >
                                <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dinner', Square2: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Diner</Text>
                                </CardItem>
                            </Card>

                            <Card>

                                <CardItem button style={{ backgroundColor: this.state.radio2 == 'DejeunerEtDinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'DejeunerEtDinner', Square2: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.radio2 == 'DejeunerEtDinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner et Diner</Text>
                                </CardItem>

                            </Card>
                            {this.state.Square2 == true ?
                                <Text style={{ color: '#5e0231', fontWeight: 'bold', fontStyle: 'italic' ,fontSize:14}}>Vous devez choisir l'horaire de travail</Text>
                                : console.log()}
                        </View>
                        <Card style={{ marginTop: 20 }}>
                            <Button full style={{ backgroundColor: 'white' }} onPress={() => this.AddLivreur()}><Label style={{ fontWeight: 'bold', color: '#FF2E2A' }}>Continuer</Label></Button>
                        </Card>
                    </Form>
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
        justifyContent: 'center',
        backgroundColor: '#F1EFEA'
    },
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});