//投稿されたデータを取得
function doPost(e) {
  var params = JSON.parse(e.postData.getDataAsString());
  var keyWord = params.key;
  var keyPlace = params.place;
  //レスポンス処理
  var res = ContentService.createTextOutput();
  res = res.setMimeType(ContentService.MimeType.JAVASCRIPT);
  res = res.setContent(JSON.stringify(getBookData(keyWord, keyPlace)));

  return res
}


function getBookData(KeyWord, place){
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
  var testString = KeyWord;  // フォームから入力された値。今は仮にデザインとしている。
  var testPlace = place; // フォームから入力された値。今は仮に大阪としている。
  var searchedBookInformation = [];
  if(testPlace !== "unselected"){
    placeInputed = true
  }

  //  検索処理
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
  return {
    "result": searchedBookInformation
  }
}
