'use strict'

const crypto = require('crypto')
const moment = require('moment')

module.exports = {
  sha1(str) {
    const hash = crypto.createHmac('sha1', str)
    return hash.digest('hex')
  },

  /**
   * 数组转换成树状结构的数据
   * @param { Object } Object 配置参数 =>
   * @param { Array } Object.data: 转化的源数据,
   * @param { String } Object.prop: 数据id的key名,
   * @param { String } Object.parentProp: 数据父级id的key名,
   * @param { String } Object.childProp: 生成子级的key名
   * @param { Number } Object.value: 数据的[Object.prop]值为这个value时，则为父级
   * @return { Array } 转化后的数据
   */
  toTreeJson({ data = [], prop = 'id', parentProp = 'parent_id', childProp = 'children', value = 0 } = {}) {
    const res = []
    const map = data.reduce(
      (res, item) => {
        res[item[prop]] = item
        return res
      }, {}
    )
    for (const item of data) {
      if (item[parentProp] === value) {
        res.push(item)
        continue
      }
      if (item[parentProp] in map) {
        const parent = map[item[parentProp]]
        parent[childProp] = parent[childProp] || []
        parent[childProp].push(item)
      }
    }
    return res
  },

  /**
   * 生成随机名字
   * @param { number } randomNum 随机码个数
   * @return { string } 随机名字
   */
  getRandomName(randomNum = 4) {
    const create_time = moment().format('YYYY-MM-DDTHH-mm-ss')
    const random = Math.random().toString()
    const hash = crypto
      .createHash('sha1')
      .update(create_time + random)
      .digest('hex')
      .slice(0, randomNum)
    // 时间戳 + 8位随机字符串
    return `${create_time}-${hash}`
  },
  /**
   * 传入时间,输入特定的事件格式
   * @param { String, Number } time 传入时间
   * @param { String } cFormat 固定的时间格式,不传就返回{y}-{m}-{d} {h}:{i}:{s}
   * @return { String } 返回固定的格式时间
   */
  parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    if (!time) return ''
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return [ '日', '一', '二', '三', '四', '五', '六' ][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  },
  /**
   * 处理时间数据
   * @param { String } time 传入时间
   * @return { String } new Date()处理后的数据
   */
  getDateObj(time) {
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    return date
  },
  /**
   * 将时间转化成为天时分秒
   * @param { any } time 传入的时间
   * @param { String } cFormat 时间格式
   * @param { String } unit 时间单位
   * @return { null|String } 处理好的时间
   */
  convertTime(time, cFormat, unit = 's') {
    if (!time) return ''
    if (arguments.length === 0) {
      return null
    }
    if (time <= 0) return time
    const time_s = unit === 'ms' ? Math.floor(time / 1000) : time
    // 获取毫秒
    let ms = unit === 'ms' ? time % 1000 : 0
    // 获取天数
    const d = Math.floor(time_s / (24 * 3600))
    // 获取小时
    let h = Math.floor(time_s % (24 * 3600) / 3600)
    // 获取分钟
    let m = Math.floor(time_s % 3600 / 60)
    // 获取秒
    let s = (time_s % 3600 % 60).toFixed(0)
    // 根据format进行判断
    if (!/d+/g.test(cFormat)) {
      h += d * 24
    }
    if (!/h+/g.test(cFormat)) {
      m += h * 60
    }
    if (!/m+/g.test(cFormat.replace('ms', ''))) {
      s += m * 60
    }
    if (!/s+/g.test(cFormat)) {
      ms += s * 1000
    }
    const formatObj = { ms, d, h, m, s }
    const formatFilter = cFormat.split('{').filter(item => { // 过滤掉为0的项
      return formatObj[item[0]] !== 0
    }).join('{')
    const time_str = formatFilter.replace(/{([ymdhisa])+}/g, (result, key) => {
      return formatObj[key]
    })
    return time_str
  },
  /**
   * 主要是根据key拿到相应的index
   * @param {Array} arr 数组
   * @param { String, Number} key 就是需要index的某个value值
   * @return { Number } 返回的是index值
   */
  getIndexByKey(arr, key) {
    return arr.findIndex(i => i.key === key)
  },
  /**
 * 根据图片url转成base64
 * @param { String } url 图片url
 * @param { String } ctx 拿到ctx
 * @return { String } 转成base64后的路径
 */
  async getBase64(url, ctx) {
    const result = await ctx.curl(url)
    if (result.status !== 200) {
      return ''
    }
    if (!result.headers['content-type'].includes('image')) {
      return ''
    }
    // 处理响应，编码成base64
    const type = result.headers['content-type']
    const prefix = `data:${type};base64,`
    return `${prefix}${result.data.toString('base64')}`
  },
  /**
 * 获取文件的md5
 * @param { Buffer } fileBuffer 文件的buffer流
 * @return { String } 文件的md5值
 */
  getFileMD5(fileBuffer) {
    return crypto.createHash('md5').update(fileBuffer, 'utf8').digest('hex') // 生成文件的Md5
  },
  /**
   * Calculate the time difference
   * @param {any} start 开始时间
   * @param {any} end 结束时间
   * @param {string} cFormat 时间格式化
   * @return {string | null} 返回时间差
   */
  apartTime(start, end, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{d}天{h}小时{i}分钟{s}秒'

    const startTime = this.getDateObj(start).getTime()
    const endTime = this.getDateObj(end).getTime()
    const apart = endTime - startTime
    // 计算出相差天数
    const d = Math.floor(apart / (24 * 3600 * 1000))

    // 计算出小时数
    const leave1 = apart % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    const h = Math.floor(leave1 / (3600 * 1000))

    // 计算相差分钟数
    const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
    const i = Math.floor(leave2 / (60 * 1000))

    // 计算相差秒数
    const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
    const s = Math.round(leave3 / 1000)

    const formatObj = { d, h, i, s }
    const formatFilter = format.split('{').filter(item => { // 过滤掉为0的项
      return formatObj[item[0]] !== 0
    }).join('{')
    const time_str = formatFilter.replace(/{([ymdhisa])+}/g, (result, key) => {
      return formatObj[key]
    })
    return time_str
  },
  /**
   * 判断数据类型是否为对象类型
   * @param { Any } data 需要判断的数据
   * @return { Boolean } 返回结果
   */
  isObject(data) {
    return data instanceof Object && !Array.isArray(data)
  },
  /**
   * 时间戳 => 毫秒转为秒
   * @param { Array/Number } data 需要判断的数据
   * @return { Array/Number } 返回结果
   */
  millisecondToSecond(data) {
    if (Array.isArray(data)) {
      return data.length > 0 ? data.map(millisecond => {
        return Math.round(millisecond / 1000) || 0
      }) : []
    }
    if (data && typeof data === 'number') {
      return Math.round(data / 1000) || 0
    }
    return data
  },
  /**
   * 只遍历一层obj
   * 用于删除对象中，value值为null、""、undefined的key(注意：value值为0的key会被保留)
   * @param { Object } obj 一个对象
   * @return { Object } 返回结果
   */
  filterObjProp(obj) {
    Object.keys(obj).forEach(item => {
      if (!(obj[item] === 0) && !obj[item]) delete obj[item]
    })
    return obj
  },
  /**
   * 根据时间格式,处理成需要的时间
   * @param { Any } time 时间参数 可以传时间数组,字符串(时间戳),对象,具体查看http://momentjs.cn/docs/
   * @param { String } dateFormat 时间格式 例如: 大X表示时间戳(秒),小x表示毫秒时间戳,了解更多查看api
   */
  handleMomentTime(time, dateFormat) {
    return moment(time).format(dateFormat)
  },
  /**
   * 获取禁言剩余数
   * @param { Date } endTime 禁言截止时间
   */
  forbidTime(endTime) {
    if (!endTime) {
      return ''
    }
    const nowTime = new Date()
    const res = moment(endTime * 1000).diff(moment(nowTime), 'seconds')
    return +res > 0 ? `剩余${this.apartTime(nowTime, endTime)}` : ''
  },
  /**
  * 判断数据类型为对象的话就返回本身，否则返回空对象
  * @param { Any } data 需要判断的数据
  * @return { Object } 返回结果
  */
  returnObject(data) {
    return this.isObject(data) ? data : {}
  },
  /**
   * 判断数据类型为数组的话就返回本身，否则返回空数组
   * @param { Any } data 需要判断的数据
   * @return { Array } 返回结果
   */
  returnArray(data) {
    return Array.isArray(data) ? data : []
  },

  /**
   * 获取传入时间的上一个周期的时间
   * @param { Object } param 时间配置数据
   * @param { String } param.type 类型： day/week/month...
   * @param { String } param.startTime 开始时间
   * @param { String } param.endTime 结束时间
   * @return { Object } 返回上一个周期的开始时间、结束时间
   */
  getLastCycleTime({ type, startTime, endTime }) {
    return {
      startDate: moment(startTime).add(-1, type).startOf(type)
        .format('YYYY-MM-DD'),
      endDate: moment(endTime).add(-1, type).endOf(type)
        .format('YYYY-MM-DD'),
    }
  },

  /**
   * 周: 获取开始日期周第一天和结束日期周最后一天(英文中是上周日-这周六)
   * 月: 获取开始日期月第一天和结束日期月的最后一天
   * @param { String } date 日期 可以是具体日期或者是时间戳ms
   * @param { String } dateType 月或者是周,月传month,周传week
   * @param { String } order 计算开始日期还是结束日期,开始start,结束end
   */
  selectDateType(date, dateType, order) {
    return order === 'start' ? moment(new Date(date)).startOf(dateType).format('YYYY-MM-DD HH:mm:ss')
      : moment(new Date(date)).endOf(dateType).format('YYYY-MM-DD HH:mm:ss')
  },
  /**
   * 秒数转换为 00:00:00格式的数据
   * @param { Number } second 秒数
   * @return { String } 返回00:00:00格式的数据
   */
  secondTransformTable(second) {
    const time = Number(second)
    if (!second || time === 0) {
      return '00:00:00'
    }
    return moment('1900-01-01 00:00:00').add(time, 'seconds').format('HH:mm:ss')
  },
}
