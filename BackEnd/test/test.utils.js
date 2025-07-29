const { expect } = require('chai');
const { generateOtp, isOtpExpired } = require('../utils/utils');

describe('OTP Functions', () => {
  it('should generate a 4-digit OTP string', () => {
    const otp = generateOtp();
    expect(otp).to.be.a('string');
    expect(otp).to.have.lengthOf(4);
    expect(Number(otp)).to.be.within(1000, 9999);
  });

  it('should detect expired OTP correctly', () => {
    const expiredTime = Date.now() - 1000;
    const futureTime = Date.now() + 10000;
    expect(isOtpExpired(expiredTime)).to.be.true;
    expect(isOtpExpired(futureTime)).to.be.false;
  });
});

