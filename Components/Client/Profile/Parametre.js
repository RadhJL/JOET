import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, Dimensions, Alert, BackHandler
} from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Form, Input, Label, Thumbnail, CardItem, Card } from 'native-base';
import * as firebase from 'firebase'
import ActivityIndicator from '../../ActivityIndicator'

class Parametre extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wait: true,
            Id: ''
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({ Id: await firebase.auth().currentUser.uid })
        this.setState({ wait: false })
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        this.props.navigation.goBack(null)
        return true
    }

    async SignOut() {
        try {
            var that = this
            await firebase.auth().signOut().then(
                that.props.navigation.navigate('Login')
            )
        } catch (error) {
            alert(error)
        }
    }

    async DeleteAccount() {
        var flag = false
        try {
            await firebase.database().ref('Commandes/').orderByChild('IdClient').equalTo(this.state.Id)
                .once('value', function (snap) {
                    console.log(snap.val())
                    if (snap.val() != null) {
                        flag = true
                        alert("Vous avez commandes en cours")
                    }
                })
            if (flag == false) {
                var that = this
                that.setState({ wait: true })
                await firebase.auth().currentUser.delete().then(async function () {
                    await firebase.database().ref("Client/" + that.state.Id + "/").remove();
                    await firebase.database().ref("Users/" + that.state.Id + "/").remove();
                    await that.setState({ wait: false })
                    that.props.navigation.navigate('Login')
                }).catch(function (error) {
                    alert("Vous devez reconnecter pour supprimer")
                    console.log(error)
                });
            }

        }
        catch (error) {
            if (flag == false) {
                var that = this
                that.setState({ wait: true })

                await firebase.auth().currentUser.delete().then(async function () {
                    await firebase.database().ref("Client/" + that.state.Id + "/").remove();
                    await firebase.database().ref("Users/" + that.state.Id + "/").remove();
                    await that.setState({ wait: false })
                    that.props.navigation.navigate('Login')
                }).catch(function (error) {
                    alert("Vous devez reconnecter pour supprimer")
                    console.log(error)
                });
            }
        }
    }

    render() {
        return (
            <Container>
                {this.state.wait == true ?
                    <ActivityIndicator /> :
                    <Container style={{ backgroundColor: '#FF2E2A' }}>
                        <Header style={{ height: styles.dim.height / 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                            <Left style={{ flex: 1 }}>
                                <Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button>

                            </Left>
                            <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Parametre</Text>
                            </Body>
                            <Right style={{ flex: 1 }}></Right>
                        </Header>
                        <Content >
                            <View style={{ height: styles.dim.height, justifyContent: 'space-around' }}>

                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'white', }}>JOET?</Text>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', paddingTop: 10 }}>Mangez, comme chez vous!</Text>
                                </View>

                                <View>
                                    <Card style={{}}>
                                        <Button full style={{ backgroundColor: 'white' }} onPress={() => Alert.alert(
                                            'Déconnecter',
                                            'Voulez-vous vraiment se déconnecter?',
                                            [
                                                {
                                                    text: 'Cancel',
                                                    onPress: () => console.log(),
                                                    style: 'cancel',
                                                },
                                                { text: 'OK', onPress: () => this.SignOut() },
                                            ],
                                            { cancelable: false },
                                        )}><Label style={{ fontWeight: 'bold', color: '#FF2E2A' }}>Déconnecter</Label></Button>
                                    </Card>

                                    <Card style={{}}>
                                        <Button full style={{ backgroundColor: '#fafafa' }} onPress={() => Alert.alert(
                                            'Déconnecter',
                                            'Voulez-vous vraiment supprimer votre compte?',
                                            [
                                                {
                                                    text: 'Cancel',
                                                    onPress: () => console.log(),
                                                    style: 'cancel',
                                                },
                                                { text: 'OK', onPress: () => this.DeleteAccount() },
                                            ],
                                            { cancelable: false },
                                        )}><Label style={{ fontWeight: 'bold', color: '#FF2E2A' }}>Supprimer compte</Label></Button>
                                    </Card>
                                </View>
                            </View>
                        </Content>
                    </Container>
                }
            </Container>

        );
    }
}
export default Parametre;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

});