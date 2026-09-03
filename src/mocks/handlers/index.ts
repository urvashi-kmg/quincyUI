import { authHandlers } from './auth.handlers';
import { quotesHandlers } from './quotes.handlers';

export const handlers = [...authHandlers, ...quotesHandlers];
