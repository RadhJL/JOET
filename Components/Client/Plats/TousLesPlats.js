import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import * as firebase from 'firebase'
import { Alert } from 'react-native';
import { BackHandler } from 'react-native';


// import {
//     handleAndroidBackButton,
//     exitAlert
// } from '../../../Modules/androidBackButton';

//<Image  source={{uri:this.state.Image+"?type=large&redirect=true&width=600&height=600"}} style={{ height: 200, width: 200, flex: 1 }} />
var Plat = [require('../../../assets/Kosksi.jpg'), require('../../../assets/Makrouna1.jpg'), require('../../../assets/Rouz.jpg')]

class Plats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }



    async componentDidMount() {
        var that = this
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        await firebase.auth().onAuthStateChanged((user) => {
                this.setState({list:[]})
             firebase.database().ref('Plats/').on('child_added', function (snapshot) {
                var newData = [...that.state.list]
                newData.push(snapshot)
                that.setState({ list: newData })
            })


        })

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }

    renderPlat() {
        return (
            <View>
                {this.state.list.map((data, ind) => {
                    return (
                        <Card key={ind} >
                            <CardItem cardBody button onPress={() => this.props.navigation.navigate('AffichePlat', { Ind: data.val().Ind, Nom: data.val().Nom, Prix: data.val().Prix, Description: data.val().Description, Ingredients: data.val().Ingredients })}>
                                <Image source={Plat[ind]} style={{ height: 200, width: null, flex: 1 }} />
                            </CardItem>
                            <CardItem>
                                <Body style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{data.val().Nom}</Text>
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
                <Header style={{ backgroundColor: 'white', paddingTop: 25 }}><Text style={{ fontWeight: 'bold', fontSize: 25 }}>Nos Plats</Text></Header>
                <Content>

                    {this.renderPlat()}
                </Content>
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
    }
});