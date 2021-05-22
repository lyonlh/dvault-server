# dvault-server 微信小程序服务器(nodejs)
## 代码结构
```
├── app.js
├── config.js
├── file-index-db.js
├── ipfs-trans.js
├── package.json
├── ipfs-api.js
├── empty.json
└── example.json
```
## 模块和接口
1. app.js 服务入口
   - '/user/:id' 用户打开小程序后的初始化 API: 小程序用户打开后发送请求到这个API，服务器传回该用户的文件列表。
   - '/user/:id/upload/:name' 用户上传文件API: 接收用户的文件，成功后调用onUpload将文件上传到ipfs集群，返回给小程序该文件的文件名，文件hash值和文件类型
   - onUpload: 用户文件上传成功后的回调，将文件上传到ipfs集群。
   - '/user/:id/download/:hash' 用户下载文件API: 通过文件hash值从ipfs集群中下载相应的文件，并传回给微信小程序。
   - '/user/:id/del/:hash' 用户文件删除API: 通过文件hash值从ipfs集群中删除相应的文件，更新该用户的文件列表。
2. config.js 微信小程序服务端配置文件，参考[服务端文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/)
   - serverPort: 服务器端小程序可访问的端口。
   - appId: 微信小程序ID，需要到https://mp.weixin.qq.com 获取。
   - appSecret: 微信小程序安全码，需要到https://mp.weixin.qq.com 获取。
3. file-index-db.js 用户文件索引数据库。当前每个用户的索引数据放在json格式的文本文件里，以后可以考虑用数据库实现（如sqlite）。
   - dbPath 用户的数据库文件路径，每个用户根据该用户的唯一ID有唯一的路径。
   - dbEditor 根据用户ID，返回该用户的数据库文件编辑器，供数据库的增、删、查操作使用。
   - add 添加条目到数据库文件。
   - del 根据文件名或者hash值从数据库文件删除条目。
   - get 根据文件名或者hash值从数据库文件获取条目。
4. ipfs-trans.js ipfs、ipfs集群传输接口
   - download 根据文件hash值从ipfs集群下载文件。
   - upload 从ipfs集群下载文件，并返回文件唯一的hash值。
   - unpin 从ipfs集群删除文件
5. package.json nodejs依赖包配置文件。
6. ipfs-api.js ipfs接口测试文件，**已废弃**。
7. empty.json, example.json 文件列表测试文件,**已废弃**。

