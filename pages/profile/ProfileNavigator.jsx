import React, { Component } from 'react'
import { Text, ScrollView, StyleSheet, Image, View, TextInput } from 'react-native'
import clubPng from '../../assets/icon/club.png'
import bgNull from '../../assets/icon/bgNull.jpg'
import userNull from '../../assets/icon/user_null.jpg'
import userDetail from '../../assets/icon/user_detail.png'
import action from '../../assets/icon/action.png'
import returnPng from '../../assets/icon/return.png'
import storage from '../../utils/storage'
import axios from 'axios'
import { List, InputItem, Button, WhiteSpace } from '@ant-design/react-native'
import { BlurView } from 'expo-blur';
import baseUrl from '../../lib/default'

const Item = List.Item;

export default class ProfileNavigator extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        data: {},
        viewRef: null,
        user_name: '',
        user_signature: ''
    }

    gotonav = (go) => {
        return () => {
            this.props.navigation.navigate(go)
        }
    }


    async componentDidMount() {
        await storage.readData('loginState', async (obj) => {
            let result = await axios.post(baseUrl + ':3000/api/appuser/detail', {
                way: obj.way,
                account: obj.account
            })
            let data = result.data.data
            this.setState({
                data,
                user_name: data.user_name,
                user_signature: data.user_signature
            })
        })
    }

    signout = async () => {
        await storage.removeData('loginState')
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'login' }],
        })
        // this.props.navigation.navigate('login')
        global.socket.on("exituser", function (data) {
            //必须要移除没有登陆成功时给socket定义的事件，因为用户还没有登陆成功，
            //但是socket已经创建了，如果不销毁socket
            //这个没有登陆的用户页面还是可以收到服务器端广播的消息的，当然也可以将所有的代码放在用户
            //真正的登陆成功的回调函数中
            // socket.disconnect();调用这个函数也会触发客户端的disconnect事件
            global.socket.removeAllListeners();
        });
    }

    render() {
        let { data } = this.state
        return (<ScrollView>
            <View style={styles.bg}>
                <Image
                    style={styles.bg_img}
                    source={bgNull}
                />
                <BlurView intensity={90} style={StyleSheet.absoluteFill}>
                    <View style={styles.inner}>
                        <Image
                            style={styles.user_headimg}
                            source={data.user_headimg == 'null' ? userNull : { uri:baseUrl + data.user_headimg }}
                        />
                        <View>
                            <TextInput
                                onChangeText={(val) => {
                                    this.setState({
                                        user_name: val
                                    })
                                }}
                            >{this.state.user_name}</TextInput>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ height: 30, lineHeight: 30 }}>签名：</Text>
                            <TextInput
                                onChangeText={(val) => {
                                    this.setState({
                                        user_signature: val
                                    })
                                }}
                                style={{ height: 30, borderBottomWidth: 2 }}
                                placeholder={this.state.user_signature}
                            > {this.state.user_signature} </TextInput>
                        </View>
                    </View>
                </BlurView>
            </View>
            <List>
                <InputItem
                    editable={false}
                    value={data.userdetail_university}
                > 大学 </InputItem>
                <InputItem
                    editable={false}
                    value={data.userdetail_academy}
                > 学院 </InputItem>
                <InputItem
                    editable={false}
                    value={data.userdetail_specialty}
                > 专业 </InputItem>
                <InputItem
                    editable={false}
                    value={data.userdetail_class}
                > 班级 </InputItem>
                <InputItem
                    editable={false}
                    value={data.user_code}
                > 学号 </InputItem>
            </List>
            <List renderHeader={'profile'}>
                <Item
                    extra={<Image source={userDetail} style={{ height: 25, width: 25 }} />}
                    arrow="horizontal"
                > 个人信息 </Item>
                <Item
                    extra={<Image source={action} style={{ height: 20, width: 20 }} />}
                    arrow="horizontal"
                    onPress={this.gotonav('blog')}
                > 我的动态 </Item>
                <Item
                    extra={<Image source={clubPng} style={{ height: 20, width: 20 }} />}
                    arrow="horizontal"
                    onPress={this.gotonav('clubdetail')}
                > 我的社团 </Item>
                <Item
                    extra={<Image source={returnPng} style={{ height: 20, width: 20 }} />}
                    arrow="horizontal"
                    onPress={this.gotonav('act')}
                > 我的活动 </Item>
            </List>
            <WhiteSpace size="xl" />
            <Button
                style={{ marginHorizontal: '10%' }}
                type="warning" title="signout"
                onPress={this.signout}>退出登录</Button>
            <WhiteSpace size="xl" />
        </ScrollView>)
    }
}

let styles = StyleSheet.create({
    bg: {
        width: "100%",
        height: 240,
        backgroundColor: "black"
    },
    inner: {
        width: "100%",
        height: 240,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    user_headimg: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    bg_img: {
        width: '100%',
        height: 240,
        resizeMode: 'contain'
    },
    absolute: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
})