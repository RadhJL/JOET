import { createStackNavigator, createAppContainer } from 'react-navigation'
import Liste from './Liste'
import Details from './Details'
import ProfileClient from './ProfileClient'
import ProfileLivreur from './ProfileLivreur'
const app = createStackNavigator({
    Liste: Liste,
    Details: Details,
    ProfileClient:ProfileClient,
    ProfileLivreur:ProfileLivreur
}, {
        headerMode: 'none'
    }
)
export default HistoriqueNavigator = createAppContainer(app)
