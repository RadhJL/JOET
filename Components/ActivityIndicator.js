import React, { Component } from 'react'
import {
    ActivityIndicator,
    AppRegistry,
    StyleSheet,
    View,
} from 'react-native'

export default class App extends Component {
    render() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#FF2E2A" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})

AppRegistry.registerComponent('App', () => App)
