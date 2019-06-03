import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,BackHandler
} from "react-native";
import { Container, Header, Tab, Tabs, ScrollableTab, Button, TabHeading, Content, Icon } from 'native-base';
import AbonnementsNavigator from './AbonnementsTab/AbonnementsNavigator'
import HistoriqueNavigator from './HistoriqueTab/HistoriqueNavigator'
import { Feather } from '@expo/vector-icons';
class Abonnements extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Feather name="inbox" style={{ color: tintColor, fontSize: 30 }} />
        )
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

                {/* <Header style={{ backgroundColor: '#3fb0ac' }} hasTabs/> */}
                {/* <Text style={{ fontWeight: 'bold',color:'#FF2E2A' }}>Abonnements</Text> */}
                <Tabs

                    style={{ paddingTop: 20, backgroundColor: '#FF2E2A' }} renderTabBar={() => <ScrollableTab style={{ backgroundColor: '#FF2E2A' }} />}>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#FF2E2A' }}><Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>En Cours</Text></TabHeading>}  >
                        <AbonnementsNavigator />
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#FF2E2A' }}><Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Historique</Text></TabHeading>}  >
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