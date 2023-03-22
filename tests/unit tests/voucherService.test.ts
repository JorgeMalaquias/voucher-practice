import voucherService from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";
import { jest } from '@jest/globals';

describe('voucher service suite', () => {
    it('should throw an error when try to use a voucher that does not exist', async () => {
        const code = 'some random string';
        const amount = 100;
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
        expect(async () => {

            await voucherService.applyVoucher(code, amount)
        }).rejects.toStrictEqual(
            {
                type: "conflict",
                message: "Voucher does not exist."
            }
        );
    })
    it('should not apply a voucher that has been already used', async () => {
        const code = 'some random string';
        const amount = 101;
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce({
            id: 1,
            code,
            discount: Math.random() * 100,
            used: true
        });
        const result = await voucherService.applyVoucher(code, amount);
        expect(result.applied).toBe(false);
    })
    it('should not apply a voucher in a purchase below the minimum value', async () => {
        const code = 'some random string';
        const amount = 99;
        const voucher = {
            id: 1,
            code,
            discount: Math.random() * 100,
            used: true
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
        jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(voucher);
        const result = await voucherService.applyVoucher(code, amount);
        expect(result.applied).toBe(false);
    })
    it('should apply a voucher that has not been used yet and on a purchase with a valid value', async () => {
        const code = 'some random string';
        const amount = 100;
        const voucher = {
            id: 1,
            code,
            discount: Math.random() * 100,
            used: false
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
        jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(voucher);
        const result = await voucherService.applyVoucher(code, amount);
        expect(result.applied).toBe(true);
    })



    it('should throw an error when try to create a voucher with a code that is already being used', async () => {
        const code = 'some random string';
        const discount = Math.random() * 100;
        const voucher = {
            id: 1,
            code,
            discount: Math.random() * 100,
            used: true
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
        expect(async () => await voucherService.createVoucher(code, discount)).rejects.toStrictEqual({
            type: "conflict",
            message: "Voucher already exist."
        })
    })
    it('should create a voucher ', async () => {
        const code = 'some random string';
        const discount = Math.random() * 100;

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
        jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { });

        await voucherService.createVoucher(code, discount);

        expect(voucherRepository.createVoucher).toBeCalled();
    })
})