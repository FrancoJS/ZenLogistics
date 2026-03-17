import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { LoginUserDto } from './login-user.dto';
import { validate } from 'class-validator';

describe('LoginUserDto', () => {
  describe('Email validation and transformation', () => {
    it.each([
      {
        description:
          'should trim and lowercase email and validate successfully',
        payload: { email: ' Admin@ExamplE.Com ', password: 'StrongPassword1!' },
        expectedEmail: 'admin@example.com',
        expectedError: null,
      },
      {
        description: 'should fail when email format is invalid',
        payload: { email: 'invalid-email', password: 'StrongPassword1!' },
        expectedEmail: 'invalid-email',
        expectedError: 'isEmail',
      },
      {
        description: 'should fail when email is empty after trim',
        payload: { email: '    ', password: 'StrongPassword1!' },
        expectedEmail: '',
        expectedError: 'isNotEmpty',
      },
      {
        description: 'should fail when email is not a string',
        payload: { email: 12345, password: 'StrongPassword1!' },
        expectedEmail: 12345,
        expectedError: 'isEmail',
      },
    ])('$description', async ({ payload, expectedEmail, expectedError }) => {
      const dto = plainToInstance(LoginUserDto, payload);
      const errors = await validate(dto);
      expect(dto.email).toBe(expectedEmail);
      if (expectedError) {
        const emailError = errors.find((e) => e.property === 'email');
        expect(emailError).toBeDefined();
        expect(emailError!.constraints).toHaveProperty(expectedError);
      } else {
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('Password validation (Atomic cases)', () => {
    it.each([
      {
        description: 'should validate a strong password successfully',
        payload: { email: 'admin@example.com', password: 'StrongPassword1!' },
        expectedError: null,
      },
      {
        description: 'should fail when password has less than 8 characters',
        payload: { email: 'admin@example.com', password: 'Short1!' },
        expectedError: 'isStrongPassword',
      },
      {
        description: 'should fail when password has no lowercase letters',
        payload: { email: 'admin@example.com', password: 'STRONGPASSWORD1!' },
        expectedError: 'isStrongPassword',
      },
      {
        description: 'should fail when password has no uppercase letters',
        payload: { email: 'admin@example.com', password: 'strongpassword1!' },
        expectedError: 'isStrongPassword',
      },
      {
        description: 'should fail when password has no numbers',
        payload: { email: 'admin@example.com', password: 'StrongPassword!' },
        expectedError: 'isStrongPassword',
      },
      {
        description:
          'should fail when password has no symbols/special characters',
        payload: { email: 'admin@example.com', password: 'StrongPassword1' },
        expectedError: 'isStrongPassword',
      },
      {
        description: 'should fail when password is empty',
        payload: { email: 'admin@example.com', password: '' },
        expectedError: 'isNotEmpty',
      },
      {
        description: 'should fail when password is not a string',
        payload: { email: 'admin@example.com', password: 12345678 },
        expectedError: 'isString',
      },
    ])('$description', async ({ payload, expectedError }) => {
      const dto = plainToInstance(LoginUserDto, payload);
      const errors = await validate(dto);
      if (expectedError) {
        const passwordError = errors.find((e) => e.property === 'password');
        expect(passwordError).toBeDefined();
        expect(passwordError!.constraints).toHaveProperty(expectedError);
      } else {
        const passwordError = errors.find((e) => e.property === 'password');
        expect(passwordError).toBeUndefined();
      }
    });
  });
});
