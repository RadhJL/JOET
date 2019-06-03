import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    Alert, ToastAndroid, Dimensions, KeyboardAvoidingView, Platform
} from "react-native";
import { Container, Header, Title, Button, Left, Right, Body, Icon, Label, Input, Content, Form, Picker, ListItem, CheckBox, Card, CardItem, Item } from 'native-base';
import * as firebase from 'firebase'
import ActivityIndicator from '../../ActivityIndicator'



class Modification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Numero: '',
            Adresse1: '',
            Adresse2: '',
            AncienNumero: '',

            DisplayResidence: false,
            DisplayTravail: false,

            VilleResidence: "",
            RueResidence: "",
            PlaqueResidence: "",
            DetailsResidence: "",

            RueTravail: "",
            VilleTravail: "",
            PlaqueTravail: "",
            DetailsTravail: "",

            Platform: '',
            Square1: false,
            Line1: false,
            Line2: false,
            Line3: false,
            Line4: false,
            Line5: false,
            Line6: false,
            Line7: false,
            wait: true
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

            that.setState({ AncienNumero: snap.val().Numero })
            that.setState({ Numero: snap.val().Numero })


            if (snap.val().AdresseResidence != null) {
                that.setState({ DisplayResidence: true })
                var array = snap.val().AdresseResidence.split(',')
                console.log(array)
                that.setState({ VilleResidence: array[2] })
                that.setState({ RueResidence: array[1] })
                that.setState({ PlaqueResidence: array[0] })
                that.setState({ DetailsResidence: array[3] })
            }
            if (snap.val().AdresseTravail != null) {
                that.setState({ DisplayTravail: true })
                var array = snap.val().AdresseTravail.split(',')
                that.setState({ VilleTravail: array[2] })
                that.setState({ RueTravail: array[1] })
                that.setState({ PlaqueTravail: array[0] })
                that.setState({ DetailsTravail: array[3] })
            }
        })

        this.setState({ wait: false })
    }


    async Confirmer() {

        var that = this
        let rootRef = firebase.database().ref()
        if (this.state.Numero.length < 8 || isNaN(this.state.Numero)) {
            this.setState({ Line1: true, flag: false })
        }
        else if (this.state.DisplayResidence == false && this.state.DisplayTravail == false) {
            this.setState({ Square1: true, flag: false })
        }
        else if (this.state.DisplayResidence == true && (this.state.VilleResidence == "")) {
            this.setState({ Line2: true, flag: false })
        }
        else if (this.state.DisplayResidence == true && (isNaN(this.state.PlaqueResidence) || this.state.PlaqueResidence.length > 3 || this.state.PlaqueResidence.length == 0)) {
            this.setState({ Line3: true, flag: false })
        }
        else if (this.state.DisplayResidence == true && (this.state.RueResidence.length < 5)) {
            this.setState({ Line4: true, flag: false })
        }
        else if (this.state.DisplayTravail == true && (this.state.VilleTravail == "")) {
            this.setState({ Line5: true, flag: false })
        }
        else if (this.state.DisplayTravail == true && (isNaN(this.state.PlaqueTravail) || this.state.PlaqueTravail.length > 3 || this.state.PlaqueTravail.length == 0)) {
            this.setState({ Line6: true, flag: false })
        }
        else if (this.state.DisplayTravail == true && (this.state.RueTravail.length < 5)) {
            this.setState({ Line7: true, flag: false })
        }

        else {
            try {
                this.setState({ wait: true })
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

                if (this.state.DisplayResidence == true) {
                    await firebase.database().ref('Client/' + that.state.uid).update({
                        AdresseResidence: that.state.PlaqueResidence + "," + that.state.RueResidence + "," + that.state.VilleResidence + "," + that.state.DetailsResidence,
                    })
                } else {
                    await firebase.database().ref('Client/' + that.state.uid + "/AdresseResidence").remove()
                    this.setState({ PlaqueResidence: "" })
                    this.setState({ RueResidence: "" })
                    this.setState({ DetailsResidence: "" })
                }

                if (this.state.DisplayTravail == true) {
                    await firebase.database().ref('Client/' + that.state.uid).update({
                        AdresseTravail: that.state.PlaqueTravail + "," + that.state.RueTravail + "," + that.state.VilleTravail + "," + that.state.DetailsTravail,
                    })
                } else {
                    await firebase.database().ref('Client/' + that.state.uid + "/AdresseTravail").remove()
                    this.setState({ PlaqueTravail: "" })
                    this.setState({ RueTravail: "" })
                    this.setState({ DetailsTravail: "" })
                }

                this.setState({ wait: false })
                this.props.navigation.goBack(null)
            } catch (error) {
                alert(error)

                console.log(error)

            }

        }
    }

    onValueChange(value) {
        this.setState({
            VilleResidence: value
        });
    }

    onValueChange1(value) {
        this.setState({
            VilleTravail: value
        });
    }

    render() {
        return (
            <Container  >
                {this.state.wait == true ?
                    <ActivityIndicator /> :
                    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding" enabled>
                        <Container>
                            <Header style={{ height: styles.dim.height / 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                                <Left style={{ flex: 2 }}>
                                    <Button transparent onPress={() => this.handleBackButtonClick()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>

                                </Left>
                                <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center', paddingLeft: 33 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Profile</Text>
                                </Body>
                                <Right style={{ flex: 4 }}>
                                    <Button transparent onPress={() => this.Confirmer()}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                                    </Button>
                                </Right>
                            </Header>
                            <Content >
                                <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 20), width: styles.dim.width - (styles.dim.width / 10) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Numero de téléphone</Text>
                                    <Item>
                                        <Input style={{ fontSize: 14 }} maxLength={8} keyboardType='number-pad' placeholder="ajouter numero de telephone..." value={this.state.Numero} onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false }, this.setState({ FirstLine: false }))}></Input>
                                    </Item>
                                    {this.state.Line1 == true ?
                                        <View>
                                            <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                            <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                                        </View>
                                        : console.log()}

                                    <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 20 }}>Lieu de livraison</Text>
                                    {/* aaaaaaaaaaaaaaaaaaa */}
                                    <View style={{ borderWidth: this.state.Square1 == true ? 3 : 0, borderColor: this.state.Square1 == true ? '#5e0231' : 'white', }}>
                                        <Card>
                                            <CardItem
                                                style={{ backgroundColor: this.state.DisplayResidence == true ? '#FF2E2A' : 'white' }}
                                                button onPress={() => this.state.DisplayResidence == true ?
                                                    this.setState({ DisplayResidence: false, Square1: false, VilleResidence: "", PlaqueResidence: "", RueResidence: '', DetailsResidence: '', Line2: false, Line3: false, Line4: false }) : this.setState({ DisplayResidence: true, Square1: false })}>
                                                <Text style={{ fontSize: 14, color: this.state.DisplayResidence == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}> Lieu de residence</Text>
                                            </CardItem>
                                        </Card>
                                        {this.state.DisplayResidence == true ?

                                            <View>
                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Ville</Text>
                                                <Item style={{ marginTop: -10 }}>
                                                    <Picker
                                                        mode="dropdown"
                                                        iosIcon={<Icon name="arrow-down" />}
                                                        headerStyle={{ backgroundColor: "#FF2E2A" }}
                                                        headerBackButtonTextStyle={{ color: "#fff" }}
                                                        headerTitleStyle={{ color: "#fff" }}
                                                        selectedValue={this.state.VilleResidence}
                                                        onValueChange={this.onValueChange.bind(this)}
                                                    >
                                                        <Picker.Item label="Choisir Ville" value="" />
                                                        <Picker.Item label="Ariana Centre" value="Ariana" />
                                                        <Picker.Item label="Centre Urbain Nord" value="Centre Urbain Nord" />
                                                        <Picker.Item label="Charguia 2" value="Charguia2" />
                                                        <Picker.Item label="Menzeh" value="Menzeh" />
                                                        <Picker.Item label="Ennaser" value="Ennaser" />
                                                    </Picker>
                                                </Item>
                                                {this.state.Line2 == true ?
                                                    <View>
                                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>ajouter ville</Text>
                                                    </View>
                                                    : console.log()}

                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Numero de plaque</Text>
                                                <Item style={{ marginTop: -10 }}>
                                                    <Input style={{ fontSize: 14 }} keyboardType='number-pad' maxLength={3} placeholder={"Ajouter numero de plaque"} value={this.state.PlaqueResidence} onChangeText={(PlaqueResidence) => this.setState({ PlaqueResidence: PlaqueResidence, Line3: false })}></Input>
                                                </Item>
                                                {this.state.Line3 == true ?
                                                    <View>
                                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                                    </View>
                                                    : console.log()}
                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Rue</Text>

                                                <Item style={{ marginTop: -10 }}>
                                                    <Input style={{ fontSize: 14 }} placeholder={"Ajouter rue "} value={this.state.RueResidence} onChangeText={(RueResidence) => this.setState({ RueResidence: RueResidence, Line4: false })}></Input>
                                                </Item>
                                                {this.state.Line4 == true ?
                                                    <View>
                                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez le nom de rue</Text>
                                                    </View>
                                                    : console.log()}
                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Details</Text>

                                                <Item style={{ marginTop: -9 }}>
                                                    <Input style={{ fontSize: 14 }} placeholder={"Ajouter plus de details"} value={this.state.DetailsResidence} onChangeText={(DetailsResidence) => this.setState({ DetailsResidence: DetailsResidence })}></Input>
                                                </Item>
                                            </View> : console.log()
                                        }

                                        <Card>
                                            <CardItem style={{ backgroundColor: this.state.DisplayTravail == true ? '#FF2E2A' : 'white' }} button onPress={() => this.state.DisplayTravail == true ?

                                                this.setState({ DisplayTravail: false, Square1: false, VilleTravail: "", PlaqueTravail: "", RueTravail: '', DetailsTravail: '', Line5: false, Line6: false, Line7: false }) : this.setState({ DisplayTravail: true, Square1: false })}>
                                                <Text style={{ fontSize: 14, color: this.state.DisplayTravail == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>  Lieu de travail, etablissement scolaire..</Text>
                                            </CardItem>
                                        </Card>

                                        {this.state.DisplayTravail == true ?


                                            <View>
                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Ville</Text>
                                                <Item style={{ marginTop: -10 }}>
                                                    <Picker
                                                        mode="dropdown"
                                                        iosIcon={<Icon name="arrow-down" />}
                                                        headerStyle={{ backgroundColor: "#FF2E2A" }}
                                                        headerBackButtonTextStyle={{ color: "#fff" }}
                                                        headerTitleStyle={{ color: "#fff" }}
                                                        selectedValue={this.state.VilleTravail}
                                                        onValueChange={this.onValueChange1.bind(this)}

                                                    >
                                                        <Picker.Item label="Choisir Ville" value="" />
                                                        <Picker.Item label="Ariana Centre" value="Ariana" />
                                                        <Picker.Item label="Centre Urbain Nord" value="Centre Urbain Nord" />
                                                        <Picker.Item label="Charguia 2" value="Charguia2" />
                                                        <Picker.Item label="Menzeh" value="Menzeh" />
                                                        <Picker.Item label="Ennaser" value="Ennaser" />
                                                    </Picker>
                                                </Item>
                                                {this.state.Line5 == true ?
                                                    <View>
                                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Ajouter ville</Text>
                                                    </View>
                                                    : console.log()}

                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Numero de plaque</Text>
                                                <Item style={{ marginTop: -10 }}>
                                                    <Input style={{ fontSize: 14 }} keyboardType='number-pad' maxLength={3} placeholder={"Ajouter numero de plaque"} value={this.state.PlaqueTravail} onChangeText={(PlaqueTravail) => this.setState({ PlaqueTravail: PlaqueTravail, Line6: false })}></Input>
                                                </Item>
                                                {this.state.Line6 == true ?
                                                    <View>
                                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                                    </View>
                                                    : console.log()}

                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Rue</Text>
                                                <Item style={{ marginTop: -10 }}>
                                                    <Input style={{ fontSize: 14 }} placeholder={"Ajouter nom de rue.."} value={this.state.RueTravail} onChangeText={(RueTravail) => this.setState({ RueTravail: RueTravail, Line7: false })}></Input>
                                                </Item>
                                                {this.state.Line7 == true ?
                                                    <View>
                                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez nom de rue</Text>
                                                    </View>
                                                    : console.log()}

                                                <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 20, paddingTop: 10 }}>Details</Text>
                                                <Item style={{ marginTop: -9 }}>
                                                    <Input style={{ fontSize: 14 }} placeholder={"Ajouter plus de details"} value={this.state.DetailsTravail} onChangeText={(DetailsTravail) => this.setState({ DetailsTravail })}></Input>
                                                </Item>
                                            </View> : console.log()
                                        }
                                        {this.state.Square1 == true ?
                                            <View>
                                                <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                                <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Vous devez au moins avoir un lieu de livraison</Text>
                                            </View>
                                            : console.log()}

                                    </View>

                                </Form>

                            </Content>

                        </Container>
                    </KeyboardAvoidingView>

                }

            </Container>
        );
    }
}
export default Modification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

});



