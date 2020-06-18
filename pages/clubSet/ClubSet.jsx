import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, Image, Alert } from 'react-native'
import { List, Button, Modal, TextareaItem, WhiteSpace, InputItem } from '@ant-design/react-native'
import Axios from 'axios'
import storage from '../../utils/storage'
import userNull from '../../assets/icon/user_null.jpg'
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import baseUrl from '../../lib/default'

export default class ClubSet extends Component {
    constructor(props) {
        super(props)
        this.onChange = value => {
            this.setState({
                value,
            });
        };
    }

    async UNSAFE_componentWillMount() {
        await storage.readData('loginState', (obj) => {
            this.setState({
                user_id: obj.user_id,
            })
        })
    }

    async componentDidMount() {
        this.getPermissionAsync();
        this.getclubset()
    }

    getclubset = async () => {
        await Axios.post(baseUrl + ':3000/api/club/clubset', {
            club_id: this.props.route.params.club_id
        }).then((res) => {
            if (res.data.ret) {
                this.setState({
                    club_info: res.data.data.club_info,
                    club_member: res.data.data.club_member,
                    club_handle: res.data.data.club_handle
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }


    state = {
        user_id: null,
        club_id: this.props.route.params.club_id,
        club_info: {},
        club_member: [],
        activity_member: [],
        visible: false,
        value: '',
        title: '',
        image: null,
        filename: null,
        axiosPostRequestCancel: null,
        club_handle: []
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }
            let path = result.uri
            if (path.indexOf("/") > 0) {//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
                this.setState({
                    filename: path.substring(path.lastIndexOf("/") + 1, path.length)
                })
            } else { this.setState({ filename: path }) }
        } catch (E) {
            console.log(E);
        }
    };

    onClose = () => { this.setState({ visible: false }) }

    agree = (user_id, club_id) => {
        return async () => {
            await Axios.post(baseUrl + ':3000/api/club/agree', {
                user_id,
                club_id
            }).then((res) => {
                if (res.data.ret) {
                    this.getclubset()
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    deletemember = (user_id, club_id) => {
        return async () => {
            await Axios.post(baseUrl + ':3000/api/club/quit', {
                user_id,
                club_id
            }).then((res) => {
                if (res.data.ret) {
                    this.getclubset()
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    agreegame = (user_id, game_id) => {
        return async () => {
            await Axios.post(baseUrl + ':3000/api/club/agreegame', {
                user_id,
                game_id
            }).then((res) => {
                if(res.data.ret){
                    this.getclubset()
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }


    render() {
        let info = this.state.club_info
        let member = this.state.club_member
        let id = this.state.user_id
        let handle = this.state.club_handle
        return (<ScrollView>
            <View style={styles.banner}>
                <View style={styles.clubTitleLeft}>
                    <Image source={{ uri:baseUrl + info.club_logo }} style={styles.clubIcon} />
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={styles.userHeadImg}
                            source={info.user_headimg == 'null' ? userNull : { uri:baseUrl + info.user_headimg }}
                        />
                        <Text style={{ fontSize: 16, textAlignVertical: 'center' }}>社长：{info.user_name}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>社团名称：{info.club_name}</Text>
                    <Text>创建日期：{info.club_date}</Text>
                    <Text>社团人数：{info.club_num}人</Text>
                    <Text>社团状态：{info.club_status}</Text>
                </View>
            </View>
            <Button
                type="primary"
                disabled={info.user_id == id ? false : true}
                onPress={() => { this.setState({ visible: true }) }}
            >发布社团活动</Button>
            <List renderHeader={'社团成员'}>{
                member.length > 0 ? member.map((val, i) => {
                    if (val.userclub_status == 1)
                        return (
                            <List.Item
                                key={val.userclub_id}
                                extra={id != info.user_id ? true : <Button
                                    disabled={val.userclub_duty == '社长' ? true : false}
                                    type="warning"
                                    onPress={this.deletemember(val.user_id, val.club_id)}
                                >删除成员</Button>}
                                thumb={<Image
                                    source={val.user_headimg == 'null' ? userNull : { uri:baseUrl + val.user_headimg }}
                                    style={styles.userHeadImg}
                                />}
                            >
                                {val.user_name}
                                <List.Item.Brief>部门：{val.userclub_department}</List.Item.Brief>
                                <List.Item.Brief>职位：{val.userclub_duty}</List.Item.Brief>
                                <List.Item.Brief>加入时间：{val.userclub_date}</List.Item.Brief>
                            </List.Item>
                        )
                }) : (<View><Text>没有成员</Text></View>)
            }</List>
            <List renderHeader={'待加入社团的成员'}>{
                member.length > 0 ? member.map((val, i) => {
                    if (val.userclub_status == 0)
                        return (
                            <List.Item
                                key={val.userclub_id}
                                extra={<View>
                                    <Button
                                        disabled={id != info.user_id ? true : false}
                                        type='primary'
                                        onPress={this.agree(val.user_id, val.club_id)}
                                    >同意加入</Button>
                                    <Button
                                        disabled={id != info.user_id ? true : false}
                                        type='warning'
                                        onPress={this.deletemember(val.user_id, val.club_id)}
                                    >拒绝加入</Button>
                                </View>}
                                thumb={<Image
                                    source={val.user_headimg == 'null' ? userNull : { uri:baseUrl + val.user_headimg }}
                                    style={styles.userHeadImg}
                                />}
                            >
                                {val.user_name}
                                <List.Item.Brief>部门：{val.userclub_department}</List.Item.Brief>
                                <List.Item.Brief>职位：{val.userclub_duty}</List.Item.Brief>
                                <List.Item.Brief>申请时间：{val.userclub_date}</List.Item.Brief>
                            </List.Item>
                        )
                }) : (<View><Text>没有待处理事务</Text></View>)
            }</List>
            <List renderHeader={'申请加入社团活动用户'}>
                {
                    handle.length > 0 ? handle.map((val, i) => {
                        return (
                            <List.Item
                                key={val.usergame_id}
                                extra={val.usergame_status == 1 ? "已加入" : (<View>
                                    <Image style={styles.gamepic} source={{ uri: val.game_pic }} />
                                    <Button
                                        disabled={id != info.user_id ? true : false}
                                        type='primary'
                                        onPress={this.agreegame(val.user_id, val.game_id)}
                                    >同意加入</Button>
                                </View>)}
                                thumb={<Image
                                    source={val.user_headimg == 'null' ? userNull : { uri:baseUrl + val.user_headimg }}
                                    style={styles.userHeadImg}
                                />}
                            >
                                {val.user_name}
                                <List.Item.Brief>活动名：{val.game_title}</List.Item.Brief>
                                <List.Item.Brief>创建时间：{val.game_date}</List.Item.Brief>
                                <List.Item.Brief>申请时间：{val.usergame_date}</List.Item.Brief>
                            </List.Item>
                        )
                    }) : <View><Text>没有待处理事项</Text></View>
                }
            </List>
            <Modal
                transparent
                visible={this.state.visible}
                animationType="slide-up"
                onClose={this.onClose}
            >
                <List style={{ paddingVertical: 0 }}>
                    {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: '100%', height: 200, resizeMode: 'contain' }} />}
                    <Button onPress={this._pickImage} >添加图片</Button>
                    <InputItem
                        clear
                        type="text"
                        value={this.state.title}
                        onChange={value => {
                            this.setState({
                                title: value,
                            });
                        }}
                    >
                        标题
                    </InputItem>
                    <TextareaItem
                        rows={10}
                        placeholder="请填写活动描述"
                        count={400}
                        value={this.state.value}
                        onChange={this.onChange}
                    />
                </List>
                <Button type="primary" onPress={() => {
                    if (this.state.title && this.state.value && this.state.image) {
                        let formData = new FormData();
                        let config = {
                            //添加请求头
                            headers: { "Content-Type": "multipart/form-data" },
                            timeout: 600000,
                            //添加上传进度监听事件
                            onUploadProgress: e => {
                                let completeProgress = (e.loaded / e.total * 100) | 0;
                            },
                        };
                        let file = {
                            uri: this.state.image,
                            type: 'application/octet-stream',
                            name: this.state.filename
                        };
                        if (file.uri && file.name) {
                            formData.append("pic", file)
                        }
                        formData.append('game_text', this.state.value)
                        formData.append('game_title', this.state.title)
                        formData.append('user_id', this.state.user_id)
                        formData.append('club_id', this.state.club_id)
                        Axios.post(baseUrl + ':3000/api/club/publish', formData, config)
                            .then((response) => {
                                console.log(response.data)
                                if (response.data.ret) {
                                    Alert.alert('结果', response.data.data.message)
                                    this.onClose()
                                    this.setState({
                                        image: null,
                                        filename: null,
                                        title: null,
                                        value: null
                                    })
                                } else {
                                    Alert.alert('结果', response.data.data.message)
                                }
                            })
                            .catch(function (error) {
                                console.log(error)
                            });
                    } else {
                        Alert.alert('处理结果', '不能没有文字说明和图片')
                    }
                }}>发布社团活动</Button>
                <WhiteSpace size="sm" />
                <Button type="warning" onPress={this.onClose}>取消</Button>
            </Modal>
        </ScrollView>)
    }
}

const styles = StyleSheet.create({
    banner: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff'
    },
    clubIcon: {
        height: 120,
        width: 120,
        resizeMode: 'contain'
    },
    userHeadImg: {
        height: 40,
        width: 40,
        resizeMode: 'cover',
        borderRadius: 20
    },
    clubTitleLeft: {
        borderColor: '#eee',
        borderRightWidth: 1
    },
    gamepic: {
        height: 50,
        width: 50,
        resizeMode: 'cover'
    }
})