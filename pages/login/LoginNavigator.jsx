import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { WhiteSpace, Icon, Button, List, Radio } from '@ant-design/react-native'
import { Link } from '@react-navigation/native'
import axios from 'axios'
import baseUrl from '../../lib/default'
import storage from '../../utils/storage'

export default class LoginNavigator extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        secure: true,
        username: '',
        password: '',
        way: 'code',
    }

    onPressChang = () => {
        this.setState({ secure: !this.state.secure })
    }

    onPressLogin = async () => {
        var req = {
            username: this.state.username,
            password: this.state.password,
            way: this.state.way
        }
        let result =await axios.post(baseUrl+':3000/api/appuser/signin', req)
        if (result.data.ret) {
            storage.saveData({
                key: 'loginState',
                data: {
                    user_id:result.data.data.user_id,
                    way: result.data.data.way,
                    account: result.data.data.username,
                    isSignin:result.data.data.isSignin,
                    token:result.data.data.token
                }
            })
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'root' }],
            })
        } else {
            alert(result.data.data.message)
        }
    }

    render() {
        return (
            <View>
                {/* <WhiteSpace size="xl" /> */}
                <View style={{ width: '100%', height: '100%', backgroundColor: '#536ce0' }}>
                    <Text style={styles.sc} >{"校友酱"}</Text>
                    <View style={{ flexDirection: 'row', paddingHorizontal: '10%' }}>
                        <View style={styles.userLock}>
                            <Icon name="user" size="lg" />
                        </View>
                        <TextInput
                            value={this.state.username}
                            onChangeText={value => {
                                this.setState({
                                    username: value,
                                });
                            }} style={styles.inputStyle} placeholder="请输入账号" />
                        <View style={styles.eye}></View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: '10%' }}>
                        <Radio
                            checked={this.state.way === 'code'}
                            onChange={event => {
                                if (event.target.checked) {
                                    this.setState({ way: 'code' });
                                }
                            }}
                            style={{ borderWidth: 1, borderColor: '#999', margin: 10 }}
                        >
                            学工号
                        </Radio>
                        <Radio
                            checked={this.state.way === 'email'}
                            onChange={event => {
                                if (event.target.checked) {
                                    this.setState({ way: 'email' });
                                }
                            }}
                            style={{ borderWidth: 1, borderColor: '#999', margin: 10 }}
                        >
                            电子邮件
                        </Radio>
                        <Radio
                            checked={this.state.way === 'phone'}
                            onChange={event => {
                                if (event.target.checked) {
                                    this.setState({ way: 'phone' });
                                }
                            }}
                            style={{ borderWidth: 1, borderColor: '#999', margin: 10 }}
                        >
                            手机号
                        </Radio>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: '10%' }}>
                        <View style={styles.userLock}>
                            <Icon name="lock" size="lg" />
                        </View>
                        <TextInput
                            secureTextEntry={this.state.secure}
                            value={this.state.password}
                            onChangeText={value => {
                                this.setState({
                                    password: value,
                                });
                            }}
                            style={styles.inputStyle}
                            placeholder="请输入密码"
                            textContentType="password"
                        />
                        <View style={styles.eye}>
                            <TouchableWithoutFeedback onPress={this.onPressChang} >
                                {this.state.secure ?
                                    (<Icon name={"eye-invisible"} size="lg" />)
                                    : (<Icon name={"eye"} size="lg" />)}
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <Link
                        to="/reg"
                        style={{ marginTop: '5%', marginHorizontal: '24%' }}
                    >{"还没有账号，快来注册一个吧"}</Link>
                    <Button style={styles.login} title="login" onPress={this.onPressLogin}>
                        <Text style={{ color: 'white', fontSize: 25 }}>登录</Text>
                    </Button>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    login: {
        backgroundColor: 'skyblue',
        width: '80%',
        borderWidth: 0,
        marginHorizontal: "10%",
        marginTop: 20,
        borderRadius: 25,
    },
    inputStyle: {
        height: 50,
        width: '70%',
        marginTop: 30,
        borderColor: 'gray',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: 'white',
        fontSize: 20,
        paddingLeft: '5%'
    },
    sc: {
        height: '40%',
        color: 'yellow',
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 60
    },
    eye: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        marginTop: 30,
        paddingRight: 15,
        borderColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 0
    },
    userLock: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        paddingLeft: 15,
        marginTop: 30,
        borderColor: 'gray',
        borderWidth: 1,
        borderRightWidth: 0
    }
})