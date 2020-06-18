import React, { Component } from 'react'
import { Text, View, ScrollView, Image, StyleSheet } from 'react-native'
import { WhiteSpace, Card, WingBlank, } from '@ant-design/react-native'
import axios from 'axios'
import baseUrl from '../../lib/default'
import storage from '../../utils/storage'

export default class Act extends Component {
    async componentDidMount() {
        await storage.readData('loginState', async (obj) => {
            await axios.get(baseUrl+':3000/api/club/findone', {
                params: {
                    user_id: obj.user_id
                }
            }).then((res) => {
                if (res.data.ret) {
                    this.setState({
                        data: res.data.data.list
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    state = {
        data: [],
        user_id: null
    }

    render() {
        let { data } = this.state
        return (
            <ScrollView>
                <WhiteSpace size="lg" />
                {data.length ? data.map((val, i) => {
                    return (<View key={i}>
                        <WingBlank size="lg">
                            <Card>
                                <Card.Header
                                    title={val.game_title}
                                    extra={val.game_date}
                                />
                                <Card.Body>
                                    <View style={{ width: '100%' }}>
                                        <Image style={{ height: 240, width: '100%', resizeMode: 'contain' }} source={{ uri: baseUrl + val.game_pic }} />
                                        <Text style={{ marginLeft: 16 }}>{val.game_text}</Text>
                                        <Text
                                            style={val.usergame_status == 0 ? style.red : style.green}
                                        >{val.usergame_status == 0 ? '申请中' : '已加入'}</Text>
                                    </View>
                                </Card.Body>
                                <Card.Footer
                                    content={`加入人数：${val.game_num}人`}
                                    extra={val.game_status == 0 ? '状态：正在进行' : '状态：已经结束'}
                                />
                            </Card>
                        </WingBlank>
                        <WhiteSpace size="lg" />
                    </View>)
                }) : (<View><Text>啥也没有</Text></View>)}
            </ScrollView>
        )
    }
}

let style = StyleSheet.create({
    red: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'red'
    },
    green: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'green'
    }
})