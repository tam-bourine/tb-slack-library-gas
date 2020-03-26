// @ts-ignore
import dotenv from 'dotenv'

//検索結果のレスポンス処理
export function doPost(e: any): any{
    let params: any = JSON.parse(e.postData.getDataAsString());
    let keyWord: string = params.key;
    let keyPlace: string = params.place;
    let bookInformation: any = getBookData();
    let searchedBookData: Object = searchBookData(keyWord, keyPlace, bookInformation)

    let searchResult: any = ContentService.createTextOutput();
    searchResult = searchResult.setMimeType(ContentService.MimeType.JAVASCRIPT);
    searchResult = searchResult.setContent(JSON.stringify(searchedBookData));

    let title: string = params.reqTitle;
    let place: string = params.reqPlace;
    let purchaser: string = params.reqUser;
    let remarks:　string = params.reqAbout;

    throwPurchaseRequest(title, place, purchaser, remarks)

    return searchResult
}

dotenv.config()
// スプレッドシートから取り出したタイトルと場所をbookInformationに格納
export function getBookData(): Array<any>{
    let spreadSheet: any = SpreadsheetApp.openById(process.env.SPREAD_SHEET_id);
    let sheet:any = spreadSheet.getSheetByName('library');
    let columnAVals: any = sheet.getRange('A:A').getValues();
    let lastRow: number = columnAVals.filter(String).length;
    let startNum: number = 3;
    let bookInformation: any[] = [];
    for(let i = startNum; i <= lastRow; i++){
      bookInformation.push({});
      bookInformation[i-startNum].name = sheet.getRange(i, 2).getValue();
      bookInformation[i-startNum].place = sheet.getRange(i, 4).getValue();
    };

    return bookInformation;
}

// 検索条件に合致したタイトルと場所をsearchedBookInformationに格納
export function searchBookData(keyWord: string, keyPlace: string, bookInformation: Array<any>): Object{
    let searchingBookTitle: string = keyWord;
    let searchingBookPlace: string = keyPlace;
    let searchedBookInformation: any[] = [];
    if(searchingBookPlace !== "unselected"){
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
export function throwPurchaseRequest(title: string, place: string, purchaser: string, remarks: string): void{
    let spreadSheet: any = SpreadsheetApp.openById(process.env.SPREAD_SHEET_id);
    let sheet:any = spreadSheet.getSheetByName('library');
    let columnIVals: any = sheet.getRange('J:J').getValues();
    let lastRow: string = columnIVals.filter(String).length;
    sheet.getRange(lastRow+1, 10).setValue(title);
    sheet.getRange(lastRow+1, 11).setValue(place);
    sheet.getRange(lastRow+1, 12).setValue(purchaser);
    sheet.getRange(lastRow+1, 13).setValue(remarks);
}
