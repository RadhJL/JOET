import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
} from "react-native";
import { Container, Header, Tab, Tabs, ScrollableTab, TabHeading } from 'native-base';
import PreparationTab from './PreparationTab/PreparationNavigator'
import HistoriqueTab from './HistoriqueTab/HistoriqueNavigator'
import { Feather } from '@expo/vector-icons';

class Preparation extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Feather name="inbox" style={{ color: tintColor, fontSize: 30 }} />
        )
    }

    componentDidMount() {
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
                    style={{ paddingTop: 20, backgroundColor: '#FF2E2A' }} renderTabBar={() => <ScrollableTab style={{ backgroundColor: '#FF2E2A' }} />}>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#FF2E2A' }}><Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>En Cours</Text></TabHeading>}  >
                        <PreparationTab />
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#FF2E2A' }}><Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Historique</Text></TabHeading>}  >
                        <HistoriqueTab />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
export default Preparation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});