//投稿されたデータを取得
function doGet(e) {
  var keyWord = e.parameter.key;
  getBookData(keyWord);
}

function getBookData(val){
  // スプレッドシート取り出したタイトルと場所をbookInformationに格納。
  var sheet = SpreadsheetApp.getActiveSheet();
  var bookInformation,bookName,bookPlace,lastRow;
  lastRow = sheet.getLastRow(); // 値が入っている最後の行
  var bookInformation = [];
  for(var i = 3; i <= lastRow; i++){
    bookInformation.push({});
    bookName = sheet.getRange(i, 2).getValue();
    bookPlace = sheet.getRange(i, 3).getValue();
    bookInformation[i-3].name = bookName;
    bookInformation[i-3].place = bookPlace;
  };
  // 条件に合致したタイトルと場所をsearchedBookInformationに格納。
  var placeInputed = false;
  var testString = val;  // フォームから入力された値。今は仮にデザインとしている。
  var testPlace = '大阪'; // フォームから入力された値。今は仮に大阪としている。
  var searchedBookInformation = [];

  // TODO: elseの時の処理
  if(placeInputed){
    for(const i in bookInformation){
      if(bookInformation[i].name.indexOf(testString) != -1){
        if(bookInformation[i].place == testPlace){
          searchedBookInformation.push(bookInformation[i]);
        };
      }
    }
  }else{
    for(const i in bookInformation){
      if(bookInformation[i].name.indexOf(testString) != -1){
        searchedBookInformation.push(bookInformation[i]);
      }
    }
  }
  //本が見つからない時
  if(searchedBookInformation.length === 0){
    var blockKit = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "本は無いみたい！！購入依頼を出しますか？"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "出す！"
          },
          "style": "primary",
          "value": "出す！"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "出さない"
          },
          "style": "danger",
          "value": "出さない"
        }
      ]
     }
    ]
    var jsonData = {"blocks": blockKit};
    var payload = JSON.stringify(jsonData);
    postSearchResult(payload)
    }else{
      //本が見つかった時検索結果を表示
      var blockKit = [];
      for(const i in searchedBookInformation){
        blockKit.push(
		　　　　　　{
		　　　　　　	"type": "context",
		　　　　　　	"elements": [
		　　　　　　		{
		　　　　　　			"type": "mrkdwn",
    　　　　　　			"text": ":sushi: :book:"+ searchedBookInformation[i].name + "  場所 : " + searchedBookInformation[i].place
		　　　　　　		}
		　　　　　　	],
	  　　　　　　 },
		　　　　　　{
		　　　　　　	"type": "divider"
		　　　　　　}
        　)
      }
      var jsonData = {"blocks": blockKit};
      var payload = JSON.stringify(jsonData);
      postSearchResult(payload)
    }
}


 //検索結果をpost
function postSearchResult(payload){
    var url ="https://hooks.slack.com/services/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";
    var options={
         "method" : "POST",
         "headers": {"Content-type": "application/json"},
         "payload" : payload
   };
   UrlFetchApp.fetch(url, options);
}
