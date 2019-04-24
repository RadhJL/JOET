import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Container, Header, Tab, Tabs, ScrollableTab, Button, TabHeading } from 'native-base';
import AbonnementsNavigator from './AbonnementsTab/AbonnementsNavigator'
import HistoriqueNavigator from './HistoriqueTab/HistoriqueNavigator'
class Abonnements extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Container>

                {/* <Header hasTabs /> */}
                <Tabs style={{ paddingTop: 24 }} renderTabBar={() => <ScrollableTab/>}>
                    <Tab heading="Abonnements">
                        <AbonnementsNavigator  />
                    </Tab>
                    <Tab heading="Historique">
                        <HistoriqueNavigator />
                    </Tab>
                </Tabs>

            </Container>
        );
    }
}
export default Abonnements;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});