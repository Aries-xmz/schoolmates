import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { List, WhiteSpace, WingBlank, Card, Button } from '@ant-design/react-native'
import axios from 'axios'
import storage from '../../utils/storage'
import baseUrl from '../../lib/default'

export default class GameNavigator extends Component {

    async UNSAFE_componentWillMount() {
        await storage.readData('loginState', (obj) => {
            this.setState({
                user_id: obj.user_id
            })
        })
    }

    async componentDidMount() {
        await axios.get(baseUrl + ':3000/api/club/getact').then((res) => {
            if (res.data.ret) {
                this.setState({
                    data: res.data.data.list
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    state = {
        data: [],
        user_id: null
    }

    addgame = (game_id, club_id) => {
        return () => {
            axios.post(baseUrl + ':3000/api/club/addgame', {
                game_id,
                user_id: this.state.user_id,
                club_id
            }).then((res) => {
                alert(res.data.data.message)
            }).catch((err) => {
                console.log(err)
            })
        }
    }


    render() {
        let { data } = this.state
        return (
            <ScrollView>
                <WhiteSpace size="lg" />
                {data.length > 0 ? data.map((val, i) => {
                    return (<View key={i}>
                        <WingBlank size="lg">
                            <Card>
                                <Card.Header
                                    title={val.game_title}
                                    extra={val.game_date}
                                />
                                <Card.Body>
                                    <View style={{ width: '100%' }}>
                                        <Image style={{ height: 240, width: '100%', resizeMode: 'contain' }} source={{ uri:baseUrl + val.game_pic }} />
                                        <Text style={{ marginLeft: 16 }}>{val.game_text}</Text>
                                    </View>
                                    <Button
                                        style={{ marginHorizontal: '10%' }}
                                        type="primary"
                                        disabled={val.game_status == 0 ? false : true}
                                        onPress={this.addgame(val.game_id, val.club_id)}
                                    >申请参与活动</Button>
                                </Card.Body>
                                <Card.Footer
                                    content={`加入人数：${val.game_num}人`}
                                    extra={val.game_status == 0 ? '状态：正在进行' : '状态：已经结束'}
                                />
                            </Card>
                        </WingBlank>
                        <WhiteSpace size="lg" />
                    </View>)
                }) : (<Text>啥也没有</Text>)}
            </ScrollView>
        )
    }
}
