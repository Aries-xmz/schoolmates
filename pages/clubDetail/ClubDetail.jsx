import React, { Component } from 'react'
import { Text, View, Image, TouchableHighlight, StyleSheet } from 'react-native'
import { List, WhiteSpace, WingBlank, Card, Button, Modal } from '@ant-design/react-native'
import { ScrollView } from 'react-native-gesture-handler'
import axios from 'axios'
import storage from '../../utils/storage'
import baseUrl from '../../lib/default'

export default class ClubDetailNavigator extends Component {
    state = {
        data: [],
        visible: false,
        val: '',
        user_id: null
    }

    async componentDidMount() {
        await storage.readData('loginState', (obj) => {
            this.setState({ user_id: obj.user_id })
            this.getMyClub()
        })
    }

    getMyClub = async () => {
        await axios.post(baseUrl + ':3000/api/club/userclub', {
            user_id: this.state.user_id
        }).then((result) => {
            this.setState({
                data: result.data.data.list
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    quit = async () => {
        await axios.post(baseUrl + ':3000/api/club/quit', {
            user_id: this.state.user_id,
            club_id: this.state.club_id
        }).then((result) => {
            if (result.data.ret) {
                this.onClose()
                this.getMyClub()
            }
        }).catch((err) => {
            console.log(err)
        })
    }


    onClose = () => { this.setState({ visible: false }) }

    onChange = (val) => { this.setState({ val }) }

    go = (club_id, club_name) => {
        return () => {
            this.props.navigation.navigate('clubset', { club_id, club_name })
        }
    }


    render() {
        return (<ScrollView >
            <WhiteSpace size='lg' />
            {this.state.data ? this.state.data.map((val, i) => {
                return (<TouchableHighlight key={val.userclub_id} onPress={this.go(val.club_id, val.club_name)} >
                    <View >
                        <WingBlank size="lg">
                            <Card>
                                <Card.Header
                                    title={'社团名称：' + val.club_name}
                                    extra={'创建时间：' + val.club_date}
                                />
                                <Card.Body>
                                    <View style={styles.body}>
                                        <Image
                                            style={styles.clubIcon}
                                            source={{ uri:baseUrl + val.club_logo }}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ marginLeft: 16 }}>状态：{val.userclub_status ? '已加入' : '申请中'}</Text>
                                            <Text style={{ marginLeft: 16 }}>部门：{val.userclub_department}</Text>
                                            <Text style={{ marginLeft: 16 }}>职务：{val.userclub_duty}</Text>
                                        </View>
                                    </View>
                                </Card.Body>
                                <Card.Footer
                                    content={'申请加入时间：' + val.userclub_date}
                                    extra={val.userclub_duty == '社长' ? true : <Button
                                        type="warning"
                                        disabled={val.userclub_status == 0 ? true : false}
                                        onPress={() => {
                                            this.setState({ visible: true, club_id: val.club_id })
                                        }}>退出社团</Button>}
                                />
                            </Card>
                        </WingBlank>
                        <WhiteSpace size="lg" />
                    </View></TouchableHighlight>)
            }) : (<View><Text>你还没参加任何社团呐ヽ(=^･ω･^=)丿</Text></View>)}
            <Modal
                transparent
                visible={this.state.visible}
                animationType="slide-up"
                onClose={this.onClose}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>确认退出该社团嘛</Text>
                <WhiteSpace size="sm" />
                <Button type='ghost' onPress={this.quit}>确认</Button>
                <WhiteSpace size="sm" />
                <Button type="warning" onPress={this.onClose}>取消</Button>
            </Modal>
        </ScrollView>)
    }
}

let styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
    },
    clubIcon: {
        resizeMode: 'contain',
        flex: 1
    }
})