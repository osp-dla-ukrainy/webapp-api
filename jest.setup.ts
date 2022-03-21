import 'reflect-metadata';
import { clearSchema } from './test/init.test';

jest.setTimeout(15000);

afterAll(async () => {
  await clearSchema();
});
