var tool = require('bmobcloud-local');
console.log('==== 开始测试 ==== \n')


//引入appkey配置
var options = require('../AppConfig.json');
tool.initialize(options.app_key, options.rest_key);


//测试在服务端代码
function server() {
  var path = require('path');
  tool.testInServer(path.resolve(__dirname, '../cloud/updatePush.js'), 
    {
      'objectId': '9f10c1fa8b',
      'updaterId': '8DRM999C', //郭敏
      // 'title': '点点医生web原型', 
      // 'team': 'W98PFFFR',
      // 'assignee': 'EuGz444d',
      // 'costHours': 4,
      // 'priority': 3,
      'status': 2,
      // 'project': {"color":"#FF666666","name":"点点医院-微信"},
      // 'progress': '0',
      // 'file': {'__type': 'File','filename': '1457932579348.png','group': 'group1','url': 'M03/E0/DF/oYYBAFbmSSmAJMEgAAKg1zYPZTU216.png'},
      // 'deadline': '2016-03-09 00:00:00',
      // 'follower': {'action': 'AddUnique' ,'objectId': 'EuGz444d'},
      // 'liker': {'action': 'AddUnique' ,'objectId': 'EuGz444d'},
      // 'comment': {
      //   'userName': '肖江平',
      //   'userUrl': 'http://file.bmob.cn/M03/AB/6F/oYYBAFbKrFOASa63AAAyn1JM9O4332.png',
      //   'sendTimg': '2016-03-14 14:27:58',
      //   'userId': 'EuGz444d',
      //   'userMsg': '哈哈'
      // }
    }
  );
}


// local();
server();