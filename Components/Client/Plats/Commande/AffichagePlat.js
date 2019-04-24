import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { BackHandler } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
var Plat = [require('../../../../assets/Kosksi.jpg'), require('../../../../assets/Makrouna1.jpg'), require('../../../../assets/Rouz.jpg')]

class AffichePlat extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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
                <Content>
                    <Card >
                        <CardItem cardBody style={{ paddingTop: 20 }}>
                            <Image source={Plat[this.props.navigation.getParam('Ind') - 1]} style={{ height: 202, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem cardBody style={{ paddingTop: 20,flexDirection:'column',justifyContent:'center',alignItems:'center' }}>
                            <Text style={{ fontWeight: 'bold',fontSize:20 }} > {this.props.navigation.getParam('Nom')} </Text>
                            <Text style={{ fontWeight: 'bold',fontSize:15 }} > {this.props.navigation.getParam('Prix')} DT </Text>
                        </CardItem>
                        <CardItem cardBody style={{ paddingTop: 20,flexDirection:'column' }}>
                            <Text style={{ fontWeight: 'bold' }} >Ingredients:</Text>
                            <Text>   {this.props.navigation.getParam('Ingredients')} {"\n"}In laboris qui quis nostrud culpa officia fugiat pariatur Lorem eiusmod labore consectetur deserunt occaecat.</Text>
                        </CardItem>
                        <CardItem cardBody style={{ paddingTop: 20,flexDirection:'column' }}>
                            <Text style={{ fontWeight: 'bold' }}>Description : </Text>
                            <Text> {this.props.navigation.getParam('Description')} {"\n"} Minim et laborum culpa nisi veniam est. Laboris sint qui eiusmod Lorem pariatur consequat adipisicing mollit ut. Ea culpa nostrud in pariatur est. Ad velit nulla enim pariatur labore consequat ullamco commodo magna laboris voluptate mollit fugiat incididunt.</Text>
                        </CardItem>
                    </Card>
                    <Button full onPress={() => this.props.navigation.navigate('Commander', { Ind: this.props.navigation.getParam('Ind') })}><Text style={{fontWeight:'bold',color:'white'}}>Commander</Text></Button>
                </Content>
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
    }
});