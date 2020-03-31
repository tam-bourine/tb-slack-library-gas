// 検索結果のレスポンス処理
export function doPost(e: any): any{
    const params: any = JSON.parse(e.postData.getDataAsString());
    if(params.key){
        return postSearchedBookList(params.key, params.place);
    } else {
        throwPurchaseRequest(params.reqTitle, params.reqPlace, params.reqUser, params.reqAbout, params.reqIsbn);
    }
    let throwPurchaseRequestData = ContentService.createTextOutput();
    throwPurchaseRequestData = throwPurchaseRequestData.setMimeType(ContentService.MimeType.JAVASCRIPT);
    throwPurchaseRequestData = throwPurchaseRequestData.setContent(JSON.stringify(retUrl(params.reqIsbn)));
    return throwPurchaseRequestData
}

// 検索に合致した本を返す
export function postSearchedBookList(title: string, place: string){
    const searchedBookList: Object = searchBookData(
        title,
        place, 
        getBookData()
    )
    let searchResult: any = ContentService.createTextOutput();
    searchResult = searchResult.setMimeType(ContentService.MimeType.JAVASCRIPT);
    searchResult = searchResult.setContent(JSON.stringify(searchedBookList));

    return searchResult
}

// スプレッドシートを開いて本のタイトルと場所を取得して返す
export function bookDataSpreadSheet(id: string, name: string): Array<Array<string>>{
    const spreadSheet: any = SpreadsheetApp.openById(id);
    const sheet:any = spreadSheet.getSheetByName(name);
    const columnAVals: any = sheet.getRange('A:A').getValues(); // A列で値が入っている最後の行
    const lastRow: number = columnAVals.filter(String).length;
    const titles: Array<string> = sheet.getRange(3,2,lastRow-2).getValues(); // B列の値を取る(1,2行目はヘッダー) 
    const places: Array<string> = sheet.getRange(3,3,lastRow-2).getValues(); // C列の値を取る(1,2行目はヘッダー) 

    return [titles, places]
}

// スプレッドシートから取り出したタイトルと場所をbookInformationListに格納して返す
export function getBookData(): Array<{[key: string]: string}>{
    const [titles, places]: Array<Array<string>> = bookDataSpreadSheet('<スプレッドシートID>', '<シート名>')
    const bookInformationList: Array<{[key: string]: string}> = [];
    const bookNum: number = titles.length;
    for(let i = 0; i < bookNum; i++){
        bookInformationList.push(
            {
                name: titles[i][0],
                place: places[i][0]
            }
        )
    }
    
    return bookInformationList;
}

// 検索条件に合致したタイトルと場所をsearchedBookInformationで返す
export function searchBookData(keyWord: string, keyPlace: string, bookInformationList: Array<{[key: string]: string}>): {[key: string]: Array<{[key: string]: string}>}{
    const searchingBookTitle: string = keyWord;
    const searchingBookPlace: string = keyPlace;
    const searchedBookInformationList: any[] = bookInformationList.filter(
        _book => {
            if(_book.name.indexOf(searchingBookTitle) == -1){
                return false
            }
            if(searchingBookPlace === "unselected"){
                return true
            }else{
                if(_book.place.indexOf(searchingBookPlace) == -1){
                    return false
                }else{
                    return true
                }
            }
        }
    );

    return {
        result: searchedBookInformationList
    }
}

// 購入依頼をスプレッドシートに記載
export function throwPurchaseRequest(title: string, place: string, purchaser: string, remarks: string, isbn:string): void{
    const spreadSheet: any = SpreadsheetApp.openById('<スプレッドシートID>');
    const sheet:any = spreadSheet.getSheetByName('<シート名>');
    const columnIVals: any = sheet.getRange('J:J').getValues(); 
    const lastRow: string = columnIVals.filter(String).length; // J列で値が入っている最後の行
    const data: Array<Array<string>> = [[title, place, purchaser, remarks, isbn]]
    sheet.getRange(lastRow+1, 10, 1, 5).setValues(data); // J~N列に記載
}

//楽天APIから本のISBNから画像リンクに変換(ISBNカラム6→画像データカラム7)
function getImage(){
    // アクティブなセルの情報を取得
    const spreadSheet: any = SpreadsheetApp.openById('<スプレッドシートID>');
    const sheet:any = spreadSheet.getSheetByName('<シート名>');
    const rng = sheet.getActiveCell();
    // アクティブなセルの値
    let isbn = rng.getValue();
    //編集されたカラムを取得
      const row = rng.getRow();
    //編集されたカラムが6じゃない時終了
    if (rng.getColumn() !== 6 && rng.getColumn() !== 13) return;
    if( rng.getColumn() === 13){
      const imageUrl = GetBookImage(isbn)
      fillSheet14(imageUrl, row)
    }
    else{
      const imageUrl = GetBookImage(isbn)
      fillSheet7(imageUrl, row)
    }
}

//画像データをカラム7に入れる
function fillSheet7(imageUrl, row){
    const spreadSheet: any = SpreadsheetApp.openById('<スプレッドシートID>');
    const sheet:any = spreadSheet.getSheetByName('<シート名>');
    sheet.getRange(row, 7).setValue(imageUrl)
}

//ISBNから画像データを返してあげる
function GetBookImage(reqIsbn){
    let isbn = reqIsbn
    //ISBNコードにハイフン付きで入力された場合、削除
    if(String(isbn).indexOf("-") > -1){
      isbn = isbn.split("-").join("")
    }
    let url = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=<アプリケーションID>&isbn="+isbn
    let response = UrlFetchApp.fetch(url);
    let infoJson=JSON.parse(response.getContentText());
    let imageUrl = infoJson.Items[0].Item.mediumImageUrl;
    return imageUrl
}

//画像データをオブジェクトにする
function retUrl(reqIsbn){
    const imageUrl = GetBookImage(reqIsbn)
    return {
      image:imageUrl
    }
}

//画像データをカラム14に入れる
function fillSheet14(imageUrl, row){
    const spreadSheet: any = SpreadsheetApp.openById('<スプレッドシートID>');
    const sheet:any = spreadSheet.getSheetByName('<シート名>');
    sheet.getRange(row, 14).setValue(imageUrl)
}
