//投稿されたデータを取得
function doPost(e) {
  const params = JSON.parse(e.postData.getDataAsString());
  const keyWord = params.key;
  const keyPlace = params.place;
  //レスポンス処理
  const res = ContentService.createTextOutput();
  res = res.setMimeType(ContentService.MimeType.JAVASCRIPT);
  res = res.setContent(JSON.stringify(getBookData(keyWord, keyPlace)));

  return res
}


function getBookData(keyWord, keyPlace){
  // スプレッドシートから取り出したタイトルと場所をbookInformationに格納。
  const sheet = SpreadsheetApp.getActiveSheet();
  var savedBookTitle, savedBookPlace;
  const columnAVals = sheet.getRange('A:A').getValues();
  const lastRow = columnAVals.filter(String).length;
  //lastRow = sheet.getLastRow();
  var bookInformation = [];
  for(let i = 3; i <= lastRow; i++){
    bookInformation.push({});
    savedBookTitle = sheet.getRange(i, 2).getValue();
    savedBookPlace = sheet.getRange(i, 3).getValue();
    bookInformation[i-3].name = savedBookTitle;
    bookInformation[i-3].place = savedBookPlace;
  };
  // 検索条件に合致したタイトルと場所をsearchedBookInformationに格納。
  const placeInputed = false;
  const searchingBookTitle = keyWord;
  const searchingBookPlace = keyPlace;
  var searchedBookInformation = [];
  if(searchingBookPlace !== "unselected"){
    placeInputed = true
  }
  //  検索処理
  if(placeInputed){
    for(let i in bookInformation){
      if(bookInformation[i].name.indexOf(searchingBookTitle) != -1){
        if(bookInformation[i].place == searchingBookPlace){
          searchedBookInformation.push(bookInformation[i]);
        };
      }
    }
  }else{
    for(let i in bookInformation){
      if(bookInformation[i].name.indexOf(searchingBookTitle) != -1){
        searchedBookInformation.push(bookInformation[i]);
      }
    }
  }
  return {
    "result": searchedBookInformation
  }
}

// 購入依頼をスプレッドシートに記載
function getPurchaseRequestedData(purchaseRequestedBookTitle, purchaseRequestedPlace, purchaser, remarks){
  const sheet = SpreadsheetApp.getActiveSheet();
  const columnIVals = sheet.getRange('I:I').getValues();
  const lastRow = columnIVals.filter(String).length;
  sheet.getRange(lastRow+1, 9).setValue(lastRow-1);
  sheet.getRange(lastRow+1, 10).setValue(purchaseRequestedBookTitle);
  sheet.getRange(lastRow+1, 11).setValue(purchaseRequestedPlace);
  sheet.getRange(lastRow+1, 12).setValue(purchaser);
  sheet.getRange(lastRow+1, 13).setValue(remarks);
}