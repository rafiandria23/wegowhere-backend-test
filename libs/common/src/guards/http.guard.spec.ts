import { AuthHttpGuard } from './http.guard';

describe('AuthHttpGuard', () => {
  it('should be defined', () => {
    expect(new AuthHttpGuard()).toBeDefined();
  });
});
