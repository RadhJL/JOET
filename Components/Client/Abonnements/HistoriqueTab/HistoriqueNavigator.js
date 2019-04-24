import { createStackNavigator, createAppContainer } from 'react-navigation'
import Liste from './Liste'
import Details from './Details'
import ProfileChef from './ProfileChef'
import ProfileLivreur from './ProfileLivreur'
const app = createStackNavigator({
    Liste:Liste,
    Details:Details,
    ProfileChef:ProfileChef,
    ProfileLivreur:ProfileLivreur

    
  }, {
      headerMode: 'none'
    }
  )
  export default HistoriqueNavigator = createAppContainer(app)
  