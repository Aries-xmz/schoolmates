import React, { Component } from 'react'
import { Text, View, ScrollView, Image, Alert, StyleSheet, TouchableHighlight } from 'react-native'
import { Button, WhiteSpace, List, Modal, InputItem } from '@ant-design/react-native'
import storage from '../../utils/storage'
import axios from 'axios'
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import userNull from '../../assets/icon/user_null.jpg'
import baseUrl from '../../lib/default'

export default class ClubNavigator extends Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        this.getPermissionAsync();
        await storage.readData('loginState', (obj) => {
            this.setState({ user_id: obj.user_id })
            this.getClub()
        })
    }

    state = {
        visible: false,
        val: '',
        data: [],
        image: null,
        filename: null,
        user_id: null
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

    getClub = async () => {
        await axios.get(baseUrl + ':3000/api/club/getclub').then((result) => {
            this.setState({
                data: result.data.data.list
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    join = (club_id) => {
        return async () => {
            await axios.post(baseUrl + ':3000/api/club/join', {
                club_id,
                user_id: this.state.user_id,
            }).then((result) => {
                Alert.alert('处理结果', result.data.data.message)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    go = (club_id, club_name) => {
        return () => {
            this.props.navigation.navigate('clubset', { club_id, club_name })
        }
    }

    onClose = () => { this.setState({ visible: false }) }

    onChange = (val) => { this.setState({ val }) }

    render() {
        return (<ScrollView>
            <Button type="primary" onPress={() => {
                this.setState({ visible: true })
            }}>创建社团</Button>
            <View style={styles.row}>
                {this.state.data.length > 0 ? this.state.data.map((val, i) => {
                    return <TouchableHighlight
                        style={styles.rowInner}
                        key={val.club_id + val.club_name}
                        onPress={this.go(val.club_id, val.club_name)}>
                        <View>
                            <Image style={styles.clubIcon} source={{ uri:baseUrl + val.club_logo }}></Image>
                            <Text style={styles.clubName} >{val.club_name}</Text>
                            <Button
                                style={styles.joinBtn}
                                type="primary"
                                disabled={this.state.user_id == val.user_id ? true : false}
                                onPress={this.join(val.club_id)}
                            >申请加入</Button>
                            <List style={{ paddingBottom: '5%' }}>
                                <List.Item
                                    align="top"
                                    thumb={<Image
                                        style={styles.userHeadImg}
                                        source={val.user_headimg != 'null' ? { uri:baseUrl + val.user_headimg } : userNull} />}
                                >
                                    <List.Item.Brief>社长:{val.user_name}</List.Item.Brief>
                                    <List.Item.Brief>社团人数：{val.club_num}人</List.Item.Brief>
                                    <List.Item.Brief>社团状态:{val.club_status}</List.Item.Brief>
                                    <List.Item.Brief>创建时间:{val.club_date}</List.Item.Brief>
                                </List.Item>
                            </List>
                        </View>
                    </TouchableHighlight>
                }) : <View><Text>暂且没有社团ヾ(。￣□￣)ﾂ゜゜゜</Text></View>}
            </View>
            <Modal
                transparent
                visible={this.state.visible}
                animationType="slide-up"
                onClose={this.onClose}
            >
                <List style={{ paddingVertical: 0 }}>
                    {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: '100%', height: 200, resizeMode: 'contain' }} />}
                    <Button onPress={this._pickImage} >社团logo</Button>
                    <InputItem
                        clear
                        type="text"
                        value={this.state.val}
                        onChange={value => {
                            this.setState({
                                val: value,
                            });
                        }}
                        placeholder="社团名称必填"
                    >
                        社团名称
                    </InputItem>
                </List>
                <Button type="primary" onPress={() => {
                    if (!this.state.image || !this.state.val) {
                        Alert.alert('处理结果', '社团名称和logo不可或缺')
                        return
                    }
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
                    formData.append("pic", file)
                    formData.append('club_name', this.state.val)
                    formData.append('user_id', this.state.user_id)
                    axios.post(baseUrl + ':3000/api/club/create', formData, config)
                        .then((response) => {
                            if (response.data.ret) {
                                Alert.alert('结果', response.data.data.message)
                                this.onClose()
                                this.setState({
                                    image: null,
                                    filename: null,
                                })
                                this.getClub()
                            } else {
                                Alert.alert('结果', response.data.data.message)
                            }
                        })
                        .catch(function (error) {
                            console.log(error)
                        });
                }}>确认创建</Button>
                <WhiteSpace size="sm" />
                <Button type="warning" onPress={this.onClose}>取消</Button>
            </Modal>
        </ScrollView>)
    }
}

let styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: 240,
        flexWrap: "wrap"
    },
    clubIcon: {
        width: "100%",
        height: 120,
        resizeMode: 'contain'
    },
    clubName: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    rowInner: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
        width: '48%',
        marginLeft: '1%',
        marginVertical: '1%'
    },
    joinBtn: {
        marginVertical: '5%',
        marginHorizontal: '5%'
    },
    userHeadImg: {
        width: 30,
        height: 30,
        borderRadius: 15
    }
})