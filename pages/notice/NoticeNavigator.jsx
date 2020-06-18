import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import axios from 'axios'
import storage from '../../utils/storage'
import { List, Button } from '@ant-design/react-native'
import userNull from '../../assets/icon/user_null.jpg'
import baseUrl from '../../lib/default'

export default class NoticeNavigator extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        list: [],
        user_id: null
    }

    agree = (user_contact_id) => {
        return async () => {
            await axios.post(baseUrl + ':3000/api/appuser/agree', {
                user_id: this.state.user_id,
                user_contact_id
            }).then((response) => {
                if (response.data.ret) {
                    alert('添加好友成功')
                    this.handlefriend(this.state.user_id)
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    handlefriend = async (user_id) => {
        await axios.post(baseUrl + ':3000/api/appuser/handlefriend', {
            user_id
        }).then((response) => {
            this.setState({
                list: response.data.data.list
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    refuse = (user_contact_id) => {
        return async () => {
            await axios.post(baseUrl + ':3000/api/appuser/deletefriend', {
                user_id: this.state.user_id,
                user_contact_id
            }).then((response) => {
                if (response.data.ret) {
                    alert('已拒绝')
                    this.handlefriend(this.state.user_id)
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }


    async componentDidMount() {
        await storage.readData('loginState', (obj) => {
            this.setState({ user_id: obj.user_id })
            this.handlefriend(obj.user_id)
        })
    }

    render() {
        return (
            <ScrollView>
                <List>
                    {
                        this.state.list.length > 0 ? this.state.list.map((val, i) => {
                            return (<List.Item
                                key = {val.contact_id}
                                thumb={<Image
                                    source={val.user_headimg == 'null' ? userNull : { uri:baseUrl + val.user_headimg }}
                                    style={{ height: 25, width: 25, borderRadius: 25, resizeMode: 'cover' }}
                                />}
                                extra={<View>
                                    <Button type="primary" onPress={this.agree(val.user_contact_id)}>同意</Button>
                                    <Button type="warning" onPress={this.refuse(val.user_contact_id)}>拒绝</Button>
                                </View>}
                            >
                                {val.user_name}
                                <List.Item.Brief>该用户请求加你为好友</List.Item.Brief>
                            </List.Item>)
                        }) : (<View><Text>没有待处理事务</Text></View>)
                    }
                </List>
            </ScrollView>
        )
    }
}
