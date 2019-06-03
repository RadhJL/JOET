import React, { Component } from "react";
import { View, StyleSheet, Image, Text, Dimensions, Platform } from "react-native";
import { BackHandler } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right, Footer, FooterTab } from 'native-base';
import { FontAwesome } from '@expo/vector-icons'
var Plat = [require('../../../../assets/Kosksi.jpg'), require('../../../../assets/Makrouna1.jpg'), require('../../../../assets/Rouz.jpg')]
import ActivityIndicator from '../../../ActivityIndicator'
class AffichePlat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Plat: [],
            wait: false,
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        await BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        await this.setState({ Plat: this.props.navigation.getParam('Plat') })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }


    render() {
        return (
            <Container>
                {this.state.wait == true ?
                    <ActivityIndicator /> :
                    <Container>
                        <Header style={{ paddingTop: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2E2A' }}>
                            <Left style={{ flex: 1 }}>
                                <Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: 'white' }} name="arrow-back"></Icon></Button></Left>
                            <Body style={{ alignSelf: 'center', flex: 8, alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>{this.state.Plat.Nom}</Text>
                            </Body>
                            <Right style={{ flex: 1 }}></Right>
                        </Header>
                        <Content >
                            <Card style={{ alignSelf: 'center', width: styles.dim.width - styles.dim.width / 16 }}>
                                <CardItem cardBody style={{ paddingTop: 22 }}>
                                    <Image source={Plat[this.state.Plat.Ind - 1]} style={{ height: 202, width: null, flex: 1 }} />
                                </CardItem>

                                <CardItem cardBody style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'green' }} > {this.state.Plat.Prix} DT </Text>
                                    <Text style={{marginTop:1.9}}><FontAwesome name="money" style={{ fontSize: 20, color: 'green',marginTop:10 }}></FontAwesome></Text>
                                </CardItem>

                                <Text style={{ paddingTop: 10, fontWeight: 'bold' }} > Ingredients</Text>
                                <CardItem cardBody style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10 }}>

                                    <Text>   {} {"\n"}  In laboris qui quis nostrud culpa officia fugiat pariatur Lorem eiusmod labore consectetur deserunt occaecat.</Text>
                                </CardItem>

                                <Text style={{ paddingTop: 10, fontWeight: 'bold' }}> Description </Text>
                                <CardItem cardBody style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
                                    <Text> {} {"\n"}  Minim et laborum culpa nisi veniam est. Laboris sint qui eiusmod Lorem pariatur consequat adipisicing mollit ut. Ea culpa nostrud in pariatur est. Ad velit nulla enim pariatur labore consequat ullamco commodo magna laboris voluptate mollit fugiat incididunt.</Text>
                                </CardItem>
                            </Card>
                        </Content>
                        <Footer style={{ backgroundColor: 'white' }}>
                            <Card style={{ alignSelf: 'center', width: styles.dim.width - styles.dim.width / 50 }}>
                                <Button style={{ backgroundColor: "white" }} full onPress={() => this.props.navigation.navigate('Commander', { Ind: this.state.Plat.Ind })}><Text style={{ fontWeight: 'bold', color: '#FF2E2A', alignSelf: 'center', fontSize: 18 }}>Commander</Text></Button>
                            </Card>
                        </Footer>
                    </Container>
                }
            </Container>

        );
    }
}
export default AffichePlat;

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