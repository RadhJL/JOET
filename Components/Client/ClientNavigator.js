import { createAppContainer, createBottomTabNavigator } from 'react-navigation'
import Plats from './Plats/TousLesPlats'
import Abonnements from './Abonnements/Abonnements'
import Profile from './Profile/Profile'


const Client = createBottomTabNavigator({
  Plats: { screen: Plats },
  Abonnements: { screen: Abonnements },
  Profile: { screen: Profile },
}, {
  initialRouteName:'Plats',
    tabBarOptions: {
      activeTintColor: 'black',
      labelStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      style: {
        backgroundColor: 'white',
      },
    }

  })

export default ClientTab = createAppContainer(Client);