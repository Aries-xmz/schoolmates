import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, Image, FlatList } from 'react-native'
import { Carousel, WhiteSpace, Grid, WingBlank, List, Card } from '@ant-design/react-native'
import axios from 'axios'
import baseUrl from '../../lib/default'
import userNull from '../../assets/icon/user_null.jpg'

export default class HomeNavigator extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        layout: 'list',
        data: [
            { icon: baseUrl+':3000/icon/club.png', text: '社团' },
            { icon: baseUrl+':3000/icon/game.png', text: '社团活动' },
            { icon: baseUrl+':3000/icon/message.png', text: '系统通知' }
        ],
        bannerList: [],
        autoplay: false,
        dayList: [],
        page: 0
    }

    async componentDidMount() {
        axios.get(baseUrl+':3000/api/apphome/banner').then((result) => {
            this.setState({
                bannerList: result.data.data.bannerList,
                autoplay: true
            })
        }).catch((err) => {
            console.warn(err)
        })
        this.getData()
    }

    getData = () => {
        axios.get(baseUrl+':3000/api/apphome/day', {
            params: {
                page: this.state.page
            }
        }).then((result) => {
            this.setState({
                dayList: [...this.state.dayList, ...result.data.data.data],
                page: this.state.page++
            })
        }).catch((err) => {
            console.warn(err)
        })
    }

    render() {
        let { bannerList,dayList } = this.state
        return (
            <ScrollView>
                <Carousel
                    style={styles.wrapper}
                    autoplay={this.state.autoplay}
                    infinite
                >{bannerList.length > 0 ? (bannerList.map((val, i) => {
                    return (<View key={i} style={styles.containerHorizontal} >
                        <Image style={{ height: '100%', resizeMode: 'contain', width: '100%' }} source={{ uri:baseUrl + val.hot_img }} />
                        <Text style={styles.bannerText}>{val.hot_title}</Text>
                    </View>)
                })) : (<View><Text>出了点小状况</Text></View>)}
                </Carousel>
                <WhiteSpace size="sm" />
                <Grid
                    data={this.state.data}
                    columnNum={3}
                    isCarousel
                    onPress={this.grid}
                />
                <WhiteSpace size="sm" />
                <List>{
                    dayList.length > 0 ? dayList.map((val, i) => {
                        return (<View key={val.blog_id}>
                            <WingBlank size="lg">
                                <Card>
                                    <Card.Header
                                        title={val.user_name}
                                        thumb={val.user_headimg != 'null' ? val.user_headimg :
                                            <Image
                                                source={userNull}
                                                style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 25 }}
                                            ></Image>}
                                        extra={val.blog_date}
                                    />
                                    <Card.Body>
                                        <View>
                                            {val.blog_pic ? (<Image style={{ width: '100%', height: 240, resizeMode: 'contain' }}
                                                source={{ uri:baseUrl + val.blog_pic }} />) : null}
                                            <Text style={{ marginLeft: 16 }}>{val.blog_text}</Text>
                                        </View>
                                    </Card.Body>
                                    <Card.Footer
                                    // content="点赞人数"
                                    // extra={<Image source={}></Image>}
                                    />
                                </Card>
                            </WingBlank>
                            <WhiteSpace size="lg" />
                        </View>)
                    }) : (<View><Text>没有任何动态</Text></View>)
                }</List>
            </ScrollView >
        )
    }

    grid = (el, index) => {
        var go = ''
        switch (el.text) {
            case '社团': go = 'club'
                break
            case '社团活动': go = 'game'
                break
            case '系统通知': go = 'notice'
                break
            default: go = 'root'
        }
        this.props.navigation.navigate(go)
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
    },
    containerHorizontal: {
        position: 'relative',
        height: 220,
    },
    text: {
        color: '#fff',
        fontSize: 36,
    },
    bannerText: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)'
    }
})