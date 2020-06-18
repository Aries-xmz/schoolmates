import React, { Component } from 'react'
import { Alert, Image, ScrollView, View, Text } from 'react-native'
import { SearchBar, List, Modal, Button, SwipeAction } from '@ant-design/react-native'
import storage from '../../utils/storage'
import axios from 'axios'
import userNull from '../../assets/icon/user_null.jpg'
import baseUrl from '../../lib/default'

const Item = List.Item
const Brief = Item.Brief;

export default class ContactsNavigator extends Component {
    constructor() {
        super(...arguments);

        this.onChange = value => {
            this.setState({ value });
        }
        this.clear = () => {
            this.setState({ value: '' });
        }
    }

    async componentDidMount() {
        await storage.readData('loginState', async (obj) => {
            this.setState({ user_id: obj.user_id })
            axios.post(baseUrl + ':3000/api/appuser/contact', {
                user_id: obj.user_id
            }).then((result) => {
                if (result.data.ret) {
                    this.setState({
                        data: result.data.data.list
                    })
                }
            }).catch((err) => {
                console.warn(err)
            })
        })
    }

    state = {
        value: '',
        data: [],
        visible: false,
        user: [],
        user_id: null,
    }

    search = async (val) => {
        await axios.post(baseUrl + ':3000/api/appuser/user', {
            info: val
        }).then((result) => {
            if (result.data.ret) {
                this.setState({
                    user: result.data.data.userinfo,
                    visible: true
                })
            } else {
                Alert.alert('结果', '没有查到')
            }
        }).catch((err) => {
            console.warn(err)
        })
    }

    onClose = () => {
        this.setState({ visible: false })
    }

    addFriend = (friend_id) => {
        return async () => {
            await axios.post(baseUrl + ':3000/api/appuser/addfriend', {
                user_id: this.state.user_id,
                user_contact_id: friend_id
            }).then((result) => {
                this.setState({
                    visible: false
                })
                Alert.alert(
                    '结果',
                    result.data.data.message,
                )
            }).catch((err) => {
                console.warn(err)
            })
        }
    }

    deleteFriend = (id) => {
        return async () => {
            await axios.post(baseUrl + ':3000/api/appuser/deletefriend', {
                user_contact_id: id,
                user_id: this.state.user_id
            }).then((result) => {
                Alert.alert('处理结果', result.data.data.message)
                if (result.data.ret) {
                    axios.post(baseUrl + ':3000/api/appuser/contact', {
                        user_id: this.state.user_id
                    }).then((result) => {
                        if (result.data.ret) {
                            this.setState({
                                data: result.data.data.list
                            })
                        }
                    }).catch((err) => {
                        console.warn(err)
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    alertDelete = (id) => {
        return () => {
            Alert.alert('提示', '确认删除吗', [
                { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '确认', onPress: this.deleteFriend(id) }
            ])
        }
    }

    render() {
        return (
            <ScrollView>
                <SearchBar
                    value={this.state.value}
                    placeholder="请输入学号"
                    onSubmit={this.search}
                    onCancel={this.clear}
                    onChange={this.onChange}
                    showCancelButton
                />
                <List>{
                    this.state.data.length > 0 ? this.state.data.map((val, i) => {
                        return (
                            <SwipeAction
                                autoClose
                                key={val.user_name}
                                style={{ backgroundColor: 'transparent' }}
                                right={[{
                                    text: '删除好友',
                                    onPress: this.alertDelete(val.user_contact_id),
                                    style: { backgroundColor: 'red', color: 'white' },
                                },]}
                            >
                                <Item
                                    onPress={() => {
                                        this.props.navigation.navigate('chat', {
                                            user_id: val.user_id,
                                            user_name: val.user_name
                                        })
                                    }}
                                    extra={
                                        <Image
                                            source={val.user_headimg != 'null' ? { uri: baseUrl + val.user_headimg } : userNull}
                                            style={{ width: 30, height: 30, borderRadius: 15, resizeMode: "cover" }}
                                        />} >
                                    {val.user_name}
                                    <Brief>{val.user_signature}</Brief>
                                </Item>
                            </SwipeAction>
                        )
                    }) : (<Item>还没有好友哟(＾Ｕ＾)ノ~</Item>)}
                </List>
                <Modal
                    popup
                    visible={this.state.visible}
                    animationType="slide-up"
                    onClose={this.onClose}
                    maskClosable
                >
                    <List >
                        {this.state.user.length > 0 ? this.state.user.map((val, i) => {
                            return (<Item
                                key={val.user_id}
                                thumb={<Image
                                    source={val.user_headimg ? { uri: baseUrl + val.user_headimg } : userNull}
                                    style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "cover" }}
                                />}
                                align="center"
                                extra={<Button type="primary" onPress={this.addFriend(val.user_id)}>加为好友</Button>}
                            >
                                {val.user_name}
                                < Brief wrap={false}> {val.user_signature}</Brief>
                            </Item>)
                        }) : (<View><Text>啥也没找到</Text></View>)}
                    </List>
                    <Button type="warning" onPress={this.onClose} > 关闭 </Button>
                </Modal>
            </ScrollView >
        )
    }
}
