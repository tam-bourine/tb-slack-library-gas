
import {getBookData} from '../src/index';

SpreadsheetApp: jest.fn(() => ({
    openbyId: jest.fn(() => (
        {
            getSheetByName: jest.fn(() => (
                {
                    getRange: jest.fn(() => (
                        {
                            getValues: jest.fn(() => [
                                ['1'],
                                ['2'],
                                ['3'],
                                ['4'],
                            ]),
                        }
                    )),
                }
            )),
        }
    ))
})) as any

SpreadsheetApp: jest.fn(() => ({
    openbyId: jest.fn(() => (
        {
            getSheetByName: jest.fn(() => (
                {
                    getRange: jest.fn(() => (
                        {
                            getValue: jest.fn(() => [
                                ['デザイン'],
                                ['ジョブ'],
                            ]),
                        }
                    )),
                }
            )),
        }
    ))
})) as any

SpreadsheetApp = jest.fn(() => ({
    openbyId: jest.fn(() => (
        {
            getSheetByName: jest.fn(() => (
                {
                    getRange: jest.fn(() => (
                        {
                            getValue: jest.fn(() => [
                                ['東京'],
                                ['大阪'],
                            ]),
                        }
                    )),
                }
            )),
        }
    ))
})) as any


describe('getBookData', () => {
    it('本の情報を取ってこれる', () => {
        const bookInformation = getBookData();
        expect(bookInformation[0].name).toBe('デザイン')
        expect(bookInformation[0].place).toBe('東京')
        expect(bookInformation[1].name).toBe('ジョブ')
        expect(bookInformation[1].place).toBe('大阪')
    });
});
