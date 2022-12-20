// 모듈 모음
const functions = require("firebase-functions");
let admin = require("firebase-admin");
const cors = require("cors")({origin:true});
let axios = require("axios");
let FormData = require("form-data");

// Fetch the service account key JSON file contents
let serviceAccount = require("./schfirebase-3e909-firebase-adminsdk-z3fw5-94ff603e48");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://schfirebase-3e909-default-rtdb.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
let db = admin.database();


// 채팅내용 불러오기
exports.helloWorld3 = functions.https.onRequest((request, response) => {
  cors(request, response, ()=> {
    db.ref("msgs").on("value", (snapshot)=> {
      response.send(snapshot.val());
    });
  });
  
});

// 회원가입
exports.join = functions.https.onRequest((request, response) => {
  cors(request, response, ()=> {
    let id = request.body.id;
    let pw = request.body.pw;
    db.ref("members/"+id).set(pw);
  })

});

// 로그인
exports.login = functions.https.onRequest((request, response) => {
  cors(request, response, ()=> {

    if(!request.body.id) {
      response.send({"result": "정상적인 접근이 아닙니다."});
    };

    let id = request.body.id;
    let pw = request.body.pw;
    db.ref("members/"+id).on("value", (snapshot)=> {
      if(snapshot.val()) {
        if(snapshot.val()== pw) {
          response.send({"result_code": 1, "result": "로그인 되었습니다."});
        } else {
          response.send({"result_code": 2, "result": "비밀번호가 일치하지 않습니다."});
        };
      } else {
        response.send({"result_code": 3, "result": "가입되지 않는 회원입니다."})
      };
    });
  });
});

// sms발송
exports.sendSMS = functions.https.onRequest((request, response) => {
  cors(request, response, ()=> {

    let phone = request.body.phone;

    let data = new FormData();
    data.append("remote_id", "ckdgns005");
    data.append("remote_pass", "Qq1w2e3r4t5@@");
    data.append("remote_num", "1");
    data.append("remote_phone", phone);
    data.append("remote_callback", "01033585048");
    data.append("remote_msg", "안녕하세요. 테스트 문자입니다.");

    axios({
      method: "post",
      url: "https://www.munja123.com/Remote/RemoteSms.html",
      headers: {
        ...data.getHeaders()
      },
      data: data
    }).then((res)=> {
      response.send({"result_code": "1", "result": "전송완료"});
    });



  });

});




// 데이터 기입하기
exports.helloWorld = functions.https.onRequest((request, response) => {
  db.ref("testtest").set("functions이용해서 database에 값넣기");
  response.send("Hello from Firebase!");
});

// 데이터 기입하기2
exports.ceocamp = functions.https.onRequest((request, response) => {
  response.send("개발부트캠프 참여를 축하합니다!");
});

// 데이터 기입하기3
exports.myInfo = functions.https.onRequest((request, response) => {
  let myInformation = {
    name: "성창훈",
    age: 28,
    type: "B"
  };

  response.send(myInformation);
});

// 데이터 불러오기
exports.helloWorld2 = functions.https.onRequest((request, response) => {
  db.ref("testtest").on("value", (snapshot)=> {
    response.send(snapshot.val());
  });
});

