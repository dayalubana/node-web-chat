// const moment=require('moment')
// var date=moment()

function scrollToBottom(){
  var message=jQuery('#messages');
  var newMessage=message.children('li:last-child')
  // Heights
  var clientHeight=message.prop('clientHeight');
  var scrollTop=message.prop('scrollTop');
  var scrollHeight=message.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();

  // if(clientHeight +  scrollTop + newMessageHeight + lastMessageHeight>=scrollHeight){
    message.scrollTop(scrollHeight)

  // }
}

var socket=io()
socket.on('connect',function(){
  console.log('Connect to Server')
  var param=jQuery.deparam(window.location.search)
  socket.emit('join',param,function(err){
    if(err){
      alert(err)
      window.location.href='/'
    }else{
      console.log('no    error');
    }
  })
  // socket.emit('createEmail',{
  //   to:'julie@jds',
  //   text:'hey'
  // })


});
socket.on('disconnect',function(){
  console.log('Disconnect from server')
})
// socket.on('newEmail',function(email){
//   console.log('New Email',email);
// })

socket.on('updateUserList',function(users){
  console.log('UserList',users);
  var ol=jQuery('<ol></ol>')
  users.forEach((user)=>{
    ol.append(jQuery('<li></li>').text(user))
  })
jQuery('#users').html(ol)
})

socket.on('newMessage',function(message){
  var template=jQuery('#message-template').html()
  var formatedDate=moment(message.createdAt).format('h:mm a');
  var html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:formatedDate
  })
  jQuery('#messages').append(html)
  scrollToBottom()
  // console.log('message ',message);
  // var li=jQuery('<li></li>')
  //
  // var formatedDate=moment(message.createdAt).format('h:mm a');
  // // var d=new Date(m)
  // // var q=date.format('hh:mm a')
  // li.text(message.from+' '+formatedDate+' :  '+message.text+'')
  // jQuery('#messages').append(li)
})
// socket.emit('createMessage',{
//   to:'daya@ds',
//   text:'what kjkljd'
// },function(data){
//   console.log('Got it');
// })
jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    // from:'User',
    text:jQuery('[name=message]').val()
  },function(){
    jQuery('[name=message]').val('')
  })
})

// var location=jQuery('#send-location');
// location.on('click',function(e){
//   if(!navigator.geolocation){
//     return alert('Not Available location')
//   }
//   navigator.geolocation.getCurrentPosition(function(position){
//     // console.log(position)
//   },function(){
//     alert('Unable to fetch geoLocation')
//   })
//
// })
