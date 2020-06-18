import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { List, SearchBar } from '@ant-design/react-native'
import storage from '../../utils/storage'
let { height, width } = Dimensions.get('window');
import moment from 'moment'
import Axios from 'axios';
import baseUrl from '../../lib/default'

export default class Chat extends Component {
    constructor(props) {
        super(props)

        this.onChange = value => {
            this.setState({ value });
        }
        this.clear = () => {
            this.setState({ value: '' });
        }
    }

    state = {
        user_id: null,
        messageList: [],
        value: '',
        user_contact_id: this.props.route.params.user_id
    }

    async UNSAFE_componentWillMount() {
        await storage.readData('loginState', (obj) => {
            this.setState({ user_id: obj.user_id })
            Axios.post(baseUrl + ':3000/api/msg/msgRead', {
                msg_from: this.state.user_contact_id,
                msg_to: this.state.user_id
            }).then((res) => {
                if (res.data.ret) {
                    this.setState({
                        messageList: [...this.state.messageList, ...res.data.data.msg]
                    })
                }
            })
        })
    }

    componentDidMount() {

        global.socket.on("sendMsg", (data) => {
            this.setState({
                messageList: [...this.state.messageList, data]
            })
        });
    }

    search = async (val) => {
        let { user_id, user_contact_id } = this.state
        if (val) {
            global.socket.emit("sendMsg", {
                msg_from: user_id,
                msg_to: user_contact_id,
                msg: val,
                moment: moment().format('lll')
            })
        }
        this.clear()
    }

    render() {
        let { messageList } = this.state
        return (<View style={{ position: 'relative', width: '100%', height }}>
            <ScrollView style={style.msglist}>
                {messageList.length > 0 ? messageList.map((val, i) => {
                    if (this.state.user_id == val.msg_from) {
                        return (<View
                            key={val.message_id ? val.message_id : (val.msg_from + val.msg_to + val.moment + val.msg + i)}
                            style={style.msgitem}
                        >
                            <Text style={{ textAlign: 'right', color: 'green' }}>{val.moment}</Text>
                            <Text style={{ textAlign: 'right' }}>{val.msg}</Text>
                        </View>)
                    } else if (this.state.user_contact_id == val.msg_from) {
                        return (<View
                            key={val.message_id ? val.message_id : (val.msg_from + val.msg_to + val.moment + val.msg + i)}
                            style={style.msgitem}
                        >
                            <Text style={{ textAlign: 'left', color: 'green' }}>{val.moment}</Text>
                            <Text style={{ textAlign: 'left' }}>{val.msg}</Text>
                        </View>)
                    }
                }) : (<View></View>)}
            </ScrollView>
            <View
                style={style.input}
            >
                <SearchBar
                    value={this.state.value}
                    placeholder="请输入聊天内容"
                    onSubmit={this.search}
                    onCancel={this.clear}
                    onChange={this.onChange}
                    showCancelButton
                />
            </View>
        </View >)
    }

}

let style = StyleSheet.create({
    input: {
        backgroundColor: 'blue',
        height: 40,
        width: '100%',
        position: 'absolute',
        top: height - 120,
        zIndex: 999
    },
    msglist: {
        minHeight: height,
        width,
        flexDirection: 'column'
    },
    msgitem: {
        minHeight: 50,
        width: '100%'
    }
})