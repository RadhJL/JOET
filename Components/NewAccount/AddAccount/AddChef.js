import React, { Component } from "react";
import {
    View,
    BackHandler,
    StyleSheet,
    Alert, ToastAndroid, Dimensions, Platform, KeyboardAvoidingView
} from "react-native";
import { Container, Header, Title, Button, CheckBox, Left, Right, Text, Body, Icon, Label, Input, Content, Form, ListItem, Radio, Picker, Card, CardItem, Item } from 'native-base';
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
            Rouz: 'false',

            VilleTravail: "",
            PlaqueTravail: "",
            RueTravail: "",
            DetailsTravail: "",
            Platform: '',
            Line1: false,
            Line2: false,
            Line3: false,
            Line4: false,
            Line5: false,
            Square1: false,
            Square2: false,


        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);


    }

    async componentDidMount() {
        await this.setState({ Platform: Platform.OS })
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

        // Numero: '',
        // radio2: '',
        // Kosksi: 'false',
        // Makrouna: 'false',
        // Rouz: 'false',
        // VilleTravail: "",
        // PlaqueTravail: "",
        // RueTravail: "",
        // DetailsTravail: "",


        if (this.state.Numero.length < 8) {
            this.setState({ Line1: true })
        } else if (this.state.VilleTravail == "") {
            this.setState({ Line2: true })
        } else if (this.state.PlaqueTravail == "") {
            this.setState({ Line3: true })
        } else if (this.state.RueTravail.length < 5) {
            this.setState({ Line4: true })
        }
        else if (this.state.radio2 == "") {
            this.setState({ Square1: true })
        }
        else if (this.state.Kosksi == "false" && this.state.Makrouna == "false" && this.state.Rouz == "false") {
            this.setState({ Square2: true })
        }
        else {
            var Adresse = that.state.PlaqueTravail + " " + that.state.RueTravail + " " + that.state.VilleTravail + "," + that.state.DetailsTravail

            try {
                await firebase.database().ref('Users/' + await firebase.auth().currentUser.uid).set({
                    Type: "Chef"
                })

                await firebase.database().ref('Chef/' + that.state.uid).set({
                    Nom: that.state.Nom,
                    Email: that.state.Email,
                    Numero: that.state.Numero,
                    Adresse: Adresse,
                    Shift: that.state.radio2,
                    Kosksi: that.state.Kosksi,
                    Makrouna: that.state.Makrouna,
                    Rouz: that.state.Rouz,
                    Commandes: 0,
                    PhotoUrl: that.state.PhotoUrl
                })
                await firebase.database().ref("Chef/" + that.state.uid + "/Rate/").set({
                    Nombre: 0,
                    Somme: 0,
                    Score: 0,
                })

                if (this.state.Kosksi === 'true') {
                    if (this.state.radio2 === 'Dejeuner' || this.state.radio2 === 'DejeunerEtDinner') {
                        await firebase.database().ref('Plats/1/Dejeuner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse: Adresse,
                            Id: that.state.uid
                        })
                    }
                    if (this.state.radio2 === 'Dinner' || this.state.radio2 === 'DejeunerEtDinner') {

                        await firebase.database().ref('Plats/1/Dinner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse: Adresse,
                            Id: that.state.uid
                        })
                    }
                }
                if (this.state.Makrouna === 'true') {
                    if (this.state.radio2 === 'Dejeuner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/2/Dejeuner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse: Adresse,
                            Id: that.state.uid
                        })
                    if (this.state.radio2 === 'Dinner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/2/Dinner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse: Adresse,
                            Id: that.state.uid
                        })
                }
                if (this.state.Rouz === 'true') {
                    if (this.state.radio2 === 'Dejeuner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/3/Dejeuner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse: Adresse,
                            Id: that.state.uid
                        })
                    if (this.state.radio2 === 'Dinner' || this.state.radio2 === 'DejeunerEtDinner')
                        await firebase.database().ref('Plats/3/Dinner/' + that.state.uid).set({
                            Nom: that.state.Nom,
                            Numero: that.state.Numero,
                            Adresse: Adresse,
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

    onValueChange(value) {
        this.setState({
            VilleTravail: value,
            Line2: false
        });
    }


    render() {
        return (
            <Container style={{}} >

                <Header style={{ height: styles.dim.height / 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.handleBackButtonClick()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>

                    </Left>
                    <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Chef</Text>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>


                {this.state.Platform == 'android' ? <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding" enabled>

                    <Content >
                        <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 15), width: styles.dim.width - (styles.dim.width / 10) }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }} >Numero de telephone</Text>
                            <Item>
                                <Input style={{ fontSize: 14 }} maxLength={8} keyboardType='numeric' placeholder='Ajouter numero de telephone..' onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false })}></Input>
                            </Item>
                            {this.state.Line1 == true ?
                                <View>
                                    <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                    <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                                </View>
                                : console.log()}
                            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Adresse</Text>
                            <Item>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    headerStyle={{ backgroundColor: "#FF2E2A" }}
                                    headerBackButtonTextStyle={{ color: "#fff" }}
                                    headerTitleStyle={{ color: "#fff" }}
                                    selectedValue={this.state.VilleTravail}
                                    onValueChange={this.onValueChange.bind(this)}
                                >
                                    <Picker.Item label="Choisir ville" value="" />
                                    <Picker.Item label="Ariana Centre" value="Ariana" />
                                    <Picker.Item label="Centre Urbain Nord" value="CentreUrbainNord" />
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
                                <Input style={{ fontSize: 14 }} keyboardType='numeric' maxLength={2} placeholder='Ajouter numero de plaque..' onChangeText={(PlaqueTravail) => this.setState({ PlaqueTravail: PlaqueTravail, Line3: false })}></Input>
                            </Item>
                            {this.state.Line3 == true ?
                                <View>
                                    <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                    <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                </View>
                                : console.log()}
                            <Item>
                                <Input style={{ fontSize: 14 }} placeholder='Ajouter le rue..' onChangeText={(RueTravail) => this.setState({ RueTravail: RueTravail, Line4: false })}></Input>
                            </Item>
                            {this.state.Line4 == true ?
                                <View>
                                    <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                    <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez le nom de rue</Text>
                                </View>
                                : console.log()}
                            <Item>
                                <Input style={{ fontSize: 14 }} placeholder="Plus de details.." onChangeText={(DetailsTravail) => this.setState({ DetailsTravail })}></Input>
                            </Item>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Vous travaillez le</Text>

                            <View style={{ borderWidth: this.state.Square1 == true ? 2.5 : 0, borderColor: this.state.Square1 == true ? '#5e0231' : 'white', }}>
                                <Card>
                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dejeuner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dejeuner', Square1: false })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dejeuner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner</Text>
                                    </CardItem>
                                </Card>

                                <Card >
                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dinner', Square1: false })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Diner</Text>
                                    </CardItem>
                                </Card>

                                <Card>

                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'DejeunerEtDinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'DejeunerEtDinner', Square1: false })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'DejeunerEtDinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner et Diner</Text>
                                    </CardItem>

                                </Card>
                                {this.state.Square1 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 2.5, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Vous devez choisir l'horaire de travail</Text>
                                    </View>
                                    : console.log()}
                            </View>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Vous pouvez preparer</Text>

                            <View style={{ borderWidth: this.state.Square2 == true ? 2.5 : 0, borderColor: this.state.Square2 == true ? '#5e0231' : 'white', }}>

                                <Card transparent>

                                    <CardItem button onPress={() => this.state.Kosksi == 'true' ? this.setState({ Kosksi: 'false' }) : this.setState({ Kosksi: 'true', Square2: false })}>
                                        <View style={{ paddingRight: 20 }}>
                                            <CheckBox style={{ backgroundColor: this.state.Kosksi == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Kosksi === 'true'} />
                                        </View>
                                        <View style={{ paddingLeft: 20 }}>
                                            <Text >Kosksi</Text>
                                        </View>
                                    </CardItem>
                                </Card>
                                <Card transparent>

                                    <CardItem button onPress={() => this.state.Makrouna == 'true' ? this.setState({ Makrouna: 'false' }) : this.setState({ Makrouna: 'true', Square2: false })}>
                                        <View style={{ paddingRight: 20 }}>
                                            <CheckBox style={{ backgroundColor: this.state.Makrouna == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Makrouna === 'true'} />
                                        </View>
                                        <View style={{ paddingLeft: 20 }}>
                                            <Text >Makrouna</Text>
                                        </View>
                                    </CardItem>
                                </Card>
                                <Card transparent >

                                    <CardItem button onPress={() => this.state.Rouz == 'true' ? this.setState({ Rouz: 'false' }) : this.setState({ Rouz: 'true', Square2: false })}>
                                        <View style={{ paddingRight: 20 }}>
                                            <CheckBox style={{ backgroundColor: this.state.Rouz == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Rouz === 'true'} />
                                        </View>
                                        <View style={{ paddingLeft: 20 }}>
                                            <Text >Rouz</Text>
                                        </View>
                                    </CardItem>
                                </Card>
                                {this.state.Square2 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Choisissez au moins un plat a preparer</Text>
                                    </View>
                                    : console.log()}
                            </View>

                            <Card style={{ marginTop: 20 }}>
                                <Button full style={{ backgroundColor: 'white' }} onPress={() => this.AddChef()}><Label style={{ fontWeight: 'bold', color: '#FF2E2A' }}>Continuer</Label></Button>
                            </Card>
                        </Form>
                    </Content>

                </KeyboardAvoidingView>
                    :
                    <Content >
                        <Form style={{ alignSelf: 'center', paddingTop: (styles.dim.height / 15), width: styles.dim.width - (styles.dim.width / 10) }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }} >Numero de telephone</Text>
                            <Item>
                                <Input style={{ fontSize: 14 }} maxLength={8} keyboardType='numeric' placeholder='Ajouter numero de telephone..' onChangeText={(Numero) => this.setState({ Numero: Numero, Line1: false })}></Input>
                            </Item>
                            {this.state.Line1 == true ?
                                <View>
                                    <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                    <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de telephone</Text>
                                </View>
                                : console.log()}
                            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Adresse</Text>
                            <Item>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    headerStyle={{ backgroundColor: "#FF2E2A" }}
                                    headerBackButtonTextStyle={{ color: "#fff" }}
                                    headerTitleStyle={{ color: "#fff" }}
                                    selectedValue={this.state.VilleTravail}
                                    placeholder="choisir ville"
                                    onValueChange={this.onValueChange.bind(this)}
                                >

                                    <Picker.Item label="Ariana Centre" value="Ariana" />
                                    <Picker.Item label="Centre Urbain Nord" value="CentreUrbainNord" />
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
                                <Input style={{ fontSize: 14 }} keyboardType='numeric' maxLength={2} placeholder='Ajouter numero de plaque..' onChangeText={(PlaqueTravail) => this.setState({ PlaqueTravail: PlaqueTravail, Line3: false })}></Input>
                            </Item>
                            {this.state.Line3 == true ?
                                <View>
                                    <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                    <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez numero de plaque</Text>
                                </View>
                                : console.log()}
                            <Item>
                                <Input style={{ fontSize: 14 }} placeholder='Ajouter le rue..' onChangeText={(RueTravail) => this.setState({ RueTravail: RueTravail, Line4: false })}></Input>
                            </Item>
                            {this.state.Line4 == true ?
                                <View>
                                    <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                    <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Verifiez le nom de rue</Text>
                                </View>
                                : console.log()}
                            <Item>
                                <Input style={{ fontSize: 14 }} placeholder="Plus de details.." onChangeText={(DetailsTravail) => this.setState({ DetailsTravail })}></Input>
                            </Item>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Vous travaillez le</Text>

                            <View style={{ borderWidth: this.state.Square1 == true ? 2.5 : 0, borderColor: this.state.Square1 == true ? '#5e0231' : 'white', }}>
                                <Card>
                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dejeuner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dejeuner', Square1: false })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dejeuner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner</Text>
                                    </CardItem>
                                </Card>

                                <Card >
                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'Dinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'Dinner', Square1: false })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'Dinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Diner</Text>
                                    </CardItem>
                                </Card>

                                <Card>

                                    <CardItem button style={{ backgroundColor: this.state.radio2 == 'DejeunerEtDinner' ? '#FF2E2A' : 'white' }} onPress={() => this.setState({ radio2: 'DejeunerEtDinner', Square1: false })}>
                                        <Text style={{ fontSize: 14, color: this.state.radio2 == 'DejeunerEtDinner' ? 'white' : '#FF2E2A', fontWeight: 'bold' }}>Dejeuner et Diner</Text>
                                    </CardItem>

                                </Card>
                                {this.state.Square1 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 2.5, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Vous devez choisir l'horaire de travail</Text>
                                    </View>
                                    : console.log()}
                            </View>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingTop: 15 }}>Vous pouvez preparer</Text>

                            <View style={{ borderWidth: this.state.Square2 == true ? 2.5 : 0, borderColor: this.state.Square2 == true ? '#5e0231' : 'white', }}>

                                <Card transparent>

                                    <CardItem button onPress={() => this.state.Kosksi == 'true' ? this.setState({ Kosksi: 'false' }) : this.setState({ Kosksi: 'true', Square2: false })}>
                                        <View style={{ paddingRight: 20 }}>
                                            <CheckBox style={{ backgroundColor: this.state.Kosksi == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Kosksi === 'true'} />
                                        </View>
                                        <View style={{ paddingLeft: 20 }}>
                                            <Text >Kosksi</Text>
                                        </View>
                                    </CardItem>
                                </Card>
                                <Card transparent>

                                    <CardItem button onPress={() => this.state.Makrouna == 'true' ? this.setState({ Makrouna: 'false' }) : this.setState({ Makrouna: 'true', Square2: false })}>
                                        <View style={{ paddingRight: 20 }}>
                                            <CheckBox style={{ backgroundColor: this.state.Makrouna == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Makrouna === 'true'} />
                                        </View>
                                        <View style={{ paddingLeft: 20 }}>
                                            <Text >Makrouna</Text>
                                        </View>
                                    </CardItem>
                                </Card>
                                <Card transparent >

                                    <CardItem button onPress={() => this.state.Rouz == 'true' ? this.setState({ Rouz: 'false' }) : this.setState({ Rouz: 'true', Square2: false })}>
                                        <View style={{ paddingRight: 20 }}>
                                            <CheckBox style={{ backgroundColor: this.state.Rouz == 'true' ? '#FF2E2A' : 'white', borderColor: '#FF2E2A' }} checked={this.state.Rouz === 'true'} />
                                        </View>
                                        <View style={{ paddingLeft: 20 }}>
                                            <Text >Rouz</Text>
                                        </View>
                                    </CardItem>
                                </Card>
                                {this.state.Square2 == true ?
                                    <View>
                                        <View style={{ borderBottomColor: '#5e0231', borderBottomWidth: 3, }} />
                                        <Text style={{ fontSize: 12, color: '#5e0231', fontStyle: 'italic' }}>Choisissez au moins un plat a preparer</Text>
                                    </View>
                                    : console.log()}
                            </View>

                            <Card style={{ marginTop: 20 }}>
                                <Button full style={{ backgroundColor: 'white' }} onPress={() => this.AddChef()}><Label style={{ fontWeight: 'bold', color: '#FF2E2A' }}>Continuer</Label></Button>
                            </Card>
                        </Form>
                    </Content>

                }

            </Container>
        );
    }
}
export default AddChef;

const styles = StyleSheet.create({
    container: {

        backgroundColor: 'red'
    },
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

});