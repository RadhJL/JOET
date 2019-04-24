import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
} from "react-native";
import { Container, Header, Tab, Tabs, ScrollableTab } from 'native-base';
import PreparationTab from './PreparationTab/PreparationNavigator'
import HistoriqueTab from './HistoriqueTab/HistoriqueNavigator'
class Preparation extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

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
                <Tabs style={{ paddingTop: 24 }} renderTabBar={() => <ScrollableTab />}>
                    <Tab heading="Preparation">
                        <PreparationTab />
                    </Tab>
                    <Tab heading="Historique">
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