'use strict'
/**
 * 对 restfulApiFruits 按照 RESTful 风格映射到控制器 controller/fruits.js 中
 * router.resources('fruits', '/restfulApiFruits', fruits)
 * **/
const baseController = require('./baseController')

class fruitsController extends baseController {
  // get: http://127.0.0.1:7002/restfulApiFruits
  async index() {
    const data = [ 'get苹果', 'get香蕉', 'get雪梨' ]
    this.success({ data })
  }
  // get: http://127.0.0.1:7002/restfulApiFruits/new
  async new() {
    const data = [ 'new苹果', 'new香蕉', 'new雪梨' ]
    this.success({ data })
  }
  /**
   * get 请求
   * http://127.0.0.1:7002/restfulApiFruits/:id
   * http://127.0.0.1:7002/restfulApiFruits/100
   * **/
  async show() {
    const data = [ 'show苹果', 'show香蕉', 'show雪梨' ]
    this.success({ data })
  }
  /**
   * get 请求
   * http://127.0.0.1:7002/restfulApiFruits/:id/edit
   * http://127.0.0.1:7002/restfulApiFruits/100/100/edit
   * **/
  async edit() {
    const data = [ 'edit苹果', 'edit香蕉', 'edit雪梨' ]
    this.success({ data })
  }
  /**
   * post 请求
   * http://127.0.0.1:7002/restfulApiFruits
   * http://127.0.0.1:7002/restfulApiFruits
   * **/
  async create() {
    console.log('this.ctx.request.query', this.ctx.request.query)
    console.log('this.ctx.request.body', this.ctx.request.body)
    const data = [ 'create苹果', 'create香蕉', 'create雪梨' ]
    this.success({ data })
  }
  /**
   * patch 请求
   * http://127.0.0.1:7002/restfulApiFruits/:id
   * http://127.0.0.1:7002/restfulApiFruits/100
   * **/
  async update() {
    console.log('this.ctx.request.query', this.ctx.request.query)
    console.log('this.ctx.request.body', this.ctx.request.body)
    const data = [ 'PATCH-update苹果', 'PATCH-update香蕉', 'PATCH-update雪梨' ]
    this.success({ data })
  }
  /**
   * delete 请求
   * http://127.0.0.1:7002/restfulApiFruits/:id
   * http://127.0.0.1:7002/restfulApiFruits/100
   * **/
  async destroy() {
    console.log('this.ctx.request.query', this.ctx.request.query)
    console.log('this.ctx.request.body', this.ctx.request.body)
    const data = [ 'destroy苹果', 'destroy香蕉', 'destroy雪梨' ]
    this.success({ data })
  }
}

module.exports = fruitsController
