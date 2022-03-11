'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test/app/controller/home.test.js', () => {
  before(function() {
    // 在本区块的所有测试用例之前执行
  })

  after(function() {
    // 在本区块的所有测试用例之后执行
  })

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
    app.mockHeaders({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksIndfaWQiOiJaaG91SHVhbiIsInVzZXJuYW1lIjoiMTg4MTkxNjQyNzQiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ2ODg1NzI1LCJleHAiOjE2NDc0OTA1MjV9.YIuUSBiDOUtMfyri1A5jNp1-d5D3w-fam3KvQr6BfdQ' })
  })
  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  })

  it('should assert', () => {
    const pkg = require('../../../package.json')
    assert(app.config.keys.startsWith(pkg.name))

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  })

  it('should GET /', () => {
    // 模拟 CSRF token，下文会详细说明
    app.mockCsrf()
    // 模拟请求头
    // app.mockHeaders({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksIndfaWQiOiJaaG91SHVhbiIsInVzZXJuYW1lIjoiMTg4MTkxNjQyNzQiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ2ODg1NzI1LCJleHAiOjE2NDc0OTA1MjV9.YIuUSBiDOUtMfyri1A5jNp1-d5D3w-fam3KvQr6BfdQ' })
    return app.httpRequest()
      .get('/') //  请注意，您必须在调用 .get() 之后调用 .set()，而不是之前。
      // .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksIndfaWQiOiJaaG91SHVhbiIsInVzZXJuYW1lIjoiMTg4MTkxNjQyNzQiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ2ODg1NzI1LCJleHAiOjE2NDc0OTA1MjV9.YIuUSBiDOUtMfyri1A5jNp1-d5D3w-fam3KvQr6BfdQ',) // Works.
      .expect('hi, egg')
      .expect(200)
  })
})
