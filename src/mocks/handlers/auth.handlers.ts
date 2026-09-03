import { http, HttpResponse } from 'msw';

// Fixed mock credentials for local development only — has no effect once
// VITE_ENABLE_MOCKS is unset and requests hit a real gateway.
const MOCK_USER = {
  id: 'u1',
  name: 'Test User',
  email: 'test@quincy.dev',
  roles: ['agent'],
};
const MOCK_PASSWORD = 'password123';
const MOCK_TOKEN = 'mock-dev-token';

export const authHandlers = [
  http.post('*/POC13/QuincyGateway/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email !== MOCK_USER.email || body.password !== MOCK_PASSWORD) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    return HttpResponse.json({ user: MOCK_USER, token: MOCK_TOKEN });
  }),

  http.get('*/POC13/QuincyGateway/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${MOCK_TOKEN}`) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(MOCK_USER);
  }),

  http.post('*/POC13/QuincyGateway/auth/logout', () => new HttpResponse(null, { status: 204 })),
];
