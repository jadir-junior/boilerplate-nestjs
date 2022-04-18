import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { deleteUserOnDataBaseForEmail } from './test-utils';

interface ICreateAdmin {
  email?: string;
  name?: string;
  password?: string;
  passwordConfirmation?: string;
}

interface IResponseError {
  statusCode: number;
  message: string | string[];
  error: string;
}

describe('Users (e2e)', () => {
  let app: INestApplication;

  const admin: ICreateAdmin = {
    email: 'admin@email.com',
    name: 'Admin',
    password: '123456',
    passwordConfirmation: '123456',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    deleteUserOnDataBaseForEmail('admin@email.com');
    await app.init();
  });

  describe('User Admin', () => {
    it('/ (POST) try create user with password incorrect', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...admin, ...{ passwordConfirmation: 'password-incorrect' } });

      expect(response.status).toBe(422);
      expect(response.body).toEqual<IResponseError>({
        statusCode: 422,
        message: "Passwords don't match",
        error: 'Unprocessable Entity',
      });
    });

    it('/ (POST) try create user without an email', async () => {
      const adminWithoutEmail = { ...admin };
      delete adminWithoutEmail.email;

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(adminWithoutEmail);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'Email address must be less than 200 characters',
          'Provide an email address valid',
          'Provide an email address',
        ],
        error: 'Bad Request',
      });
    });

    it('/ (POST) try create user with an email invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...admin,
          ...{ email: 'emailinvalid' },
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['Provide an email address valid'],
        error: 'Bad Request',
      });
    });

    it('/ (POST) try create user with an email greather than 200 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...admin,
          ...{
            email:
              'thisisemailisinvalidandnothavepassbecausethatemailhavemmorethan200charactersandthatbrokenthetableondatabaseandisnotgoodtoperformanceandidontknowmorewhatiwriteinthisemailtohave200characters@email.com.br',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'Email address must be less than 200 characters',
          'Provide an email address valid',
        ],
        error: 'Bad Request',
      });
    });

    it('/ (POST) create user admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(admin);

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
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(admin);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        statusCode: 409,
        message: 'Email address already exists',
        error: 'Conflict',
      });
    });

    it('/ (POST) try create user without an name', async () => {
      const adminWithoutName = { ...admin };
      delete adminWithoutName.name;

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(adminWithoutName);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'User name must be less than 200 characters',
          'Provide an user name',
        ],
        error: 'Bad Request',
      });
    });

    it('/ (POST) try create user with a name greather than 200 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...admin,
          ...{
            name: 'thisnameisanameinvalidwithmorethan200charactersandIneedcreateanamewithmorethan200characterswithisveryverylongnamewithoutspaceorcharactersspecialwtfIdontknowmorewhatIwriteonthetextoftestthatnamewhatthehell',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['User name must be less than 200 characters'],
        error: 'Bad Request',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
