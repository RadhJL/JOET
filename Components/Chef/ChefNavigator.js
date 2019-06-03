
import { createAppContainer, createBottomTabNavigator } from 'react-navigation'
import Preparation from './Preparation/Preparation'
import Profile from './Profile/Profile'

const Chef = createBottomTabNavigator({
  Preparation: { screen: Preparation },
  Profile: { screen: Profile },
}, {
    tabBarOptions: {
      activeTintColor: '#FF2E2A',
      labelStyle: {
        fontSize: 15,
        fontWeight: 'bold'
      },
      style: {
        backgroundColor: '#fafafa',
      },
    }

  })

export default ChefTab = createAppContainer(Chef);