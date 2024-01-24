import { AuthRpcGuard } from './rpc.guard';

describe('AuthRpcGuard', () => {
  it('should be defined', () => {
    expect(new AuthRpcGuard()).toBeDefined();
  });
});
