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

export default ClientTab = createAppContainer(Client);