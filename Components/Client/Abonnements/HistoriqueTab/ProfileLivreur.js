import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Container, Content, Label, Header, Button, List, ListItem, Thumbnail, Left, Body, Right, Icon, CardItem, Card } from 'native-base'
import StarRating from 'react-native-star-rating';
import { AntDesign } from '@expo/vector-icons'
import * as firebase from 'firebase'
import ActivityIndicator from '../../../ActivityIndicator'
class ProfileLivreur extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            Profile: {},
            starCount: 0,
            oldCount: 0,
            IdLivreur: '',
            Score: 0,
            Nombre: 0,
            Sommee: 0,
            Nombree: 0,
            Nouveau: false,
            wait: false,
            Animating: true

        }
    }

    async   componentDidMount() {
        var that = this
        await firebase.database().ref('Livreur/' + this.props.navigation.getParam('IdLivreur')).once('value', async function (snap) {
            await that.setState({ Profile: snap.val() })
        })

        await this.setState({
            IdLivreur: this.props.navigation.getParam('IdLivreur'),
            uid: await firebase.auth().currentUser.uid
        })


        firebase.database().ref("Client/" + this.state.uid + "/Rate/" +
            this.state.IdLivreur).once('value', function (snap) {
                if (snap.val() != null) {
                    that.setState({ starCount: snap.val().Score, oldCount: snap.val().Score })
                } else {
                    that.setState({ Nouveau: true })
                }
            })

        firebase.database().ref("Livreur/" + this.state.IdLivreur + "/Rate/").once('value', function (snap) {
            that.setState({ Score: snap.val().Score, Nombre: snap.val().Nombre })
        })
        this.setState({ Animating: false })
    }

    async firebaseNombre() {
        var x = await firebase.database().ref("Livreur/" + this.state.IdLivreur + "/Rate/Nombre/").once('value', function (snap) {
            return snap.val()
        })
        await this.setState({ Nombree: JSON.stringify(x) })
    }

    async firebaseSomme() {
        var x = await firebase.database().ref("Livreur/" + this.state.IdLivreur + "/Rate/Somme/").once('value', function (snap) {
            return snap.val()
        })
        await this.setState({ Sommee: JSON.stringify(x) })
    }


    async onStarRatingPress(rating) {

        var that = this
        that.setState({
            starCount: rating
        });
        await that.firebaseSomme();
        await that.firebaseNombre();

        var Somme = parseInt(that.state.Sommee, 10);
        var Nombre = parseInt(that.state.Nombree, 10)

        if (that.state.Nouveau == true) {
            await firebase.database().ref("Client/" + that.state.uid + "/Rate/" + that.state.IdLivreur + "/").set({
                Score: rating
            })
            await firebase.database().ref("Livreur/" + this.state.IdLivreur + "/Rate/").update({
                Nombre: Nombre + 1,
                Somme: Somme + rating,
                Score: ((Somme + rating) / (Nombre + 1)),
            })
            that.setState({ Nouveau: false, oldCount: rating, Nombre: Nombre + 1, Somme: Somme + rating, Score: ((Somme + rating) / (Nombre + 1)) })
        } else {
            await firebase.database().ref("Client/" + that.state.uid + "/Rate/" + that.state.IdLivreur + "/").update({
                Score: rating
            })

            await firebase.database().ref("Livreur/" + that.state.IdLivreur + "/Rate/").update({
                Somme: Somme + (rating - that.state.oldCount),
                Score: (Somme + rating - that.state.oldCount) / Nombre,
            })
            that.setState({ Somme: Somme + (rating - that.state.oldCount), Score: (Somme + rating - that.state.oldCount) / Nombre })
            that.setState({ oldCount: rating })
        }
    }

    async onStarRatingPress1(rating) {
        if (this.state.wait == false) {
            await this.setState({ wait: true })
            await this.onStarRatingPress(rating)
            await this.setState({ wait: false })
        }
    }

    render() {
        return (
            <Container>
                {this.state.Animating == true ?
                    <ActivityIndicator /> :
                    <Container>
                        <Header transparent style={{ height: 50, backgroundColor: 'white' }}>
                            <Left><Button transparent onPress={() => this.props.navigation.goBack(null)}><Icon style={{ color: 'red' }} name="arrow-back"></Icon></Button></Left>
                            <Body></Body>
                            <Right></Right>
                        </Header>
                        <Content>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Thumbnail large rounded source={{ uri: this.state.Profile.PhotoUrl }}></Thumbnail>
                                <Text style={{ fontWeight: 'bold', fontSize: 25, paddingTop: 10 }}>{this.state.Profile.Nom}</Text>

                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.Score + " "}</Text>
                                    <Text style={{ paddingTop: 3 }}><AntDesign style={{ fontSize: 20, color: 'red' }} name="star"></AntDesign></Text>
                                    <Text style={{ color: 'gray', paddingTop: 4, fontWeight: 'bold' }}>{"  " + this.state.Nombre + " "}avis</Text>
                                </View>

                                <Text style={{ paddingTop: 10 }}>{this.state.Profile.Commandes} livraison(s) faite</Text>
                            </View>

                            <Card style={{ padding: 10,paddingTop:-10, marginTop: 15 }}>
                                <Text style={{ paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}>Se déplace avec</Text>
                                <View style={{ paddingTop: 5 }}>
                                    <Text>{this.state.Profile.Deplacement} </Text>
                                </View>
                                <View style={{ paddingTop: 20 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Travaille</Text>
                                    {this.state.Profile.Shift === "DejeunerEtDinner" ? <Text style={{ paddingTop: 5 }}>Le Dejeuner et Le Diner</Text> : <Text style={{ paddingTop: 5 }}>Le {this.state.Profile.Shift}</Text>}
                                </View>
                            </Card>
                            <CardItem style={{ alignSelf: 'center', width: 200 }}>
                                <View style={{ alignSelf: 'center', width: 50 }}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={'ios-star-outline'}
                                        fullStar={'ios-star'}
                                        halfStar={'ios-star-half'}
                                        iconSet={'Ionicons'}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress1(rating)}
                                        fullStarColor={'red'}
                                    />
                                </View>
                            </CardItem>

                        </Content>
                    </Container>
                }
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