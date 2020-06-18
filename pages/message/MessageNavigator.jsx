import React, { Component } from 'react'
import { Image, Text, View, StyleSheet, ScrollView } from 'react-native'
import { List } from '@ant-design/react-native'
import storage from '../../utils/storage'
import baseUrl from '../../lib/default'

const Item = List.Item
const Brief = Item.Brief

export default class MessageNavigator extends Component {

    state = {
        data: []
    }

    async componentDidMount() {
        await storage.readData('loginState')
    }

    render() {
        return (
            <ScrollView>
                <List>{
                    this.state.data.map((val, i) => {
                        return (
                            <Item
                                thumb={<Image
                                    source={{ uri:baseUrl + val.headimg }}
                                    style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "cover" }}
                                />}
                                align="top"
                                extra={val.extra}
                                multipleLine
                            >
                                {val.username}
                                < Brief wrap={false}> {val.signature}</Brief>
                            </Item>)
                    })
                }
                </List >
            </ScrollView >
        )
    }
}

styles = StyleSheet.create({
    userHeadImage: {
        height: 25,
        width: 25,
        borderRadius: 25
    }
})