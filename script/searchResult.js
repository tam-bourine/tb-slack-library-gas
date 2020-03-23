//投稿されたデータを取得
function doPost(e) {
  let params = JSON.parse(e.postData.getDataAsString());
  let keyWord = params.key;
  let keyPlace = params.place;
  let title = params.reqTitle;
  let place = params.reqPlace;
  let purchaser = params. reqUser;
  let remarks = params.reqAbout;
  //レスポンス処理
  let res = ContentService.createTextOutput();
  res = res.setMimeType(ContentService.MimeType.JAVASCRIPT);
  res = res.setContent(JSON.stringify(getBookData(keyWord, keyPlace)));
  
  let res2 = ContentService.createTextOutput();
  res2 = res2.setMimeType(ContentService.MimeType.JAVASCRIPT);
  res2 = res2.setContent(JSON.stringify(getPurchaseRequestedData(title, place, purchaser, remarks)));

  return res
}


function getBookData(keyWord, keyPlace){
  // スプレッドシートから取り出したタイトルと場所をbookInformationに格納。
  let sheet = SpreadsheetApp.getActiveSheet();
  let savedBookTitle, savedBookPlace;
  let columnAVals = sheet.getRange('A:A').getValues();
  let lastRow = columnAVals.filter(String).length;
  let bookInformation = [];
  for(let i = 3; i <= lastRow; i++){
    bookInformation.push({});
    bookInformation[i-3].name = sheet.getRange(i, 2).getValue();
    bookInformation[i-3].place = sheet.getRange(i, 3).getValue();
  };
  // 検索条件に合致したタイトルと場所をsearchedBookInformationに格納。
  let placeInputed = false;
  let searchingBookTitle = keyWord;
  let searchingBookPlace = keyPlace;
  let searchedBookInformation = [];
  if(searchingBookPlace !== "unselected"){
    placeInputed = true
  }
  //  検索処理
  if(placeInputed){
    for(let i in bookInformation){
      if(bookInformation[i].name.indexOf(searchingBookTitle) != -1 && bookInformation[i].place == searchingBookPlace){
          searchedBookInformation.push(bookInformation[i]);
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
  let sheet = SpreadsheetApp.getActiveSheet();
  let columnIVals = sheet.getRange('J:J').getValues();
  let lastRow = columnIVals.filter(String).length;
  sheet.getRange(lastRow+1, 10).setValue(purchaseRequestedBookTitle);
  sheet.getRange(lastRow+1, 11).setValue(purchaseRequestedPlace);
  sheet.getRange(lastRow+1, 12).setValue(purchaser);
  sheet.getRange(lastRow+1, 13).setValue(remarks);
}