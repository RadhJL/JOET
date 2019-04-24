import React, { Component } from "react";
import { Alert, View, StyleSheet, Image, Text, TimePickerAndroid, ToastAndroid, ActivityIndicator } from "react-native";
import { Picker, DatePicker, Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right, ListItem, Radio } from 'native-base';
import * as firebase from 'firebase'
import { BackHandler } from 'react-native';
let BoolDejeuner = false
let BoolDinner = false


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
            Adresse1Chef: '',
            Adresse2Chef: '',
            Adresse1Client: '',
            Adresse2Client: '',
            chosenDate: new Date(),
            Heure: '0',
            CleClient: 0,
            CleChef: 0,
            Dejeuner: false,
            Dinner: false,
            LivreurDejeuner: [],
            LivreurDinner: [],
            ChefDejeuner: [],
            ChefDinner: [],
            Animating: true //Activity Indicator
        }
        this.setDate = this.setDate.bind(this);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    setDate(newDate) {
        //   console.log(newDate)
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
                { text: 'OK', onPress: () => this.props.navigation.goBack(null) },
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
            that.setState({ Adresse1Client: snap.val().Adresse1 })
            that.setState({ Adresse2Client: snap.val().Adresse2 })
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

    async Confirmer() {

        // console.log(new Date(this.state.chosenDate.getFullYear().toString(), this.state.chosenDate.getMonth().toString()
        //     , this.state.chosenDate.getDate().toString(), this.state.Heure.substr(0, 2), this.state.Heure.substr(3, 2)))

        if (this.state.Dejeuner == false && this.state.Dinner == false) {
            ToastAndroid.show('Choisir Dejeuner Ou Dinner !', ToastAndroid.SHORT);


        }
        else if (this.state.Heure === '0')
            ToastAndroid.show('Choisir l"heure !', ToastAndroid.SHORT);

        else {
            if ((this.state.Dejeuner == true && (this.state.LivreurDejeuner.length == 0 || this.state.ChefDejeuner[0] == null))
                || (this.state.Dinner == true && (this.state.LivreurDinner.length == 0 || this.state.ChefDinner[0] == null))) {
                alert("N'est pas disponible pour le moment")
            } else {
                var Dateee = new Date(this.state.chosenDate.getFullYear().toString(), this.state.chosenDate.getMonth().toString()
                    , this.state.chosenDate.getDate().toString(), this.state.Heure.substr(0, 2), this.state.Heure.substr(3, 2))
                var Datee = Dateee.toString()
                //console.log(Datee)
                var that = this
                if (this.state.Dejeuner == true && this.state.LivreurDejeuner != null && this.state.ChefDejeuner != null) {

                    var x = Math.floor(Math.random() * (this.state.LivreurDejeuner.length))
                    var NumeroLivreur = this.state.LivreurDejeuner[x].Numero
                    var NomLivreur = this.state.LivreurDejeuner[x].Nom
                    var IdLivreur = this.state.LivreurDejeuner[x].Id
                    // console.log('Nombre de livreur: ' + this.state.LivreurDejeuner.length + ' Index de livreur: ' + x)
                    // console.log('Numero Livreur: ' + this.state.LivreurDejeuner[x].Numero)


                    var x = Math.floor(Math.random() * ((Object.values(this.state.ChefDejeuner[0])).length))
                    var NomChef = (Object.values(this.state.ChefDejeuner[0]))[x].Nom
                    var NumeroChef = (Object.values(this.state.ChefDejeuner[0]))[x].Numero
                    var Adresse1Chef = (Object.values(this.state.ChefDejeuner[0]))[x].Adresse1
                    var Adresse2Chef = (Object.values(this.state.ChefDejeuner[0]))[x].Adresse2
                    var IdChef = (Object.values(this.state.ChefDejeuner[0]))[x].Id
                    // console.log('Nombre de chef ' + (Object.values(this.state.ChefDejeuner[0])).length + ' Index de chef ' + x)
                    // console.log('Numero Chef ' + (Object.values(this.state.ChefDejeuner[0]))[x].Numero + ' Adresse 1 Chef' + (Object.values(this.state.ChefDejeuner[0]))[x].Adresse1)
                    await firebase.database().ref('Commandes/' + that.state.IdCommande + "/").set({
                        IdCommande: that.state.IdCommande,
                        IdClient: that.state.IdClient,
                        IdLivreur: IdLivreur,
                        IdChef: IdChef,
                        NomClient: that.state.NomClient,
                        NomLivreur: NomLivreur,
                        NomChef: NomChef,
                        NumeroClient: that.state.NumeroClient,
                        NumeroLivreur: NumeroLivreur,
                        NumeroChef: NumeroChef,
                        Adresse1Chef: Adresse1Chef,
                        Adresse2Chef: Adresse2Chef,
                        Adresse1Client: that.state.Adresse1Client,
                        Adresse2Client: that.state.Adresse2Client,
                        Plat: that.state.Plat,
                        Prix: that.state.Total,
                        Qte: that.state.Qte,
                        Etat: 'En Preparation',
                        Date: Datee,
                        Heure: 'Dejeuner',
                        CleClient: that.state.CleClient,
                        CleChef: that.state.CleChef,
                        NumeroClient_Date: that.state.NumeroClient + '_' + Datee,
                        NumeroLivreur_Date: that.state.NumeroLivreur + '_' + Datee,
                        NumeroChef_Date: NumeroChef + '_' + Datee,
                    })
                } else {

                    var x = Math.floor(Math.random() * (this.state.LivreurDinner.length))
                    var NumeroLivreur = this.state.LivreurDinner[x].Numero
                    var NomLivreur = this.state.LivreurDinner[x].Nom
                    var IdLivreur = this.state.LivreurDinner[x].Id
                    //console.log(this.state.LivreurDinner[x].Numero, this.state.LivreurDinner.length, x)

                    var x = Math.floor(Math.random() * ((Object.values(this.state.ChefDinner[0])).length))
                    var NomChef = (Object.values(this.state.ChefDinner[0]))[x].Nom
                    var NumeroChef = (Object.values(this.state.ChefDinner[0]))[x].Numero
                    var Adresse1Chef = (Object.values(this.state.ChefDinner[0]))[x].Adresse1
                    var Adresse2Chef = (Object.values(this.state.ChefDinner[0]))[x].Adresse2
                    var IdChef = (Object.values(this.state.ChefDinner[0]))[x].Id
                    //console.log((Object.values(this.state.ChefDinner[0]))[x].Numero, (Object.values(this.state.ChefDinner[0])).length, x)
                    //console.log((Object.values(this.state.ChefDinner[0]))[x].Adresse1, (Object.values(this.state.ChefDinner[0])).length, x)
                    await firebase.database().ref('Commandes/' + that.state.IdCommande + "/").set({
                        IdCommande: that.state.IdCommande,
                        IdClient: that.state.IdClient,
                        IdLivreur: IdLivreur,
                        IdChef: IdChef,
                        NomClient: that.state.NomClient,
                        NomLivreur: NomLivreur,
                        NomChef: NomChef,
                        NumeroClient: that.state.NumeroClient,
                        NumeroLivreur: NumeroLivreur,
                        NumeroChef: NumeroChef,
                        Adresse1Chef: Adresse1Chef,
                        Adresse2Chef: Adresse2Chef,
                        Adresse1Client: that.state.Adresse1Client,
                        Adresse2Client: that.state.Adresse2Client,
                        Plat: that.state.Plat,
                        Prix: that.state.Total,
                        Qte: that.state.Qte,
                        Etat: 'En Preparation',
                        Date: Datee,
                        Heure: 'Dinner',
                        CleClient: that.state.CleClient,
                        CleChef: that.state.CleChef,
                        NumeroClient_Date: that.state.NumeroClient + '_' + Datee,
                        NumeroLivreur_Date: NumeroLivreur + '_' + Datee,
                        NumeroChef_Date: NumeroChef + '_' + Datee,

                    })
                }

                // this.setState({ LivreurDejeuner: [],LivreurDinner: [],ChefDejeuner: [],ChefDinner: []})

                ToastAndroid.showWithGravity(
                    'Commande Avec Succes Voir Abonnements !',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );


                this.props.navigation.navigate('ClientTab')
            }
        }

    }

    Dejeuner = async () => {
        this.setState({ Heure: '0' })
        if (new Date().getDate() < this.state.chosenDate.getDate() || new Date().getHours() < 12) {
            this.setState({ Dejeuner: true, Dinner: false })

            if (BoolDejeuner == false) {
                var that = this
                await firebase.database().ref('Livreur/Dejeuner').on('child_added', function (snapshot) {
                    var NewData = [...that.state.LivreurDejeuner]
                    NewData.push(snapshot.val())
                    that.setState({ LivreurDejeuner: NewData })
                })
                await firebase.database().ref('Plats/' + this.props.navigation.getParam('Ind') + '/Dejeuner').once('value', function (snapshot) {//A refaire

                    var NewData = [...that.state.ChefDejeuner]
                    NewData.push(snapshot.val())
                    that.setState({ ChefDejeuner: NewData })
                })


            }
            //  BoolDejeuner = true
        } else {
            ToastAndroid.show("Désolé 12h00 Max les commandes de déjeuner d'aujourd'hui :(", ToastAndroid.SHORT);
        }
    }

    Dinner = async () => {
        this.setState({ Heure: '0' })
        if (new Date().getDate() < this.state.chosenDate.getDate() || new Date().getHours() < 18) {
            this.setState({ Dinner: true, Dejeuner: false })

            if (BoolDinner == false) {
                var that = this
                await firebase.database().ref('Livreur/Dinner').on('child_added', function (snapshot) {
                    var NewData = [...that.state.LivreurDinner]
                    NewData.push(snapshot.val())
                    that.setState({ LivreurDinner: NewData })
                })
                await firebase.database().ref('Plats/' + this.props.navigation.getParam('Ind') + '/Dinner')
                    .once('value', function (snapshot) {
                        var NewData = [...that.state.ChefDinner]
                        NewData.push(snapshot.val())
                        that.setState({ ChefDinner: NewData })
                    })

            }
            //  BoolDinner = true
        } else {
            ToastAndroid.show("Désolé 18h00 Max les commandes de diner d'aujourd'hui :(", ToastAndroid.SHORT);

        }
    }

    render() {
        const Animating = this.state.Animating
        return (

            <Container>
                {this.state.Animating == true ?
                    <View style={styles.container1}>
                        <ActivityIndicator
                            animating={Animating}
                            color='black'
                            size="large"
                            style={styles.activityIndicator} />
                    </View> :


                    <Container>
                        <Header style={{ paddingTop: 20, backgroundColor: 'white' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Commande</Text>
                        </Header>
                        <Content>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Plat: {this.state.Plat} {"\n"}</Text>
                            </View>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Prix: {this.state.Total} DT{"\n"}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Button rounded onPress={() => this.state.Qte > 1 ? this.setState({ 'Qte': (this.state.Qte - 1), 'Total': ((this.state.Qte - 1) * this.state.Prix) }) : console.log("Min 0")}><Text style={{ fontWeight: 'bold', color: 'white' }}>  Diminuer  </Text></Button>
                                <Text style={{ fontWeight: 'bold' }}>Quantité: {this.state.Qte} </Text>
                                <Button rounded onPress={() => this.state.Qte < 3 ? this.setState({ 'Qte': (this.state.Qte + 1), 'Total': ((this.state.Qte + 1) * this.state.Prix) }) : console.log("Max 3")}><Text style={{ fontWeight: 'bold', color: 'white' }}>  Ajouter  </Text></Button>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <DatePicker
                                    defaultDate={new Date()}
                                    minimumDate={new Date()}
                                    maximumDate={new Date(new Date().getFullYear().toString(), (new Date().getMonth()).toString(), (new Date().getDate() + 2).toString())}
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"spinner"}
                                    placeHolderText="Choisir Aujourd'hui,Demain ou le Jour aprés!"
                                    textStyle={{ color: "green" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={this.setDate}
                                    disabled={false}
                                />
                                <Text style={{ fontWeight: 'bold' }}>
                                    Date: {this.state.chosenDate.toString().substr(4, 12)}
                                </Text>
                            </View>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Pour le? </Text>
                            <ListItem >
                                <Left>
                                    <Text>Dejeuner</Text>
                                </Left>
                                <Right>
                                    <Radio
                                        onPress={() => this.Dejeuner()}
                                        color={"black"}
                                        selectedColor={"black"}
                                        selected={this.state.Dejeuner}
                                    />
                                </Right>
                            </ListItem>
                            <ListItem>
                                <Left>
                                    <Text>Diner</Text>
                                </Left>
                                <Right>
                                    <Radio
                                        onPress={() => this.Dinner()}
                                        color={"black"}
                                        selectedColor={"black"}
                                        selected={this.state.Dinner}
                                    />
                                </Right>
                            </ListItem>


                            {this.state.Dejeuner == true ?

                                <Picker
                                    selectedValue={this.state.Heure}
                                    style={{ height: 50, width: 200 }}
                                    onValueChange={(itemValue) =>
                                        this.setState({ Heure: itemValue })
                                    }>
                                    <Picker.Item label="Choisissez l'heure" />
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

                            {this.state.Dinner == true ?
                                <Picker
                                    selectedValue={this.state.Heure}
                                    style={{ height: 50, width: 200 }}
                                    onValueChange={(itemValue) =>
                                        this.setState({ Heure: itemValue })
                                    }>
                                    <Picker.Item label="Choisissez l'heure" />
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

                            <Button full onPress={() => this.Confirmer()}><Text style={{ fontWeight: 'bold', color: 'white' }} >Confirmer</Text></Button>

                        </Content>

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
    }
});