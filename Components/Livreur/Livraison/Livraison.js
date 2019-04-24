import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { BackHandler } from 'react-native';
import { Container, Header, Tab, Tabs, ScrollableTab } from 'native-base';
import LivraisonTab from './LivraisonsTab/LivraisonNavigator'
import HistoriqueTab from './HistoriqueTab/HistoriqueNavigator'
class Livraison extends Component {
    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }
    async componentDidMount() {
        var that = this
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }
    
    render() {
        return (
            <Container>
                <Tabs 
                style={{paddingTop:24}}
                 renderTabBar={() => <ScrollableTab  />}>
                    <Tab heading="Livraison">
                        <LivraisonTab />
                    </Tab>
                    <Tab heading="Historique">
                        <HistoriqueTab />
                    </Tab>

                </Tabs>
            </Container>
        );
    }
}
export default Livraison;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});