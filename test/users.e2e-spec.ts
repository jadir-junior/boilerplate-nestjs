import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { User } from '../src/users/user.entity';
import { clearRegisterOnTable } from './test-utils';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    clearRegisterOnTable(User, 'email = :email', { email: 'admin@email.com' });
    await app.init();
  });

  describe('User Admin', () => {
    it('/ (POST) try create user with password incorrect', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'admin@email.com',
        name: 'Admin',
        password: '123456',
        passwordConfirmation: 'password-incorrect',
      });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        statusCode: 422,
        message: "Passwords don't match",
        error: 'Unprocessable Entity',
      });
    });

    it('/ (POST) create user admin', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'admin@email.com',
        name: 'Admin',
        password: '123456',
        passwordConfirmation: '123456',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        email: 'admin@email.com',
        name: 'Admin',
        role: 'ADMIN',
        status: true,
        confirmationToken: expect.any(String),
        recoverToken: null,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('/ (POST) tried create a user with the same email', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'admin@email.com',
        name: 'Admin',
        password: '123456',
        passwordConfirmation: '123456',
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        statusCode: 409,
        message: 'Email address already exists',
        error: 'Conflict',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
