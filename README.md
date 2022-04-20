# 简介
- https://www.eggjs.org/zh-CN/core
Node服务层
# 开发

安装依赖 
```bash
npm install
```

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

执行数据库Migrate
```bash
$ npx sequelize db:migrate
```

# 规范

## 关于 Node 版本
node版本为：17.7.1

## 关于代码规范
由于 Node 上暂时没找到很好的实时检测工具，所以建议直接安装 VS Code 的插件：[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## 关于数据库
- 为避免冲突，本地数据库配置，统一为
```json
"username": "root",
"password": "123456",
"database": "egg_dev",
"host": "127.0.0.1",
"dialect": "mysql",
```
- 数据库 ORM 框架，使用 [Sequelize](https://eggjs.org/zh-cn/tutorials/sequelize.html)；
- 数据库表的维护，使用 [Migration](https://eggjs.org/zh-cn/tutorials/sequelize.html) 管理；
- 新增数据表、数据表结构变更，一律使用 Migration 的方式进行，方便进行数据表结构的版本控制；
- 禁止：手动修改表结构、新建表、删除表；

## 关于分层架构

### 请求流向
Router -> Controller -> Service -> Model

### Router
[路由](https://eggjs.org/zh-cn/basics/router.html)。可以简单理解为，面向用户的入口，系统提供的接口路由，都在这里定义。

### Controller
[控制器](https://eggjs.org/zh-cn/basics/controller.html)。和路由层直接交互，负责接受路由信息，解析用户的输入，调用相关的 Service，并把结果返回给用户。

### Service
[服务](https://eggjs.org/zh-cn/basics/service.html)。直接和 Model 层，或者第三方服务交互，也可以提供一些聚合的服务，或处理复杂的业务逻辑。

### Model
[持久层](https://eggjs.org/zh-cn/tutorials/sequelize.html)。定义数据库表的映射，提供数据库操作框架，为 Service 服务。

## 如何开发一个接口？

### 1. 数据表设计
- 根据业务需要，设计相关字段；

### 2. 建表 / 生成 Migration 种子文件
-   表设计好之后，需要生成 Migration 种子文件，定义数据表的升级&降级操作逻辑。生成种子文件的命令：
```bash
npx sequelize migration:generate --name=xxx-xxx
```
### 3. 执行 Migration 种子文件
生成好种子文件后，需要执行种子文件，进行建表。命令：
```bash
npx sequelize db:migrate
```
### 4. 定义 Model
根据已经确定的表结构，在 Model 目录下，新建 Model 文件，用表名的驼峰写法进行命名。

### 5. 编写 Service
分析业务需求，编写相关 Model 的增删改查服务逻辑，或其他需要的服务，供 Controller 调用。

### 6. 编写 Controller
编写相关 Controller ，接收请求参数，处理请求逻辑，并返回结果给用户。

### 7. 添加 Router
定义接口路由，调用相关 Controller。

# 参考资料
- 更多关于 Egg.js 的使用姿势，参考[官方指南](https://eggjs.org/zh-cn/intro/)；
- sequelize 参考[官方指南](https://sequelize.org/)；
- https://sequelize.org/
- https://www.sequelize.com.cn/
- https://www.bookstack.cn/read/sequelize-orm-v6-zh/e6d4ca7634926bb3.md
- https://itbilu.com/nodejs/npm/sequelize-docs-v5.html
- https://github.com/demopark/sequelize-docs-Zh-CN
- http://www.junyao.tech/posts/f8b4d511.html