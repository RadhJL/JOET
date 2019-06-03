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
            DisplayResidence: false,
            DisplayTravail: false,
            VilleResidence: "",
            VilleTravail: "",
            NumeroResidence: "",
            AdresseResidence: "",
            DetailsResidence: "",
            NumeroTravail: "",
            AdresseTravail: "",
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
            flag: true,
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }


    async componentDidMount() {
        await this.setState({ Platform: Platform.OS })
        console.log(this.state.Platform)
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
        if (this.state.Numero.length < 8 || isNaN(this.state.Numero)) {
            this.setState({ Line1: true, flag: false })
        }
        else if (this.state.DisplayResidence == false && this.state.DisplayTravail == false) {
            this.setState({ Square1: true, flag: false })
        }
        else if (this.state.DisplayResidence == true && (this.state.VilleResidence == "")) {
            this.setState({ Line2: true, flag: false })
        }
        else if (this.state.DisplayResidence == true && (isNaN(this.state.NumeroResidence) || this.state.NumeroResidence.length > 3 || this.state.NumeroResidence.length == 0)) {
            this.setState({ Line3: true, flag: false })
        }
        else if (this.state.DisplayResidence == true && (this.state.AdresseResidence.length < 5)) {
            this.setState({ Line4: true, flag: false })
        }

        else if (this.state.DisplayTravail == true && (this.state.VilleTravail == "")) {
            this.setState({ Line5: true, flag: false })
        }
        else if (this.state.DisplayTravail == true && (isNaN(this.state.NumeroTravail) || this.state.NumeroTravail.length > 3 || this.state.NumeroTravail.length == 0)) {
            this.setState({ Line6: true, flag: false })
        }
        else if (this.state.DisplayTravail == true && (this.state.AdresseTravail.length < 5)) {
            this.setState({ Line7: true, flag: false })
        } else {

            try {
                await firebase.database().ref('Users/' + await firebase.auth().currentUser.uid).set({
                    Type: "Client"
                })


                firebase.database().ref('Client/' + that.state.uid).set({
                    Nom: that.state.Nom,
                    Email: that.state.Email,
                    Numero: that.state.Numero,
                    Commandes: 0,
                    PhotoUrl: that.state.PhotoUrl
                })
                if (that.state.DisplayResidence == true) {
                    firebase.database().ref('Client/' + that.state.uid).update({
                        AdresseResidence: that.state.NumeroResidence + "," + that.state.AdresseResidence + "," + that.state.VilleResidence + "," + that.state.DetailsResidence,
                    })
                }
                if (that.state.DisplayTravail == true) {
                    firebase.database().ref('Client/' + that.state.uid).update({
                        AdresseTravail: that.state.NumeroTravail + "," + that.state.AdresseTravail + "," + that.state.VilleTravail + "," + that.state.DetailsTravail,
                    })
                }
                this.props.navigation.navigate('ClientTab')
            } catch (error) {
                console.log(error)
            }
        }

    }

    onValueChange(value) {
        this.setState({
            VilleResidence: value,
            Line2: false
        });
    }

    onValueChange1(value) {
        this.setState({
            VilleTravail: value,
            Line5: false
        });
    }

    renderIOS() {
        return (



            <Content >
                <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 10), width: styles.dim.width - (styles.dim.width / 10) }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Numero de téléphone</Text>
                    <Item>
                        <Input style={{ fontSize: 14 }} maxLength={8} keyboardType='number-pad' placeholder='Ajouter numero de telephone...' onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false }, this.setState({ FirstLine: false }))}></Input>
                    </Item>
                    {this.state.Line1 == true ?
                        <View>
                            <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                            <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                        </View>
                        : console.log()}

                    <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 20 }}>Lieu de livraison</Text>
                    {/* aaaaaaaaaaaaaaaaaaa */}
                    <View style={{ borderWidth: this.state.Square1 == true ? 5 : 0, borderColor: this.state.Square1 == true ? '#5e0231' : 'white', }}>
                        <Card>
                            <CardItem
                                style={{ backgroundColor: this.state.DisplayResidence == true ? '#FF2E2A' : 'white' }}
                                button onPress={() => this.state.DisplayResidence == true ?
                                    this.setState({ DisplayResidence: false, Square1: false, VilleResidence: "", NumeroResidence: "", AdresseResidence: '', DetailsResidence: '', Line2: false, Line3: false, Line4: false }) : this.setState({ DisplayResidence: true, Square1: false })}>
                                <Text style={{ fontSize: 14, color: this.state.DisplayResidence == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}> Lieu de residence</Text>
                            </CardItem>
                        </Card>
                        {this.state.DisplayResidence == true ?

                            <View>
                                <Item>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerStyle={{ backgroundColor: "#FF2E2A" }}
                                        headerBackButtonTextStyle={{ color: "#fff" }}
                                        headerTitleStyle={{ color: "#fff" }}
                                        selectedValue={this.state.VilleResidence}
                                        onValueChange={this.onValueChange.bind(this)}
                                        placeholder="Choisir Ville"
                                    >
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


                                <Item>
                                    <Input style={{ fontSize: 14 }} keyboardType='number-pad' maxLength={3} placeholder='Numero de plaque ' onChangeText={(NumeroResidence) => this.setState({ NumeroResidence: NumeroResidence, Line3: false })}></Input>
                                </Item>
                                {this.state.Line3 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                    </View>
                                    : console.log()}

                                <Item>
                                    <Input style={{ fontSize: 14 }} placeholder='Ajouter le rue..' onChangeText={(AdresseResidence) => this.setState({ AdresseResidence: AdresseResidence, Line4: false })}></Input>
                                </Item>
                                {this.state.Line4 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez le nom de rue</Text>
                                    </View>
                                    : console.log()}

                                <Item>
                                    <Input style={{ fontSize: 14 }} placeholder='Plus de details (prés de..)' onChangeText={(DetailsResidence) => this.setState({ DetailsResidence: DetailsResidence })}></Input>
                                </Item>
                            </View> : console.log()
                        }

                        <Card>
                            <CardItem style={{ backgroundColor: this.state.DisplayTravail == true ? '#FF2E2A' : 'white' }} button onPress={() => this.state.DisplayTravail == true ?

                                this.setState({ DisplayTravail: false, Square1: false, VilleTravail: "", NumeroTravail: "", AdresseTravail: '', DetailsTravail: '', Line5: false, Line6: false, Line7: false }) : this.setState({ DisplayTravail: true, Square1: false })}>
                                <Text style={{ fontSize: 14, color: this.state.DisplayTravail == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>  Lieu de travail, etablissement scolaire..</Text>
                            </CardItem>
                        </Card>

                        {this.state.DisplayTravail == true ?


                            <View>
                                <Item>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerStyle={{ backgroundColor: "#FF2E2A" }}
                                        headerBackButtonTextStyle={{ color: "#fff" }}
                                        headerTitleStyle={{ color: "#fff" }}
                                        selectedValue={this.state.VilleTravail}
                                        onValueChange={this.onValueChange1.bind(this)}
                                        placeholder="Choisir Ville"

                                    >
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

                                <Item>
                                    <Input style={{ fontSize: 14 }} keyboardType='number-pad' maxLength={3} placeholder='Numero de plaque' onChangeText={(NumeroTravail) => this.setState({ NumeroTravail: NumeroTravail, Line6: false })}></Input>
                                </Item>
                                {this.state.Line6 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                    </View>
                                    : console.log()}

                                <Item>
                                    <Input style={{ fontSize: 14 }} placeholder='Ajouter le rue..' onChangeText={(AdresseTravail) => this.setState({ AdresseTravail: AdresseTravail, Line7: false })}></Input>
                                </Item>
                                {this.state.Line7 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez nom de rue</Text>
                                    </View>
                                    : console.log()}

                                <Item>
                                    <Input style={{ fontSize: 14 }} placeholder="Plus de details (nom d'etablissement)" onChangeText={(DetailsTravail) => this.setState({ DetailsTravail })}></Input>
                                </Item>
                            </View> : console.log()
                        }
                    </View>
                    <Card style={{ marginTop: 20 }}>
                        <Button full style={{ backgroundColor: 'white' }} onPress={() => this.AddClient()}><Label style={{ fontWeight: 'bold', color: '#FF2E2A' }}>Continuer</Label></Button>
                    </Card>
                </Form>

            </Content>

        )


    }
    renderAndroid() {
        return (
            <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding" enabled>

                <Content >
                    <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 10), width: styles.dim.width - (styles.dim.width / 10) }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Numero de téléphone</Text>
                        <Item>
                            <Input style={{ fontSize: 14 }} maxLength={8} keyboardType='number-pad' placeholder='Ajouter numero de telephone...' onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false }, this.setState({ FirstLine: false }))}></Input>
                        </Item>
                        {this.state.Line1 == true ?
                            <View>
                                <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                            </View>
                            : console.log()}

                        <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 20 }}>Lieu de livraison</Text>
                        {/* aaaaaaaaaaaaaaaaaaa */}
                        <View style={{ borderWidth: this.state.Square1 == true ? 5 : 0, borderColor: this.state.Square1 == true ? '#5e0231' : 'white', }}>
                            <Card>
                                <CardItem
                                    style={{ backgroundColor: this.state.DisplayResidence == true ? '#FF2E2A' : 'white' }}
                                    button onPress={() => this.state.DisplayResidence == true ?
                                        this.setState({ DisplayResidence: false, Square1: false, VilleResidence: "", NumeroResidence: "", AdresseResidence: '', DetailsResidence: '', Line2: false, Line3: false, Line4: false }) : this.setState({ DisplayResidence: true, Square1: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.DisplayResidence == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}> Lieu de residence</Text>
                                </CardItem>
                            </Card>
                            {this.state.DisplayResidence == true ?

                                <View>
                                    <Item>
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


                                    <Item>
                                        <Input style={{ fontSize: 14 }} keyboardType='number-pad' maxLength={3} placeholder='Numero de plaque ' onChangeText={(NumeroResidence) => this.setState({ NumeroResidence: NumeroResidence, Line3: false })}></Input>
                                    </Item>
                                    {this.state.Line3 == true ?
                                        <View>
                                            <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                            <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                        </View>
                                        : console.log()}

                                    <Item>
                                        <Input style={{ fontSize: 14 }} placeholder='Ajouter le rue..' onChangeText={(AdresseResidence) => this.setState({ AdresseResidence: AdresseResidence, Line4: false })}></Input>
                                    </Item>
                                    {this.state.Line4 == true ?
                                        <View>
                                            <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                            <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez le nom de rue</Text>
                                        </View>
                                        : console.log()}

                                    <Item>
                                        <Input style={{ fontSize: 14 }} placeholder='Plus de details (prés de..)' onChangeText={(DetailsResidence) => this.setState({ DetailsResidence: DetailsResidence })}></Input>
                                    </Item>
                                </View> : console.log()
                            }

                            <Card>
                                <CardItem style={{ backgroundColor: this.state.DisplayTravail == true ? '#FF2E2A' : 'white' }} button onPress={() => this.state.DisplayTravail == true ?

                                    this.setState({ DisplayTravail: false, Square1: false, VilleTravail: "", NumeroTravail: "", AdresseTravail: '', DetailsTravail: '', Line5: false, Line6: false, Line7: false }) : this.setState({ DisplayTravail: true, Square1: false })}>
                                    <Text style={{ fontSize: 14, color: this.state.DisplayTravail == true ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>  Lieu de travail, etablissement scolaire..</Text>
                                </CardItem>
                            </Card>

                            {this.state.DisplayTravail == true ?


                                <View>
                                    <Item>
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

                                    <Item>
                                        <Input style={{ fontSize: 14 }} keyboardType='number-pad' maxLength={3} placeholder='Numero de plaque' onChangeText={(NumeroTravail) => this.setState({ NumeroTravail: NumeroTravail, Line6: false })}></Input>
                                    </Item>
                                    {this.state.Line6 == true ?
                                        <View>
                                            <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                            <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                        </View>
                                        : console.log()}

                                    <Item>
                                        <Input style={{ fontSize: 14 }} placeholder='Ajouter le rue..' onChangeText={(AdresseTravail) => this.setState({ AdresseTravail: AdresseTravail, Line7: false })}></Input>
                                    </Item>
                                    {this.state.Line7 == true ?
                                        <View>
                                            <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                            <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez nom de rue</Text>
                                        </View>
                                        : console.log()}

                                    <Item>
                                        <Input style={{ fontSize: 14 }} placeholder="Plus de details (nom d'etablissement)" onChangeText={(DetailsTravail) => this.setState({ DetailsTravail })}></Input>
                                    </Item>
                                </View> : console.log()
                            }
                        </View>
                        <Card style={{ marginTop: 20 }}>
                            <Button full style={{ backgroundColor: 'white' }} onPress={() => this.AddClient()}><Label style={{ fontWeight: 'bold', color: '#FF2E2A' }}>Continuer</Label></Button>
                        </Card>
                    </Form>

                </Content>
            </KeyboardAvoidingView>

        )

    }

    render() {
        return (
            <Container>
                <Header style={{ height: styles.dim.height / 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.handleBackButtonClick()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>
                    </Left>
                    <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Client</Text>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>

                {this.state.Platform == 'ios' ? this.renderIOS() : this.renderAndroid()}
            </Container>
        )
    }
}
export default AddClient;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
    ,
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});