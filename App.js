import * as firebase from 'firebase'
import { YellowBox } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Acceuil from './Acceuil'
import Login from './Components/Login'
import TypeOfUser from './Components/NewAccount/TypeOfUser'
import AddClient from './Components/NewAccount/AddAccount/AddClient'
import AddLivreur from './Components/NewAccount/AddAccount/AddLivreur'
import AddChef from './Components/NewAccount/AddAccount/AddChef'
import ClientTab from './Components/Client/ClientNavigator'
import ModificationClient from './Components/Client/Profile/Modification'
import TousLesPlats from './Components/Client/Plats/TousLesPlats'
import AffichePlat from './Components/Client/Plats/Commande/AffichagePlat'
import Commander from './Components/Client/Plats/Commande/Commande'
import LivreurTab from './Components/Livreur/LivreurNavigator'
import ModificationLivreur from './Components/Livreur/Profile/Modification'
import ChefTab from './Components/Chef/ChefNavigator'
import ModificationChef from './Components/Chef/Profile/Modification'
import Timer from './Timer'
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
}

  var config = {
    apiKey: "AIzaSyD4IfSiKhoAjTY2xyCh8o1Ap4e11aDNNPQ",
    authDomain: "joet-for-ayaandyass.firebaseapp.com",
    databaseURL: "https://joet-for-ayaandyass.firebaseio.com",
    projectId: "joet-for-ayaandyass",
    storageBucket: "joet-for-ayaandyass.appspot.com",
    messagingSenderId: "593845611021"
  };
  firebase.initializeApp(config);

const app = createStackNavigator({
  Acceuil:Acceuil,
  Login: Login,
  TypeOfUser: TypeOfUser,
  AddClient: AddClient,
  AddLivreur: AddLivreur,
  AddChef: AddChef,

  ClientTab: ClientTab,
  ModificationClient:ModificationClient,
  TousLesPlats:TousLesPlats,
  
  AffichePlat: AffichePlat,
  Commander: Commander,
  
  LivreurTab: LivreurTab,
  ModificationLivreur:ModificationLivreur,
  ChefTab: ChefTab,
  ModificationChef:ModificationChef

}, {
    headerMode: 'none'
  }
)
export default App = createAppContainer(app)
