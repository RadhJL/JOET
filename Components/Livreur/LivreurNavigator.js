
import {createAppContainer,createBottomTabNavigator} from 'react-navigation'
import Livraison from './Livraison/Livraison'
import Profile from './Profile/Profile'

const Livreur=createBottomTabNavigator({
    Livraison:{screen:Livraison},
    Profile:{screen:Profile},
},{
    tabBarOptions: {
        activeTintColor: '#FF2E2A',
        labelStyle: {
          fontSize: 15,
          fontWeight:'bold'
        },
        style: {
          backgroundColor: '#fafafa',
        },
      }

})

export default LivreurTab=createAppContainer(Livreur);