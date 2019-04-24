import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right } from 'native-base'

class ProfileLivreur extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Profile: {}
        }
    }
    async   componentDidMount() {
        console.log(this.props.navigation.getParam('Profile'))
        this.setState({ Profile: this.props.navigation.getParam('Profile') })
    }

    render() {
        return (
            <Container>
                <Content>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Thumbnail large rounded source={{ uri:this.state.Profile.PhotoUrl}}></Thumbnail>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{this.state.Profile.Nom}</Text>
                    </View>
                    <View style={{ paddingTop: 30 }}>
                        <Text>Numero: {this.state.Profile.Numero}</Text>
                        <Text>{this.state.Profile.Commandes} Commande(s) livré</Text>
                    </View>
                    <Text style={{ paddingTop: 30, fontWeight: 'bold', fontSize: 15 }}>Se déplace avec</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>{this.state.Profile.Deplacement} </Text>
                    </View>
                    <View style={{ paddingTop: 30 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Travaille</Text>
                        {this.state.Profile.Shift === "DejeunerEtDinner" ? <Text>Le Dejeuner et Le Diner</Text> : <Text>Le {this.state.Profile.Shift}</Text>}


                    </View>

                    <View>
                        <Button full onPress={() => this.props.navigation.goBack(null)}><Text style={{fontWeight:'bold',color:'white'}}>Return</Text></Button>
                    </View>
                </Content>
            </Container>

        );
    }
}
export default ProfileLivreur;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});