
import {createAppContainer,createBottomTabNavigator} from 'react-navigation'
import Livraison from './Livraison/Livraison'
import Profile from './Profile/Profile'

const Livreur=createBottomTabNavigator({
    Livraison:{screen:Livraison},
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

export default LivreurTab=createAppContainer(Livreur);