
import {createAppContainer,createBottomTabNavigator} from 'react-navigation'
import Preparation from './Preparation/Preparation'
import Profile from './Profile/Profile'

const Chef=createBottomTabNavigator({
    Preparation:{screen:Preparation},
    Profile:{screen:Profile},
},{
    tabBarOptions: {
        activeTintColor: 'black',
        labelStyle: {
          fontSize: 18,
          fontWeight:'bold'
        },
        style: {
          backgroundColor: 'white',
        },
      }

})

export default ChefTab=createAppContainer(Chef);