import React, { Component } from "react";
import { Alert, View, StyleSheet, Image, Text, TimePickerAndroid, ToastAndroid, Dimensions, Platform } from "react-native";
import { Picker, DatePicker, Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right, ListItem, Radio, CheckBox, Footer, Form } from 'native-base';
import ActivityIndicator from '../../../ActivityIndicator'
import * as firebase from 'firebase'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { BackHandler } from 'react-native';
let BoolDejeuner = false
let BoolDinner = false
let MemeLivreur = false
let flag = true
let x = 0
let NumeroLivreur
let NomLivreur
let IdLivreur
let NomChef
let NumeroChef
let AdresseChef
let IdChef
let Temps

class Commander extends Component {

    constructor(props) {

        super(props)
        this.state = {
            IdCommande: '',
            IdClient: '',
            NomClient: '',
            NomLivreur: '',
            NomChef: '',
            NumeroClient: '',
            NumeroLivreur: '',
            NumeroChef: '',
            Plat: '',
            Prix: 3,
            Total: 3,//Prix*Qte
            Qte: 1,
            AdresseChef: '',
            AdresseTravailClient: '',
            AdresseResidenceClient: '',
            AdresseClient: '',
            chosenDate: new Date(),
            Heure: '',
            CleClient: 0,
            CleChef: 0,
            Dejeuner: false,
            Dinner: false,
            LivreurDejeuner: [],
            LivreurDinner: [],
            ChefDejeuner: [],
            ChefDinner: [],
            Animating: true, //Activity Indicator

            SelectAdresseResidenceClient: false,
            SelectAdresseTravailClient: false,
            Chef: "",
            wait: false,
            Platform: Platform.OS,
            Line1: false,
            Line2: false,
            Line3: false,
            Line4: false,
            Square1: false,
            Square2: false

        }
        this.setDate = this.setDate.bind(this);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        Alert.alert(
            'Anuuler',
            'Voulez-vous vraiment annuler la commande?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log(),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        MemeLivreur = false
                        BoolDejeuner = false
                        BoolDinner = false
                        this.props.navigation.goBack(null)
                    }
                },
            ],
            { cancelable: false },
        );

        return true;
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        var ClientUid = await firebase.auth().currentUser.uid
        var key = firebase.database().ref().push().key
        this.setState({ IdCommande: key })
        var that = this

        await firebase.database().ref('Client/' + ClientUid).once('value', function (snap) {
            that.setState({ IdClient: ClientUid })
            that.setState({ NomClient: snap.val().Nom })
            that.setState({ NumeroClient: snap.val().Numero })
            if (snap.val().AdresseResidence != null)
                that.setState({ AdresseResidenceClient: snap.val().AdresseResidence })

            if (snap.val().AdresseTravail != null)
                that.setState({ AdresseTravailClient: snap.val().AdresseTravail })
        })

        await firebase.database().ref('Plats/' + this.props.navigation.getParam('Ind')).once('value', function (snap) {
            that.setState({ Plat: snap.val().Nom })
            that.setState({ Prix: snap.val().Prix })
            that.setState({ Total: snap.val().Prix })
        })

        await this.setState({ CleClient: Math.floor(Math.random() * (999999 - 100000)) + 100000 })
        await this.setState({ CleChef: Math.floor(Math.random() * (999999 - 100000)) + 100000 })
        this.setState({ Animating: false })
    }

    async Confirmer2() {
        var Dateee = new Date(this.state.chosenDate.getFullYear().toString(), this.state.chosenDate.getMonth().toString()
            , this.state.chosenDate.getDate().toString(), this.state.Heure.substr(0, 2), this.state.Heure.substr(3, 2))
        var Datee = Dateee.toString()
        var Dateeee = this.state.chosenDate.getFullYear().toString() + "-" + this.state.chosenDate.getMonth().toString()
            + "-" + this.state.chosenDate.getDate().toString() + "-" + this.state.Heure.substr(0, 2) + "-" + this.state.Heure.substr(3, 2)
        var that = this

        await firebase.database().ref('Commandes/')
            .on('child_added', function (snapshot) {

                if (snapshot.val().Date === Datee && snapshot.val().IdClient === that.state.IdClient) {
                    if (snapshot.val().AdresseClient === that.state.AdresseClient) {
                        NumeroLivreur = snapshot.val().NumeroLivreur
                        NomLivreur = snapshot.val().NomLivreur
                        IdLivreur = snapshot.val().IdLivreur
                        MemeLivreur = true
                    } else {
                        alert("Vous avez une autre commande pour la meme date de livraison mais des lieu differentes veuillez verifiez")
                        flag = false
                    }
                }

            })

        if (flag == true) {
            if (this.state.Dejeuner == true && this.state.LivreurDejeuner != null && this.state.ChefDejeuner != null) {
                Temps = "Dejeuner"
                if (MemeLivreur == false) {
                    x = Math.floor(Math.random() * (this.state.LivreurDejeuner.length))
                    NumeroLivreur = this.state.LivreurDejeuner[x].Numero
                    NomLivreur = this.state.LivreurDejeuner[x].Nom
                    IdLivreur = this.state.LivreurDejeuner[x].Id
                }

                if (this.state.Chef.length == 0) {

                    x = Math.floor(Math.random() * (this.state.ChefDejeuner.length))
                    NomChef = this.state.ChefDejeuner[x].Nom
                    NumeroChef = this.state.ChefDejeuner[x].Numero
                    AdresseChef = this.state.ChefDejeuner[x].Adresse
                    IdChef = this.state.ChefDejeuner[x].Id

                }
                else {
                    NomChef = that.state.Chef.Nom
                    NumeroChef = that.state.Chef.Numero
                    AdresseChef = that.state.Chef.Adresse
                    IdChef = that.state.Chef.Id
                }



            } else {
                Temps = "Diner"
                if (MemeLivreur == false) {
                    x = Math.floor(Math.random() * (this.state.LivreurDinner.length))
                    NumeroLivreur = this.state.LivreurDinner[x].Numero
                    NomLivreur = this.state.LivreurDinner[x].Nom
                    IdLivreur = this.state.LivreurDinner[x].Id
                }

                if (this.state.Chef.length == 0) {

                    x = Math.floor(Math.random() * (this.state.ChefDinner.length))
                    NomChef = this.state.ChefDinner[x].Nom
                    NumeroChef = this.state.ChefDinner[x].Numero
                    AdresseChef = this.state.ChefDinner[x].Adresse
                    IdChef = this.state.ChefDinner[x].Id


                } else {
                    NomChef = that.state.Chef.Nom
                    NumeroChef = that.state.Chef.Numero
                    AdresseChef = that.state.Chef.Adresse
                    IdChef = that.state.Chef.Id
                }


            }

            var Livraison = 2
            if (MemeLivreur == true)
                Livraison = "Gratuite"


            await firebase.database().ref('Commandes/' + that.state.IdCommande + "/").set({
                IdCommande: that.state.IdCommande,
                IdClient: that.state.IdClient,
                IdLivreur: IdLivreur,

                IdChef: IdChef,
                NomChef: NomChef,
                NumeroChef: NumeroChef,
                AdresseChef: AdresseChef,
                NomClient: that.state.NomClient,
                NomLivreur: NomLivreur,
                NumeroClient: that.state.NumeroClient,
                NumeroLivreur: NumeroLivreur,
                AdresseClient: that.state.AdresseClient,
                Plat: that.state.Plat,
                Prix: that.state.Total,
                Qte: that.state.Qte,
                Livraison: Livraison,
                Etat: 'En Preparation',
                Date: Datee,
                Heure: Temps,
                CleClient: that.state.CleClient,
                CleChef: that.state.CleChef,
                IdClientSortDate: that.state.IdClient + "-" + Dateeee,
                IdLivreurSortDate: IdLivreur + "-" + Dateeee,
                IdChefSortDate: IdChef + "-" + Dateeee,

            })

            MemeLivreur = false
            BoolDejeuner = false
            BoolDinner = false
            this.props.navigation.navigate('ClientTab')
        }

        flag = true

    }

    async Confirmer() {



        if (this.state.Dejeuner == false && this.state.Dinner == false)
            this.setState({ Square1: true, Line3: false, Line1: false, Line2: false, Line4: false })

        else if (this.state.Heure === '' && this.state.Dejeuner == true)
            this.setState({ Line3: true, Line1: false, Line2: false, Line4: false })
        else if (this.state.Heure === '' && this.state.Dinner == true)
            this.setState({ Line4: true, Line1: false, Line2: false, Line3: false })

        else if (this.state.SelectAdresseResidenceClient == false && this.state.SelectAdresseTravailClient == false)
            this.setState({ Square2: true })
        else {
            if ((this.state.Dejeuner == true && (this.state.LivreurDejeuner.length == 0 || this.state.ChefDejeuner.length == 0))
                || (this.state.Dinner == true && (this.state.LivreurDinner.length == 0 || this.state.ChefDinner.length == 0))) {
                Alert.alert(
                    'Probleme',
                    "nous n'avons pas de chef ou de livreur pour cette commande",
                    [

                        {
                            text: 'OK', onPress: () => {
                                console.log()
                            }
                        },
                    ],
                    { cancelable: false },
                );
            } else {
                Alert.alert(
                    'Confirmation',
                    'Confirmer la commande ?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log(),
                            style: 'cancel',
                        },
                        {
                            text: 'OK', onPress: () => {
                                this.Confirmer1()
                            }
                        },
                    ],
                    { cancelable: false },
                );
                return true

            }
        }

    }

    Dejeuner = async () => {
        this.setState({ Heure: '' })
        this.setState({ Line1: false, Line2: false, Line4: false, Line3: false, Square1: false })

        if (new Date().getDate() < this.state.chosenDate.getDate() || new Date().getHours() < 12
            ||
            new Date().getMonth() < this.state.chosenDate.getMonth()) {
            this.setState({ Dejeuner: true, Dinner: false })

            if (BoolDejeuner == false) {
                var that = this
                firebase.database().ref('Livreur/Dejeuner').on('child_added', function (snapshot) {
                    var NewData = [...that.state.LivreurDejeuner]
                    NewData.push(snapshot.val())
                    that.setState({ LivreurDejeuner: NewData })
                })
                firebase.database().ref('Plats/' + this.props.navigation.getParam('Ind') + '/Dejeuner').on('child_added', function (snapshot) {//A refaire
                    var NewData = [...that.state.ChefDejeuner]
                    NewData.push(snapshot.val())
                    that.setState({ ChefDejeuner: NewData })
                })

                BoolDejeuner = true
            }

        } else {
            this.setState({ Line1: true })
        }
    }

    Dinner = async () => {
        this.setState({ Heure: '' })
        this.setState({ Line1: false, Line2: false, Line3: false, Line4: false, Square1: false })

        if (new Date().getDate() < this.state.chosenDate.getDate() || new Date().getHours() < 18
            ||
            new Date().getMonth() < this.state.chosenDate.getMonth()
        ) {
            this.setState({ Dinner: true, Dejeuner: false })

            if (BoolDinner == false) {
                var that = this

                firebase.database().ref('Livreur/Dinner').on('child_added', function (snapshot) {
                    var NewData = [...that.state.LivreurDinner]
                    NewData.push(snapshot.val())
                    that.setState({ LivreurDinner: NewData })
                })

                firebase.database().ref('Plats/' + this.props.navigation.getParam('Ind') + '/Dinner')
                    .on('child_added', function (snapshot) {
                        var NewData = [...that.state.ChefDinner]
                        NewData.push(snapshot.val())
                        that.setState({ ChefDinner: NewData })
                    })


            }
            BoolDinner = true
        } else {
            this.setState({ Line2: true })
        }
    }

    Lieu(ch) {
        this.setState({ Square2: false })
        if (ch == 'Residence') {
            this.setState({ SelectAdresseResidenceClient: true, SelectAdresseTravailClient: false, AdresseClient: this.state.AdresseResidenceClient })

        } else {
            this.setState({ SelectAdresseResidenceClient: false, SelectAdresseTravailClient: true, AdresseClient: this.state.AdresseTravailClient })

        }

    }

    async Confirmer1() {
        if (this.state.wait == false) {
            await this.setState({ wait: true, Animating: true })
            await this.Confirmer2()
            await this.setState({ wait: false, Animating: false })
        }
    }
    render() {
        return (

            <Container>
                {this.state.Animating == true ?
                    <ActivityIndicator />
                    :
                    <Container>
                        <Header style={{ paddingTop: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                            <Left style={{ flex: 1 }}>
                                <Button transparent onPress={() => this.handleBackButtonClick()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button></Left>
                            <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Au Panier</Text>
                            </Body>
                            <Right style={{ flex: 1 }}></Right>
                        </Header>

                        <Content>
                            <Form style={{ width: styles.dim.width - styles.dim.width / 30, alignSelf: 'center' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}> {this.state.Plat} </Text>
                                </View>
                                <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button transparent onPress={() => this.state.Qte > 1 ? this.setState({ 'Qte': (this.state.Qte - 1), 'Total': ((this.state.Qte - 1) * this.state.Prix) }) : console.log("")}>
                                        <Text><FontAwesome style={{ fontSize: 30, color: this.state.Qte == 1 ? 'gray' : '#FF2E2A' }} name="arrow-circle-down"></FontAwesome> </Text>
                                    </Button>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>Pour </Text>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.state.Qte}{" "}Personne
                                    </Text>
                                    </View>
                                    <Button transparent onPress={() => this.state.Qte < 3 ? this.setState({ 'Qte': (this.state.Qte + 1), 'Total': ((this.state.Qte + 1) * this.state.Prix) }) : console.log()}>
                                        <Text ><FontAwesome style={{ fontSize: 30, color: this.state.Qte == 3 ? 'gray' : '#FF2E2A' }} name="arrow-circle-up"></FontAwesome> </Text>
                                    </Button>
                                </View>

                                <Card style={{ paddingTop: 20 }}>
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 15 }}>Livraison</Text>
                                    <Text style={{ fontWeight: 'bold', color: 'gray', alignSelf: 'center' }}>2 DT (si premier plat)</Text>
                                    <View style={{ paddingTop: 10, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}> Le jour</Text>
                                        <View style={{ alignItems: 'center' }}>
                                            <Card>

                                                <DatePicker
                                                    style={{ alignSelf: 'center', alignItems: 'center' }}
                                                    defaultDate={new Date()}
                                                    minimumDate={new Date()}
                                                    maximumDate={new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 2).toString())}
                                                    locale={"en"}
                                                    timeZoneOffsetInMinutes={undefined}
                                                    modalTransparent={false}
                                                    animationType={"none"}
                                                    androidMode={"default"}
                                                    placeHolderText="cliquez pour choisir"
                                                    textStyle={{ color: "green" }}
                                                    placeHolderTextStyle={{ color: "#FF2E2A" }}
                                                    onDateChange={(Date) => { this.setDate, this.setState({ Dejeuner: false, Dinner: false, Line1: false, Line2: false, Line3: false, Line4: false, chosenDate: Date }) }}
                                                    disabled={false}
                                                />
                                            </Card>

                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold' }}>
                                                {this.state.chosenDate.toString().substr(4, 12)}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}> L'heure </Text>
                                    <View style={{
                                        borderWidth: this.state.Square1 == true ? 2 : 0,
                                        borderColor: this.state.Square1 == true ? '#b56969' : "white",
                                        padding: this.state.Square1 == true ? 3 : 0,
                                    }} >
                                        <Card >
                                            <CardItem style={{ backgroundColor: this.state.Dejeuner == true ? '#FF2E2A' : 'white' }} button onPress={() => this.Dejeuner()}>
                                                <Text style={{ color: this.state.Dejeuner == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner</Text>
                                            </CardItem>
                                        </Card>
                                        {this.state.Line1 == true ?
                                            <View style={{ marginBottom: 7 }}>
                                                <Text style={{ color: '#b56969', fontWeight: 'bold', fontStyle: 'italic' }}>Dejeuner n'est plus disponible aujourd'hui</Text>
                                                <View style={{ borderBottomColor: '#b56969', borderBottomWidth: 3, }} />
                                            </View>
                                            : console.log()
                                        }


                                        {this.state.Dejeuner == true && this.state.Platform === 'android' ?
                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                headerStyle={{ backgroundColor: "#FF2E2A" }}
                                                headerBackButtonTextStyle={{ color: "#fff" }}
                                                headerTitleStyle={{ color: "#fff" }}
                                                selectedValue={this.state.Heure}
                                                placeholder="Choissisez l'heure"
                                                onValueChange={(itemValue) =>
                                                    this.setState({ Heure: itemValue, Line3: false })
                                                }>
                                                <Picker.Item label="Clicker pour choisir l'heure" value="" />
                                                <Picker.Item label="Entre 12h~12h30" value="12:00" />
                                                <Picker.Item label="Entre 12h30~13h" value="12:30" />
                                                <Picker.Item label="Entre 13h~13h30" value="13:00" />
                                                <Picker.Item label="Entre 13h30~14h" value="13:30" />
                                                <Picker.Item label="Entre 14h~14h30" value="14:00" />
                                                <Picker.Item label="Entre 14h30~15h" value="14:30" />
                                            </Picker>
                                            :
                                            console.log()
                                        }

                                        {this.state.Dejeuner == true && this.state.Platform === 'ios' ?
                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                headerStyle={{ backgroundColor: "#FF2E2A" }}
                                                headerBackButtonTextStyle={{ color: "#fff" }}
                                                headerTitleStyle={{ color: "#fff" }}
                                                selectedValue={this.state.Heure}
                                                placeholder="Choissisez l'heure"
                                                onValueChange={(itemValue) =>
                                                    this.setState({ Heure: itemValue, Line3: false })
                                                }>
                                                <Picker.Item label="Entre 12h~12h30" value="12:00" />
                                                <Picker.Item label="Entre 12h30~13h" value="12:30" />
                                                <Picker.Item label="Entre 13h~13h30" value="13:00" />
                                                <Picker.Item label="Entre 13h30~14h" value="13:30" />
                                                <Picker.Item label="Entre 14h~14h30" value="14:00" />
                                                <Picker.Item label="Entre 14h30~15h" value="14:30" />
                                            </Picker>
                                            :
                                            console.log()
                                        }
                                        {this.state.Line3 == true ?
                                            <View style={{ marginBottom: 7 }}>
                                                <Text style={{ color: '#b56969', fontWeight: 'bold', fontStyle: 'italic' }}>Vous devez choisir l'heure</Text>
                                                <View style={{ borderBottomColor: '#b56969', borderBottomWidth: 3, }} />
                                            </View>
                                            : console.log()
                                        }


                                        <Card >

                                            <CardItem style={{ backgroundColor: this.state.Dinner == true ? '#FF2E2A' : 'white' }} button onPress={() => this.Dinner()}>
                                                <Text style={{ color: this.state.Dinner == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Diner</Text>
                                            </CardItem>
                                        </Card>

                                        {this.state.Line2 == true ?
                                            <View style={{ marginBottom: 7 }}>
                                                <Text style={{ color: '#b56969', fontWeight: 'bold', fontStyle: 'italic' }}>Diner n'est plus disponible aujourd'hui</Text>
                                                <View style={{ borderBottomColor: '#b56969', borderBottomWidth: 3, }} />
                                            </View>
                                            : console.log()
                                        }


                                        {this.state.Dinner == true && this.state.Platform === 'android' ?

                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                headerStyle={{ backgroundColor: "#FF2E2A" }}
                                                headerBackButtonTextStyle={{ color: "#fff" }}
                                                headerTitleStyle={{ color: "#fff" }}
                                                selectedValue={this.state.Heure}
                                                placeholder="Choissisez l'heure"
                                                onValueChange={(itemValue) =>
                                                    this.setState({ Heure: itemValue, Line4: false })
                                                }>
                                                <Picker.Item label="Clicker pour choisir l'heure" value="" />
                                                <Picker.Item label="Entre 18h~18h30" value="18:00" />
                                                <Picker.Item label="Entre 18h30~19h" value="18:30" />
                                                <Picker.Item label="Entre 19h~19h30" value="19:00" />
                                                <Picker.Item label="Entre 19h30~20h" value="19:30" />
                                                <Picker.Item label="Entre 20h~20h30" value="20:00" />
                                                <Picker.Item label="Entre 20h30~21h" value="20:30" />

                                            </Picker>
                                            :
                                            console.log()
                                        }

                                        {this.state.Dinner == true && this.state.Platform === 'ios' ?

                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                headerStyle={{ backgroundColor: "#FF2E2A" }}
                                                headerBackButtonTextStyle={{ color: "#fff" }}
                                                headerTitleStyle={{ color: "#fff" }}
                                                selectedValue={this.state.Heure}
                                                placeholder="Choissisez l'heure"
                                                onValueChange={(itemValue) =>
                                                    this.setState({ Heure: itemValue, Line4: false })
                                                }>
                                                <Picker.Item label="Entre 18h~18h30" value="18:00" />
                                                <Picker.Item label="Entre 18h30~19h" value="18:30" />
                                                <Picker.Item label="Entre 19h~19h30" value="19:00" />
                                                <Picker.Item label="Entre 19h30~20h" value="19:30" />
                                                <Picker.Item label="Entre 20h~20h30" value="20:00" />
                                                <Picker.Item label="Entre 20h30~21h" value="20:30" />

                                            </Picker>
                                            :
                                            console.log()
                                        }
                                        {this.state.Line4 == true ?
                                            <View style={{ marginBottom: 7 }}>
                                                <Text style={{ color: '#b56969', fontWeight: 'bold', fontStyle: 'italic' }}>Vous devez choisir l'heure</Text>
                                                <View style={{ borderBottomColor: '#b56969', borderBottomWidth: 3, }} />
                                            </View>
                                            : console.log()
                                        }
                                        {this.state.Dejeuner == true || this.state.Dinner == true ?

                                            <Card style={{ paddingTop: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Preparer pas le chef</Text>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    headerStyle={{ backgroundColor: "#FF2E2A" }}
                                                    headerBackButtonTextStyle={{ color: "#fff" }}
                                                    headerTitleStyle={{ color: "#fff" }}
                                                    placeholder="Laissez nous choisir"
                                                    selectedValue={this.state.Chef}
                                                    onValueChange={(itemValue) =>
                                                        this.setState({ Chef: itemValue })
                                                    }>
                                                    <Picker.Item label="Laissez nous choisir le chef" value="" />

                                                    {this.state.Dejeuner == true ?
                                                        this.state.ChefDejeuner.map((data, ind) => {
                                                            return (
                                                                <Picker.Item key={ind} label={data.Nom} value={(data)} />
                                                            )
                                                        }) :
                                                        this.state.ChefDinner.map((data, ind) => {
                                                            return (
                                                                <Picker.Item key={ind} label={data.Nom} value={(data)} />
                                                            )
                                                        })
                                                    }

                                                </Picker>
                                            </Card>
                                            :
                                            console.log()
                                        }
                                        {this.state.Square1 == true ?
                                            <Text style={{ color: '#b56969', fontWeight: 'bold', fontStyle: 'italic' }}>Vous devez choisir Dejeuner ou Diner</Text> :
                                            console.log()
                                        }
                                    </View>

                                    <Text style={{ paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}> Lieu</Text>
                                    <View style={{
                                        borderWidth: this.state.Square2 == true ? 2 : 0,
                                        borderColor: this.state.Square2 == true ? '#b56969' : "white",
                                        padding: this.state.Square2 == true ? 3 : 0,
                                    }} >
                                        {(this.state.AdresseResidenceClient != undefined && this.state.AdresseResidenceClient != "") ?
                                            <CardItem style={{ paddingBottom: 10 }} button onPress={() => this.Lieu('Residence')}>
                                                <View style={{ paddingRight: 20 }}>
                                                    <CheckBox style={{ borderColor: '#FF2E2A', backgroundColor: this.state.SelectAdresseResidenceClient == true ? '#FF2E2A' : 'white' }} checked={this.state.SelectAdresseResidenceClient} />
                                                </View>
                                                <View style={{ paddingLeft: 20 }}>
                                                    <Text >de residence</Text>
                                                </View>
                                            </CardItem>
                                            : console.log()
                                        }

                                        {(this.state.AdresseTravailClient != undefined && this.state.AdresseTravailClient != "") ?

                                            <CardItem style={{ paddingBottom: 10 }} button onPress={() => this.Lieu('Travail')}>
                                                <View style={{ paddingRight: 20 }}>
                                                    <CheckBox style={{ borderColor: '#FF2E2A', backgroundColor: this.state.SelectAdresseTravailClient == true ? '#FF2E2A' : 'white' }} checked={this.state.SelectAdresseTravailClient} />
                                                </View>
                                                <View style={{ paddingLeft: 20 }}>
                                                    <Text >de travail</Text>
                                                </View>
                                            </CardItem>
                                            : console.log()
                                        }
                                        {this.state.Square2 == true ?
                                            <Text style={{ color: '#b56969', fontWeight: 'bold', fontStyle: 'italic' }}>Vous devez choisir Dejeuner ou Diner</Text> :
                                            console.log()
                                        }
                                    </View>
                                </Card>

                                <View style={{ paddingTop: 20, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        Prix Totale{" "}
                                        {this.state.Total + 2}{" "}
                                        <FontAwesome name="money" style={{ fontSize: 15, color: 'green' }} />
                                    </Text>
                                    {/* <View style={{ paddingTop: 10 }}>
                                    <Button style={{ backgroundColor: '#FF2E2A', width: styles.dim.width - styles.dim.width / 13 }} full onPress={() => this.Confirmer()}><Text style={{ fontWeight: 'bold', color: 'white' }} >Confirmer</Text></Button>
                                </View> */}
                                </View>
                            </Form>

                        </Content>

                        <Footer style={{ backgroundColor: 'white' }}>
                            <Card style={{ alignSelf: 'center', width: styles.dim.width - styles.dim.width / 50 }}>
                                <Button style={{ backgroundColor: "white" }} full onPress={() => this.Confirmer()}><Text style={{ fontWeight: 'bold', color: '#FF2E2A', alignSelf: 'center', fontSize: 18 }}>Confirmer</Text></Button>
                            </Card>
                        </Footer>

                    </Container>
                }
            </Container>
        );
    }
}
export default Commander;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
    },
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },

});