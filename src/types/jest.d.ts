import '@types/jest';

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any> {
      (...args: Y): T;
    }
  }
}

export {}; 