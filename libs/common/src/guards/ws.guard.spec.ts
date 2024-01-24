import { AuthWsGuard } from './ws.guard';

describe('WsGuard', () => {
  it('should be defined', () => {
    expect(new AuthWsGuard()).toBeDefined();
  });
});
