import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import LoginNavigator from '../pages/login/LoginNavigator'
import RegNavigator from '../pages/reg/RegNavigator'
import RootNavigator from '../pages/RootNavigator'
import BlogNavigator from '../pages/blog/BlogNavigator'
import ClubNavigator from '../pages/club/ClubNavigator'
import GameNavigator from '../pages/game/GameNavigator'
import NoticeNavigator from '../pages/notice/NoticeNavigator'
import ClubDetailNavigator from '../pages/clubDetail/ClubDetail'
import Chat from '../pages/chat/Chat'
import ClubSet from '../pages/clubSet/ClubSet'
import Me from '../pages/me/Me'
import Act from '../pages/act/Act'

import io from 'socket.io-client/dist/socket.io'
global.io = io
const socket = global.io.connect('http://192.168.0.102:3000', {
    jsonp: false,
    forceNode: true
})
global.socket = socket
const Stack = createStackNavigator();

export default class RouteNavigator extends Component {

    constructor(props) {
        super(props)

    }

    state = {
        isSignin: this.props.screenProps.isSignin,
        user_id: this.props.screenProps.user_id
    }

    componentDidMount() {
        if (this.state.isSignin) {
            let { user_id } = this.state
            socket.on("connect", function () {
                socket.emit("login", user_id);
                socket.on("exituser", function (data) {
                    //必须要移除没有登陆成功时给socket定义的事件，因为用户还没有登陆成功，
                    //但是socket已经创建了，如果不销毁socket
                    //这个没有登陆的用户页面还是可以收到服务器端广播的消息的，当然也可以将所有的代码放在用户
                    //真正的登陆成功的回调函数中
                    // socket.disconnect();调用这个函数也会触发客户端的disconnect事件
                    socket.removeAllListeners();
                })
                socket.on("disconnect", function () {
                    socket.disconnect();
                    socket.removeAllListeners("connect");
                    io.sockets = {};
                    console.log("与服务器端断开连接");
                });
                socket.on("error", function () {
                    socket.disconnect();
                    socket.removeAllListeners("connect");
                    io.sockets = {};
                    console.log("与服务器之间的连接发送错误");
                });
                socket.on("notexituser", function (data) {
                    console.log(data)
                });
                socket.on("login", function (data) {
                    data.forEach(function (ele) {
                        console.log(ele + "用户列表")
                    });
                });
                socket.on("userloginmsg", function (data) {
                    console.log(data + "用户登录信息")
                });
                socket.on("sendMsg", function (data) {
                    console.log(data);
                });
                socket.on("exit", function (data) {
                    console.log(data + "退出");
                });
                socket.on("r", function (data) {
                    console.log(data);
                });
                socket.on("toSomeone", function (data) {
                    console.log(data);
                });
            });
        }
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName={this.state.isSignin ? 'root' : 'login'} >
                    <Stack.Screen name="root" component={RootNavigator} options={{ title: '校友酱' }} />
                    <Stack.Screen name="login" component={LoginNavigator} options={{ title: '登录' }} />
                    <Stack.Screen name="reg" component={RegNavigator} options={{ title: '注册' }} />
                    <Stack.Screen name="blog" component={BlogNavigator} options={{ title: '我的动态' }} />
                    <Stack.Screen name="clubdetail" component={ClubDetailNavigator} options={{ title: '我的社团' }} />
                    <Stack.Screen name="game" component={GameNavigator} options={{ title: '社团活动' }} />
                    <Stack.Screen name="club" component={ClubNavigator} options={{ title: '社团' }} />
                    <Stack.Screen name="chat" component={Chat} options={({ route }) => ({ title: route.params.user_name })} />
                    <Stack.Screen name="profile" component={Me} options={{ title: '个人信息' }} />
                    <Stack.Screen name="act" component={Act} options={{ title: '我参与的社团活动' }} />
                    <Stack.Screen name="notice" component={NoticeNavigator} options={{ title: '系统通知' }} />
                    <Stack.Screen name="clubset" component={ClubSet} options={({ route }) => ({ title: route.params.club_name })} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const styles = StyleSheet.create({
    publish: {
        height: 25
    }
})