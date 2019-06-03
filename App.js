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
import ParametreClient from './Components/Client/Profile/Parametre'
import TousLesPlats from './Components/Client/Plats/TousLesPlats'
import AffichePlat from './Components/Client/Plats/Commande/AffichagePlat'
import Commander from './Components/Client/Plats/Commande/Commande'
import LivreurTab from './Components/Livreur/LivreurNavigator'
import ModificationLivreur from './Components/Livreur/Profile/Modification'
import ParametreLivreur from './Components/Livreur/Profile/Parametre'
import ChefTab from './Components/Chef/ChefNavigator'
import ModificationChef from './Components/Chef/Profile/Modification'
import ParametreChef from './Components/Chef/Profile/Parametre'
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
  apiKey: "AIzaSyB5r_knTurXCWVHrvE3h2o5gVbDyzoD0Ic",
  authDomain: "joet-7a3c2.firebaseapp.com",
  databaseURL: "https://joet-7a3c2.firebaseio.com",
  projectId: "joet-7a3c2",
  storageBucket: "joet-7a3c2.appspot.com",
  messagingSenderId: "885924455080"
};
firebase.initializeApp(config);

const app = createStackNavigator({

  Acceuil: Acceuil,
  Login: Login,
  TypeOfUser: TypeOfUser,
  AddClient: AddClient,
  AddLivreur: AddLivreur,
  AddChef: AddChef,

  ClientTab: ClientTab,
  ModificationClient: ModificationClient,
  ParametreClient: ParametreClient,

  TousLesPlats: TousLesPlats,
  AffichePlat: AffichePlat,
  Commander: Commander,

  LivreurTab: LivreurTab,
  ModificationLivreur: ModificationLivreur,
  ParametreLivreur: ParametreLivreur,

  ChefTab: ChefTab,
  ModificationChef: ModificationChef,
  ParametreChef: ParametreChef,

},
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
)
export default App = createAppContainer(app)
