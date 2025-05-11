export const mockUserResponse = {
  id: 123456789,
  email: 'mock@user.com',
  firstName: 'mock',
  lastName: 'user',
  isActive: true,
  role: 'CUSTOMER',
};

export const mockUserLoginResponse = {
  user: mockUserResponse,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};
