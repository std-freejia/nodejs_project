
// array
var members = ['yong-yong', 'jiaryu', 'love'];
//console.log(members[1]);

// 반복
var i = 0;
while(i<members.length){
    console.log('array loop', members[i]);
    i = i+1;
}


// object
var roles = {
    'programmer': 'brocolia',
    'designer' : 'yong-yong',
    'manager' : 'hoho'
}

//console.log(roles.designer);
console.log(roles['designer']);

// 객체 반복  (for in 객체명)
for(var name in roles){
    // key, value
    console.log('object:', name, 'value: ', roles[name]);
}
