import React, { Component } from "react";
import {
    View,
    Text, Image,
    StyleSheet, BackHandler
} from "react-native";
import { Container, Right, Label, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';

class TypeOfUser extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

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


    async addUser(type) {
        this.props.navigation.navigate("Add" + type)
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#feffff' }} >
                {/* <Header style ={{backgroundColor:'white'}}/> */}
                <Content  >
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 25 }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Bienvenue à JOET</Text>
                    </View>
                    <Text style={{ fontSize: 20, paddingTop: 20, fontWeight: 'bold' }}>Vous êtes?</Text>
                    <Card >
                        <CardItem>
                            <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Client</Text>
                            </Body>
                        </CardItem>
                        <CardItem button onPress={() => this.addUser('Client')}>
                            <Body>
                                {/* <Image source={require('../../assets/Client.jpg')} style={{ height: 100, width: 300, flex: 1 }} /> */}
                                <Text>
                                    Commander nos plats{"\n"}
                                    Visualiser les commandes{"\n"}
                                </Text>

                            </Body>
                            <Right>
                                <Thumbnail large square source={require('../../assets/Client.jpg')} />
                            </Right>
                        </CardItem>
                    </Card>

                    <Card >
                        <CardItem>
                            <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Livreur</Text>
                            </Body>
                        </CardItem>
                        <CardItem button onPress={() => this.addUser('Livreur')}>
                            <Body>
                                {/* <Image source={require('../../assets/Livreur.png')} style={{ height: 300, width: 350, flex: 1 }} /> */}
                                <Text>
                                    Horaire de travail flexible{"\n"}
                                    Visualiser les commandes {"\n"}

                                </Text>
                            </Body>
                            <Right>
                                <Thumbnail large square source={require('../../assets/Livreur.png')} />
                            </Right>
                        </CardItem>
                    </Card>

                    <Card >
                        <CardItem>
                            <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Chef</Text>
                            </Body>
                        </CardItem>
                        <CardItem button onPress={() => this.addUser('Chef')}>
                            <Body>
                                {/* <Image source={require('../../assets/Chef.jpeg')} style={{ height: 100, width: 400, flex: 1 }} /> */}
                                <Text>
                                    Horaire de travail flexible{'\n'}
                                    Choisissez ce que vous préparez{'\n'}
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

    }
});

