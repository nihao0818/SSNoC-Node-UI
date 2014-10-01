function init() {
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);

  var sessionId = '';

  window.my_name = '';

  var my_status = '';

  var my_statusDate = '';

  var map_status_color = {"OK":"btn-success","HELP":"btn-warning","EMERGENCY":"btn-danger","UNDEFINED":""};



  function updateParticipants(participants) {
    $('#participants_online').html('');
    $('#participants_offline').html('');
    var map = {};
    var userName = '';
    var userEle = '';
    for (var sId in participants.online){
      userName = participants.online[sId].userName;
      var status = participants.online[sId].status;
      var statusDate = participants.online[sId].statusDate;
      if (map[userName] == undefined || map[userName] !== sessionId){
        map[userName] = {sId:sId,status:status,statusDate:statusDate};
      }
    }
    keys = Object.keys(map);
    keys.sort();

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i];
      var img_ele = '<img src="/img/photo4.png" height=40/>';
      var photo_ele = '<div class="col-xs-3 col-sm-2 col-md-1 col-lg-1"><img src="/img/green-dot.png" height=10/><br/>'+img_ele + '</div>';
      var name_ele = '<div class="col-xs-4 col-sm-5 col-md-6 col-lg-6"><strong>' + name + '</strong></div>';
      var dropdown_symbol = map[name].sId === sessionId ? '':'<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
      var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + name + '">' + dropdown_symbol + '</div>';
      var status_ele = '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 "><button class="btn ' + map_status_color[map[name].status] + '">' + map[name].status + '</button></div>';
      var statusDate_ele = '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">' + map[name].statusDate + '</div>';


      var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + status_ele + statusDate_ele + dropdown_ele + '</div>';
      var detail_ele = '<div class="row user-info ' + name + '"><a class="btn btn-info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">Wanna do something?</a><hr/></div></div>';
      if (map[name].sId === sessionId || name === my_name) {
      } else {
        $('#participants_online').append(info_ele);
        $('#participants_online').append(detail_ele);
      }
    }

    participants.all.forEach(function(userObj) {
      if (map[userObj.userName] == undefined) {
        var img_ele = '<img class="img-circle" src="/img/photo4.png" height=40/>';
        var photo_ele = '<div class="offline col-xs-3 col-sm-2 col-md-1 col-lg-1"><img src="/img/grey-dot.png" height=10/><br/>'+img_ele + '</div>';
        var name_ele = '<div class="offline col-xs-4 col-sm-5 col-md-6 col-lg-6"><strong>' + userObj.userName + '</strong><br/></div>';
        var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + userObj.userName + '"><i class="glyphicon glyphicon-chevron-down text-muted"></i></div>';
        var status_ele = '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 "><button class="btn ' + map_status_color[userObj.userStatus] + '">' + userObj.userStatus + '</button></div>';
        var statusDate_ele = '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">' + userObj.statusDate + '</div>';

        var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + status_ele + statusDate_ele + dropdown_ele + '</div>';
        var detail_ele = '<div class="row user-info ' + userObj.userName + '"><a class="btn btn-info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">Wanna do something?</a><hr/></div></div>';
        
        $('#participants_online').append(info_ele);
        $('#participants_online').append(detail_ele);
      }
    });
    $('.user-info').hide();
    $('.dropdown-user').click(function() {
      var dataFor = $(this).attr('data-for');
      var idFor = $(dataFor);
      var currentButton = $(this);
      idFor.slideToggle(400, function() {
        if(idFor.is(':visible'))
          {
            currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
          }
          else
            {
              currentButton.html('<i class="glyphicon glyphicon-chevron-down"></i>');
            }
      })
    });
  }

function updateStatus(status, name, statusDate){
    $.ajax({
      url:  '/status/' + name,
      type: 'POST',
      dataType: 'json',
      data: {status: status, statusDate:statusDate}
    }).done(function(data){
        console.log("The user's status has been updated successfully!");

        socket.emit('statusUpdate', {id: sessionId, name: name, status:status, statusDate:statusDate});
    });
}

/*render user's status*/
function renderStatus(){
  var status_ele = '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 dropdown">'
                  +'<button class="btn btn-default dropdown-toggle " type="button" id="status" data-toggle="dropdown">'
                     + my_status
                     +' | <span class="caret"></span>'
                  +'</button>'
                  /*                  +'<button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown">'
                    +'<span class="caret"></span>'
                    +'<span class="sr-only">Toggle Dropdown</span>'
                  +'</button>'*/
                   +'<ul class="dropdown-menu" role="menu" aria-labelledby="status">'
                     +'<li role="presentation"><a class="statusList" role="menuitem" tabindex="-1" href="#">OK</a></li>'
                     +'<li role="presentation"><a class="statusList" role="menuitem" tabindex="-1" href="#">HELP</a></li>'
                     +'<li role="presentation"><a class="statusList" role="menuitem" tabindex="-1" href="#">EMERGENCY</a></li>'
                     +'<li role="presentation" class="divider"></li>'
                     +'<li role="presentation"><a class="statusList" role="menuitem" tabindex="-1" href="#">UNDEFINED</a></li>'
                   +'</ul>'
                 +'</div>';

  $("#myself").find(".row").append(status_ele);

  var statusDate_ele = '<div id="my_statusDate" class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">' + my_statusDate + '</div>';

  $("#myself").find(".row").append(statusDate_ele);


  $("#status").addClass(map_status_color[my_status]);


/*change status*/
  $("a.statusList").click(function() {
    var chosen_status = $(this).html();
    $("#status").removeClass(map_status_color[my_status]);
    $("#status").addClass(map_status_color[chosen_status]);
    $("#status").html(chosen_status +' | <span class="caret"></span>');
    my_status = chosen_status;
    my_statusDate = generateDate();
    $("#my_statusDate").html(my_statusDate);
    updateStatus(my_status,my_name,my_statusDate);
  });
}

function generateDate(){
    var d = new Date();
    var minute = d.getMinutes();
    var hour = d.getHours();
    var date = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date) + ' ' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute);
}



  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    $.ajax({
      url:  '/user',
      type: 'GET',
      dataType: 'json'
    }).done(function(data) {
      var name = data.name;
      var status = data.status;
      var statusDate = data.statusDate;
      my_name = data.name;
      my_status = data.status;
      my_statusDate = data.statusDate;
      renderStatus();

      socket.emit('newUser', {id: sessionId, name: name, status:status, statusDate:statusDate});
    });
  });

  socket.on('newConnection', function (data) {
    updateParticipants(data.participants);
  });

  socket.on('statusUpdate', function (data) {
    updateParticipants(data.participants);
  });

  socket.on('userDisconnected', function(data) {
    updateParticipants(data.participants);
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });

  var panels = $('.user-info');
  panels.hide();
  $('.dropdown-user').click(function() {
    var dataFor = $(this).attr('data-for');
    var idFor = $(dataFor);
    var currentButton = $(this);
    idFor.slideToggle(400, function() {
      if(idFor.is(':visible'))
        {
          currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
        }
        else
          {
            currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
          }
    })
  });
}

$(document).on('ready', init);
