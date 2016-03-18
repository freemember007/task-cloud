var tool = require('bmobcloud-local');
console.log('==== 开始测试 ==== \n')


//引入appkey配置
var options = require('../AppConfig.json');
tool.initialize(options.app_key, options.rest_key);


//测试在本地代码
function local() {
  var taskList = require('../cloud/taskList.js').taskList;
  tool.test(taskList);
}

//测试在服务端代码
function server() {
  var path = require('path');
  tool.testInServer(path.resolve(__dirname, '../cloud/taskList.js'), {
    'subject': 'team',
    'objectId': 'W98PFFFR'
  });
}


// local();
server();