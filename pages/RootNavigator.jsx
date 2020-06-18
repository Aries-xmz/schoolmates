import React from 'react'
import { Icon, TabBar } from '@ant-design/react-native'
import HomeNavigator from './home/HomeNavigator'
import MessageNavigator from './message/MessageNavigator'
import ContactsNavigator from './contacts/ContactsNavigator'
import ProfileNavigator from './profile/ProfileNavigator'


export default class BasicTabBarExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'homeTab',
    };
  }
  
  onChangeTab(tabName) {
    this.setState({
      selectedTab: tabName,
    });
  }

  render() {
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="#f5f5f5"
      >
        <TabBar.Item
          title="主页"
          icon={<Icon name="home" />}
          selected={this.state.selectedTab === 'homeTab'}
          onPress={() => this.onChangeTab('homeTab')}
        >
          {<HomeNavigator navigation={this.props.navigation} />}
        </TabBar.Item>
        <TabBar.Item
          icon={<Icon name="message" />}
          title="消息"
          badge={0}
          selected={this.state.selectedTab === 'InformTab'}
          onPress={() => this.onChangeTab('InformTab')}
        >
          {<MessageNavigator navigation={this.props.navigation} />}
        </TabBar.Item>
        <TabBar.Item
          icon={<Icon name="contacts" />}
          title="联系人"
          selected={this.state.selectedTab === 'FriendTab'}
          onPress={() => this.onChangeTab('FriendTab')}
        >
          {<ContactsNavigator navigation={this.props.navigation} />}
        </TabBar.Item>
        <TabBar.Item
          icon={<Icon name="user" />}
          title="我的"
          selected={this.state.selectedTab === 'ProfileTab'}
          onPress={() => this.onChangeTab('ProfileTab')}
        >
          {<ProfileNavigator navigation={this.props.navigation} route={this.props.route} />}
        </TabBar.Item>
      </TabBar>
    );
  }
}
