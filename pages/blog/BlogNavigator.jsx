import React, { Component } from 'react'
import { Text, View, Image, Alert } from 'react-native'
import { List, WhiteSpace, WingBlank, Card, Button, Modal, TextareaItem } from '@ant-design/react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import axios from 'axios'
import baseUrl from '../../lib/default'
import storage from '../../utils/storage'

export default class BlogNavigator extends Component {
    state = {
        data: [],
        visible: false,
        val: '',
        image: null,
        filename: null,
        axiosPostRequestCancel: null,
        type: null,
        user_id: null
    }

    async componentDidMount() {
        this.getPermissionAsync();
        await storage.readData('loginState', (obj) => {
            this.setState({ user_id: obj.user_id })
            this.getBlog()
        })
    }

    getBlog = async () => {
        await axios.post(baseUrl+':3000/api/appuser/privateblog', {
            user_id: this.state.user_id
        }).then((result) => {
            this.setState({
                data: result.data.data.list
            })
        }).catch((err) => {
            console.log(err)
        })
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

    onChange = (val) => { this.setState({ val }) }

    delDay = (blog_id) => {
        return async () => {
            await axios.post(baseUrl+':3000/api/appuser/delday', {
                blog_id
            }).then((res) => {
                if (res.data.ret) {
                    alert('已删除')
                    this.getBlog()
                }
            }).catch((err) => {
                console.warn(err)
            })
        }
    }


    render() {
        return (<ScrollView >
            <WhiteSpace size='lg' />
            <Button type="primary" onPress={() => this.setState({ visible: true })}>发布新动态</Button>
            <WhiteSpace size='lg' />
            {this.state.data ? this.state.data.map((val, i) => {
                return (<View key={val.blog_id}>
                    <WingBlank size="lg">
                        <Card>
                            <Card.Header
                                title='创建时间：'
                                extra={val.blog_date}
                            />
                            <Card.Body>
                                <View>
                                    {val.blog_pic ? (<Image style={{ width: '100%', height: 240, resizeMode: 'contain' }}
                                        source={{ uri: baseUrl + val.blog_pic }} />) : null}
                                    <Text style={{ marginLeft: 16 }}>{val.blog_text}</Text>
                                </View>
                            </Card.Body>
                            <Card.Footer
                                // content={"点赞人数:" + val.blog_star}
                                extra={<Button type="warning" onPress={this.delDay(val.blog_id)}>删除该动态</Button>}
                            />
                        </Card>
                    </WingBlank>
                    <WhiteSpace size="lg" />
                </View>)
            }) : (<View><Text>啥也咩有呀ヽ(=^･ω･^=)丿</Text></View>)}
            <Modal
                transparent
                visible={this.state.visible}
                animationType="slide-up"
                onClose={this.onClose}
            >
                <List style={{ paddingVertical: 0 }}>
                    {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: '100%', height: 200, resizeMode: 'contain' }} />}
                    <Button onPress={this._pickImage} >添加图片</Button>
                    <TextareaItem
                        rows={10}
                        placeholder="请填写内容"
                        count={400}
                        value={this.state.val}
                        onChange={this.onChange}
                    />
                </List>
                <Button type="primary" onPress={() => {
                    if (!this.state.image && !this.state.val) {
                        Alert.alert('处理结果', '图片或文字至少要有一样')
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
                    if (file.uri && file.name) {
                        formData.append("pic", file)
                    }
                    formData.append('blog_text', this.state.val)
                    formData.append('user_id', this.state.user_id)
                    axios.post(baseUrl + ':3000/api/appuser/publish', formData, config)
                        .then((response) => {
                            if (response.data.ret) {
                                Alert.alert('结果', response.data.data.message)
                                this.onClose()
                                this.setState({
                                    image: null,
                                    filename: null
                                })
                                this.getBlog()
                            } else {
                                Alert.alert('结果', response.data.data.message)
                            }
                        })
                        .catch(function (error) {
                            console.log(error)
                        });
                }}>发布动态</Button>
                <WhiteSpace size="sm" />
                <Button type="warning" onPress={this.onClose}>取消</Button>
            </Modal>
        </ScrollView>)
    }
}
