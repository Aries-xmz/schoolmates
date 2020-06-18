import React from 'react'
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Provider, WhiteSpace } from '@ant-design/react-native'
import RouteNavigator from './routes/RouteNavigator'
import storage from './utils/storage'

export default class App extends React.Component {

  state = {
    theme: null,
    currentTheme: null,
    isReady: false,
    isSignin: false
  };
  changeTheme = (theme, currentTheme) => {
    this.setState({ theme, currentTheme });
  };
  async componentDidMount() {

    await storage.readData('loginState', (tokenObj) => {
      if (tokenObj !== 'ExpiredError' && tokenObj !== 'NotFoundError') {
        // console.log(tokenObj)
        this.setState({
          isSignin: tokenObj.isSignin,
          user_id: tokenObj.user_id
        })
        // let token = tokenObj.token
        // axios.get('http://192.168.0.103:3000/api/appuser/isSignin', {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'X-Access-Token': token || ''
        //   },
        // }).then((response) => {
        //   if (response.data.ret) {
        //     this.setState({ isSignin: true })
        //   } else {
        //     this.setState({ isSignin: false })
        //   }
        // }).catch((err) => {
        //   console.log(err)
        // })
      }
    })
    await Font.loadAsync(
      'antoutline',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antoutline.ttf')
    );

    await Font.loadAsync(
      'antfill',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antfill.ttf')
    );
    // eslint-disable-next-line
    this.setState({ isReady: true });
  }
  render() {
    const { theme, currentTheme, isReady, isSignin, user_id } = this.state;
    if (!isReady) {
      return <AppLoading />;
    }
    return (
      <Provider theme={theme}>
        {/* <WhiteSpace size="xl" /> */}
        <RouteNavigator
          screenProps={{ changeTheme: this.changeTheme, currentTheme, isSignin, user_id }}
        />
      </Provider>
    )
  }
}