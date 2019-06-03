import React, { Component } from "react";
import {
    View,
    Text, Image,
    StyleSheet, BackHandler, Dimensions, Alert
} from "react-native";
import { Container, Right, Label, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Form } from 'native-base';
import * as firebase from 'firebase'
class TypeOfUser extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            wait: true
        }
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }

    signOut() {
        Alert.alert(
            'Retourner',
            "Voulez-vous vraiment deconnecter?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log(),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: async () => await firebase.auth().signOut().then(
                        this.props.navigation.goBack(null)
                    )
                },
            ],
            { cancelable: false },
        );

    }

    async addUser(type) {
        this.props.navigation.navigate("Add" + type)
    }

    render() {
        return (
            <Container  >
                <Header style={{height:styles.ex.height/8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.signOut()}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>

                    </Left>
                    <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Bienvenue à JOET</Text>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>Regoignez nous comme</Text>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>

                <Content >
                    <Card style={{marginTop:15,  width: styles.ex.width - (styles.ex.width / 15), alignSelf: 'center' }}>
                        <CardItem style={{ backgroundColor: '#fafafa', alignItems: 'center' }}>
                            <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Client</Text>
                            </Body>
                        </CardItem>
                        <CardItem style={{ backgroundColor: '#fafafa', alignItems: 'center' }} button onPress={() => this.addUser('Client')}>
                            <Body>
                                <Text>
                                    Commander nos plats{"\n"}
                                </Text>
                            </Body>
                            <Right>
                                <Thumbnail large square source={require('../../assets/Client.jpg')} />
                            </Right>
                        </CardItem>
                    </Card>

                    <Card style={{ width: styles.ex.width - (styles.ex.width / 15), alignSelf: 'center' }}>
                        <CardItem style={{ backgroundColor: '#fafafa' }}>
                            <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Livreur</Text>
                            </Body>
                        </CardItem>
                        <CardItem style={{ backgroundColor: '#fafafa' }} button onPress={() => this.addUser('Livreur')}>
                            <Body>
                                <Text>
                                    Livrer nos plats
                                </Text>
                            </Body>
                            <Right>
                                <Thumbnail large square source={require('../../assets/Livreur.png')} />
                            </Right>
                        </CardItem>
                    </Card>

                    <Card style={{ width: styles.ex.width - (styles.ex.width / 15), alignSelf: 'center' }}>
                        <CardItem style={{ backgroundColor: '#fafafa' }}>
                            <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Chef</Text>
                            </Body>
                        </CardItem>
                        <CardItem style={{ backgroundColor: '#fafafa' }} button onPress={() => this.addUser('Chef')}>
                            <Body>
                                <Text>
                                    Preparez nos plats{'\n'}
                                </Text>
                            </Body>
                            <Right>
                                <Thumbnail large square source={require('../../assets/Chef.jpeg')} />
                            </Right>
                        </CardItem>
                    </Card>

                </Content>
            </Container>
        );
    }
}
export default TypeOfUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fcfbfa',
        justifyContent: 'center'
    },
    ex: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

});

