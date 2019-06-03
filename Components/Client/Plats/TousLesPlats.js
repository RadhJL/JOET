import React, { Component } from "react";
import { View, StyleSheet, Image, Text, Dimensions, Platform } from "react-native";
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import * as firebase from 'firebase'
import { Alert } from 'react-native';
import { BackHandler } from 'react-native';
import AcitivityIndicator from '../../ActivityIndicator'


var Plat = [require('../../../assets/Kosksi.jpg'), require('../../../assets/Makrouna1.jpg'), require('../../../assets/Rouz.jpg')]

class Plats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            wait: true
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }


    static navigationOptions = {

        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-home" style={{ color: tintColor }} />
        )
    }


    async componentDidMount() {
        var that = this
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        var date = new Date()
        console.log(date.getFullYear().toString() + "-" + date.getMonth().toString() + "-" + date.getDate().toString()
            + "-" + date.getHours().toString() + "-" + date.getMinutes().toString())

        await firebase.auth().onAuthStateChanged((user) => {
            this.setState({ list: [] })
            firebase.database().ref('Plats/').on('child_added', function (snapshot) {
                var newData = [...that.state.list]
                newData.push(snapshot)
                that.setState({ list: newData })
            })


        })
        this.setState({ wait: false })

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }

    async AfficherPlat(data) {
        // this.setState({ wait: true })
         this.props.navigation.navigate('AffichePlat', { Plat: data.val() })
        this.setState({ wait: false })

    }

    renderPlat() {
        return (
            <View>
                {this.state.list.map((data, ind) => {
                    return (
                        <Card key={ind} >
                            <CardItem button onPress={() => this.AfficherPlat(data)}>
                                <Left><Image source={Plat[ind]} style={{ height: 100, width: 200, flex: 1 }} />
                                </Left>
                                <Body style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{data.val().Nom}</Text>
                                    <Text style={{ fontSize: 15, paddingTop: 5, }}>{data.val().Prix} DT/Personne</Text>

                                </Body>
                            </CardItem>

                        </Card>
                    )
                })}
            </View>
        )
    }

    render() {
        return (
            <Container>
                {this.state.wait == true ?
                    <AcitivityIndicator /> :
                    <Container>
                        <Header style={{ paddingTop: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}><Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>Nos Plats</Text></Header>
                        <Content>
                            {this.renderPlat()}
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Livraison a 2 DT</Text>
                                <Text style={{ color: 'gray', fontWeight: 'bold', paddingLeft: 10 }}>commander avec le meme date de livraison pour payer 2DT seulement</Text>
                            </View>
                        </Content>
                    </Container>
                }

            </Container>
        );
    }
}
export default Plats;

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