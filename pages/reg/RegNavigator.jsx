import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Button, InputItem, List } from '@ant-design/react-native'
import axios from 'axios'
import baseUrl from '../../lib/default'

export default class RegNavigator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            university: '',
            academy: '',
            specialty: '',
            class: '',
            code: '',
            username: '',
            password: ''
        }
    }

    reg = async () => {
        let university = this.state.university
        let academy = this.state.academy
        let specialty = this.state.specialty
        let classNum = this.state.class
        let code = this.state.code
        let username = this.state.username
        let password = this.state.password
        if (university || academy) {
            if (specialty && classNum && code && password) {
                axios.post(baseUrl + ':3000/api/appuser/signup', {
                    university,
                    academy,
                    specialty,
                    classNum,
                    code,
                    username,
                    password
                }).then((result) => {
                    if (result.data.ret) {
                        console.log(result.data)
                        alert(result.data.data.message)
                        this.props.navigation.navigate('login')
                    } else {
                        alert(result.data.data.message)
                    }
                })

            } else {
                alert('信息填写不完整')
            }
        } else {
            alert('大学和学院必填一项')
        }
    }
    render() {
        return (
            <View style={{ backgroundColor: '#536ce0' }}>
                <List renderHeader={'请填写以下信息完成注册'}>
                    <InputItem
                        clear
                        value={this.state.university}
                        onChange={value => {
                            this.setState({ university: value, });
                        }}
                        placeholder="university"
                    >
                        大学
                    </InputItem>
                    <InputItem
                        clear
                        type="text"
                        value={this.state.academy}
                        onChange={value => {
                            this.setState({
                                academy: value,
                            });
                        }}
                        placeholder="academy"
                    >
                        学院
                    </InputItem>
                    <InputItem
                        clear
                        type="text"
                        value={this.state.specialty}
                        onChange={value => {
                            this.setState({
                                specialty: value,
                            });
                        }}
                        placeholder="specialty必填"
                    >
                        专业
                    </InputItem>
                    <InputItem
                        clear
                        type="text"
                        value={this.state.class}
                        onChange={value => {
                            this.setState({
                                class: value,
                            });
                        }}
                        placeholder="class必填"
                    >
                        班级
                    </InputItem>
                    <InputItem
                        clear
                        type="number"
                        value={this.state.code}
                        onChange={value => {
                            this.setState({
                                code: value,
                            });
                        }}
                        placeholder="code必填"
                    >
                        学号
                    </InputItem>
                    <InputItem
                        clear
                        type="text"
                        value={this.state.username}
                        onChange={value => {
                            this.setState({
                                username: value,
                            });
                        }}
                        placeholder="nickname必填"
                    >
                        昵称
                    </InputItem>
                    <InputItem
                        clear
                        type="password"
                        value={this.state.password}
                        onChange={value => {
                            this.setState({
                                password: value,
                            });
                        }}
                        placeholder="password必填"
                    >
                        密码
                    </InputItem>
                    <Button
                        style={{ marginHorizontal: '5%' }}
                        onPress={this.reg}
                        type="primary"
                    >
                        立即注册
                    </Button>
                </List>
            </View>
        )
    }
}
