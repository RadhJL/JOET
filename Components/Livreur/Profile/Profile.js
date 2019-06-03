import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, ToastAndroid, Alert, Dimensions
} from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Form, Input, Label, Thumbnail } from 'native-base';
import * as firebase from 'firebase'
import { MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import ActivityIndicator from '../../ActivityIndicator'
class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Id: '',
            Nom: '',
            PhotoUrl: null,
            Commandes: 0,
            wait: true,
            Score: 0,
            Nombre: 0
        }
    }

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="person" style={{ color: tintColor, fontSize: 30 }} />
        )
    }

    async componentDidMount() {
        var that = this
        await firebase.auth().onAuthStateChanged((user) => {
            if (user == null) {
                console.log('Null user')
            } else {
                that.setState({ Nom: user.displayName })
                that.setState({ PhotoUrl: user.photoURL })
                that.setState({ Id: user.uid })
                firebase.database().ref('Livreur/' + user.uid + "/Commandes").once('value', function (s) {
                    //console.log(s.val())
                    that.setState({ Commandes: s.val() })
                })
            }
        })
        await firebase.database().ref('Livreur/' + firebase.auth().currentUser.uid + "/Rate/").once('value', function (s) {
            that.setState({ Score: s.val().Score })
            that.setState({ Nombre: s.val().Nombre })

        })
        this.setState({ wait: false })
    }

    render() {
        return (
            <Container  >
                {this.state.wait == true ?
                    <ActivityIndicator /> :
                    <Content>
                        <Header transparent></Header>
                        <View style={{ paddingTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Thumbnail large source={{ uri: this.state.PhotoUrl }}></Thumbnail>
                            <Text style={{ fontWeight: 'bold', fontSize: 25 }}> {this.state.Nom}</Text>

                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.Score + " "}</Text>
                                <Text style={{ paddingTop: 1 }}><AntDesign style={{ fontSize: 20, color: '#FF2E2A' }} name="star"></AntDesign></Text>
                                <Text style={{ color: 'gray', paddingTop: 4, fontWeight: 'bold' }}>{"  " + this.state.Nombre + " "}avis</Text>
                            </View>
                            <Text style={{ paddingTop: 10 }}>{this.state.Commandes} Livraison(s)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 60 }}>
                            <View>
                                <Button transparent style={{ flex: 1, height: 60, paddingBottom: 10 }}
                                    full onPress={() => this.props.navigation.navigate('ParametreLivreur')}
                                >
                                    <Text style={{ color: '#FF2E2A' }}><Feather style={{ fontSize: 40, }} name="settings"></Feather></Text>
                                </Button>
                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Parametre</Text>
                            </View>
                            <View>
                                <Button transparent style={{ flex: 1, height: 60 }}
                                    full onPress={() => this.props.navigation.navigate('ModificationLivreur')}
                                >
                                    <Text style={{ color: '#FF2E2A' }}><AntDesign style={{ fontSize: 40, }} name="edit"></AntDesign></Text>
                                </Button>
                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Edit Profile</Text>
                            </View>
                        </View>
                        <View style={{ alignSelf: 'center', paddingTop: 100 }}>
                            <Text style={{ color: 'gray' }}>JOET (version 1.0) </Text>
                        </View>
                    </Content>
                }
            </Container>
        );
    }
}
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dim: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

});