import Storage from 'react-native-storage';
import { AsyncStorage, View } from 'react-native';

const storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    //defaultExpires: 1000 * 3600 * 24,
    defaultExpires: null,
    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // 或是写到另一个文件里，这里require引入
    // sync: require('你可以另外写一个文件专门处理sync')

})

//单纯的存储和读取：存储方法：
const saveData = (obj) => {
    let { key, data } = obj
    storage.save({
        key,
        data,
        //expires为有效时间
        expires: 7 * 24 * 3600 * 1000
    })
};

//读取方法
const readData = (key, callback) => {
    storage.load({
        key,
        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
        autoSync: true,
    }).then(callback).catch((e) => {
        console.warn(e.message)
        switch (err.name) {
            case 'NotFoundError':
                callback('NotFoundError');
                break;
            case 'ExpiredError':
                callback('ExpiredError')
                break;
        }
    })
}
//删除数据
const removeData = (key) => {
    storage.remove({
        key
    })
}

module.exports = {
    readData,
    saveData,
    removeData
}