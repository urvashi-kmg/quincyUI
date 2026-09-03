import { http, HttpResponse } from 'msw';

import type { Quote } from '@features/quotes';

const mockQuotes: Quote[] = [
  {
    id: 'q1',
    quoteNumber: 'Q-100234',
    applicantName: 'Jordan Blake',
    productLine: 'auto',
    premium: 1180,
    status: 'quoted',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'q2',
    quoteNumber: 'Q-100235',
    applicantName: 'Priya Natarajan',
    productLine: 'home',
    premium: 2340,
    status: 'draft',
    createdAt: '2026-08-02T14:30:00Z',
  },
];

export const quotesHandlers = [
  http.get('*/POC13/QuincyGateway/quotes', () => HttpResponse.json(mockQuotes)),
  http.get('*/POC13/QuincyGateway/quotes/:id', ({ params }) => {
    const quote = mockQuotes.find((q) => q.id === params.id);
    return quote ? HttpResponse.json(quote) : new HttpResponse(null, { status: 404 });
  }),
];
