import voucherService from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";
import { jest } from '@jest/globals';

describe('voucher service suite', () => {
    it('should throw an error when try to use a voucher that does not exist', async () => {
        const code = 'some random string';
        const amount = 100;
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
        expect(async () => await voucherService.applyVoucher(code, amount)).toThrow();
        //const result = voucherService.
    })
})