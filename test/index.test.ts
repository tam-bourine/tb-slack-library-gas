
import { getBookData, searchBookData }  from '../src/index';

SpreadsheetApp.openById = jest.fn(() => ({
    getSheetByName: jest.fn(() => (
        {
            getRange: jest.fn(() => (
                {
                    getValues: jest.fn(() => [['デザインを学ぶ'],['採用基準']])
                }
            ))
        }
    ))
})) as any;

describe('getBookData関数の挙動', () => {
    it('配列にきちんと格納できる', () => {
        const bookInformationList = getBookData();
        expect(bookInformationList).toHaveLength(2)
    })
});


const books = [
    {name: 'デザインを学ぶ', place: '東京'},
    {name: 'デザインを学ぶ', place: '大阪'},
    {name:'採用基準', place: '東京'}
]

describe('searchBookData関数の挙動', () => {
    it('タイトル: 完全一致 場所: 一致', () => {
        expect(searchBookData('採用基準', '東京', books)).toEqual(
                {
                    "result": [{name: '採用基準', place: '東京'}]
                }
        )
    }),
    it('タイトル: 部分一致 場所: 一致', () => {
        expect(searchBookData('採用', '東京', books)).toEqual(
                {
                    "result": [{name: '採用基準', place: '東京'}]
                }
        )
    }),
    it('タイトル: 一致 場所: 部分一致', () => {
        expect(searchBookData('デザインを学ぶ', '東京', books)).toEqual(
                {
                    "result": [{name: 'デザインを学ぶ', place: '東京'}]
                }
        )
    }),
    it('タイトル: 一致 場所: 指定しない', () => {
        expect(searchBookData('デザインを学ぶ', 'unselected', books)).toEqual(
                {
                    "result": [{name: 'デザインを学ぶ', place: '東京'},
                               {name: 'デザインを学ぶ', place: '大阪'}]
                }
        )
    }),
    it('タイトル: 一致 場所: 不一致', () => {
        expect(searchBookData('採用基準', '大阪', books
            )).toEqual(
                {
                    "result": []
                }
        )
    }),
    it('タイトル: 不一致', () => {
        expect(searchBookData('hoge', '大阪', books)).toEqual(
                {
                    "result": []
                }
        )
    })
})
