function onRequest(request, response, modules) {

  var db = modules.oData;
  var http = modules.oHttp;
  var body = request.body;

  var task = {
    company: body.company,
    assignerId: body.assigner,
    assignerName: '',
    assigneeId: body.assignee,
    assigneeName: '',
    title: body.title,
    costHours: body.costHours
  }
  var deadline = new Date((body.deadline).replace(/-/g, '/'));
  task.deadline = (deadline.getMonth() + 1) + '月' + deadline.getDate() + '日';

  var message = {
    'msg_content': '',
    'content_type': 'text',
    'title': '',
    'extras': {
      'assignee': task.assigneeId,
      'status': 1
    }
  }

  // 查询指派人姓名
  db.findOne({
    'table': '_User',
    'keys': 'name',
    'objectId': task.assignerId
  }, function(err, data) {
    task.assignerName = JSON.parse(data).name; //不变
    // 查询负责人姓名
    db.findOne({
      'table': '_User',
      'keys': 'name',
      'objectId': task.assigneeId
    }, function(err, data) {
      task.assigneeName = JSON.parse(data).name; //会变
      // 查询teamleader
      db.find({
        'table': 'team',
        'keys': 'leader',
        'where': { 'members': task.assigneeId, 'company': task.company }
      }, function(err, data) {
        var team = JSON.parse(data).results && JSON.parse(data).results[0];
        //1. 如果负责人是普通成员
        if (task.assigneeId !== team.leader.objectId) {
          //1.1 如果指派人是自己, push leader
          if (task.assignerId === task.assigneeId) {
            task.assigneeName = '自己';
            push(team.leader.objectId, message);
          //1.2 如果指派人是他人
          } else {
            //1.2.1 且指派人不是leader, push leader
            if (task.assignerId !== team.leader.objectId) {
              push(team.leader.objectId, message);
            }
            //1.2.2 push 自己
            task.assigneeName = '你';
            push(task.assigneeId, message);
          }
        // 2. 如果负责人是leader
        } else {
          db.findOne({
            'table': 'company',
            'keys': 'boss',
            'objectId': task.company
          }, function(err, data){
            var data = JSON.parse(data);
            //2.1 如果指派人是自己，push boss
            if (task.assignerId === task.assigneeId) {
              task.assigneeName = '自己';
              push(data.boss, message);
            //2.2 如果指派人是他人
            }else{
              // 且指派人不是老板，push boss
              if(task.assignerId !== data.boss){
                push(data.boss, message);
              }
              // push自己
              task.assigneeName = '你';
              push(task.assigneeId, message);
            }
          })

        }
      })
    })
  })

  function push(userId, message) {
    message.msg_content = task.assignerName + '给' + task.assigneeName + '创建了一个任务：' + 
                          task.title + '，截止时间：' + task.deadline + '，工作量：' + task.costHours + '小时。';
    var pushBody = {
      'platform': ['android'],
      'audience': { 'registration_id': [] },
      'notification': {
        'android': {
          'alert': message.msg_content,
          "extras": {
            'assignee': message.extras.assignee,
            'status': message.extras.status
          }
        }
      },
      'message': message
    }

    db.find({
      'table': 'devices',
      'keys': 'pushId',
      'where': { 'userId': userId }
    }, function(err, data) {
      var pushId = JSON.parse(data).results[0].pushId; // 假定推送人已存在，后面考虑可能不存在的情况
      pushBody.audience.registration_id.push(pushId);
      var options = {
        url: 'https://api.jpush.cn/v3/push',
        headers: {
          'Authorization': 'Basic N2FkNTFmMGM5ODYzMDNkODU4NzNmZTk4OmU4NjA5MGVlMGI0OWRhNzBkMzU2Nzk2Yw==',
        },
        body: JSON.stringify(pushBody)
      };
      http.post(options, function(error, res, body) {

        if (!error && res.statusCode == 200) {
          response.send(body);
        } else {
          response.send(res.statusCode);
        }
      })
    })

  }


}
exports.push = onRequest;