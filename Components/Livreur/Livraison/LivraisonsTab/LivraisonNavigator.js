import { createStackNavigator, createAppContainer } from 'react-navigation'
import Liste from './Liste'
import Details from './Details'
import ProfileClient from './ProfileClient'
import ProfileChef from './ProfileChef'
const app = createStackNavigator({
    Liste:Liste,
    Details:Details,  
    ProfileClient:ProfileClient,
    ProfileChef:ProfileChef
  }, {
      headerMode: 'none'
    }
  )
  export default LivraisonNavigator = createAppContainer(app)
  