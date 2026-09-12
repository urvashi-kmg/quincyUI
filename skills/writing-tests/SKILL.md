# Writing Tests

**When to use:** Ensuring code correctness, preventing regressions, and validating user workflows.

## Trigger Conditions

- Adding a utility function or custom hook
- Building a complex component or form
- Implementing a critical user flow (login, create quote, submit endorsement)
- Before opening a PR (all tests must pass)

## Test Types

This project uses **three types of tests**:

1. **Unit Tests (Vitest)** — Test individual functions, hooks, utilities in isolation
2. **Component Tests (Playwright CT)** — Test React components with user interactions
3. **E2E Tests (Playwright)** — Test full user workflows across the entire application

**Coverage Minimum:** 70% lines, functions, branches, statements

## Unit Tests (Vitest)

### Creating a Unit Test

Create `tests/unit/utils/formatters.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate, formatCurrency, formatStatus } from '@/utils/formatters'

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format a date string to readable format', () => {
      const result = formatDate('2026-01-15')
      expect(result).toBe('January 15, 2026')
    })

    it('should handle invalid dates', () => {
      expect(() => formatDate('invalid')).toThrow()
    })

    it('should handle null/undefined', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency with USD symbol', () => {
      const result = formatCurrency(1234.56)
      expect(result).toBe('$1,234.56')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-500)).toBe('-$500.00')
    })
  })
})
```

### Testing Hooks

Create `tests/unit/hooks/useBreakpoint.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBreakpoint } from '@/hooks/useBreakpoint'

describe('useBreakpoint', () => {
  // Mock window.matchMedia
  beforeEach(() => {
    const matchMediaMock = (query: string) => ({
      matches: query === '(max-width: 640px)', // Simulate mobile
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })
    window.matchMedia = vi.fn(matchMediaMock as any)
  })

  it('should return isMobile=true on small screens', () => {
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current.isMobile).toBe(true)
  })

  it('should return isTablet=false on small screens', () => {
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current.isTablet).toBe(false)
  })
})
```

### Testing Redux Selectors

Create `tests/unit/redux/selector.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { selectQuoteListPermissions } from '@/redux/selector'
import type { RootState } from '@/redux/store'

describe('Redux Selectors', () => {
  describe('selectQuoteListPermissions', () => {
    it('should return permissions from user state', () => {
      const mockState = {
        userInfo: {
          data: {
            userPermissions: [
              { permissionValue: 'VIEW_QUOTES' },
              { permissionValue: 'CREATE_QUOTE' },
            ],
          },
        },
      } as any as RootState

      const permissions = selectQuoteListPermissions(mockState)

      expect(permissions.canViewQuotes).toBe(true)
      expect(permissions.canCreateQuote).toBe(true)
      expect(permissions.canEditQuote).toBe(false) // Not in the list
    })

    it('should handle empty permissions', () => {
      const mockState = {
        userInfo: { data: { userPermissions: [] } },
      } as any as RootState

      const permissions = selectQuoteListPermissions(mockState)

      expect(permissions.canViewQuotes).toBe(false)
      expect(permissions.canCreateQuote).toBe(false)
    })

    it('should handle null user data', () => {
      const mockState = {
        userInfo: { data: null },
      } as any as RootState

      const permissions = selectQuoteListPermissions(mockState)

      expect(permissions.canViewQuotes).toBe(false)
    })
  })
})
```

### Running Unit Tests

```bash
npm run test:unit           # Run once
npm run test:unit:watch    # Watch mode
npm run test:unit:coverage # Coverage report
```

## Component Tests (Playwright CT)

### Creating a Component Test

Create `tests/ct/domains-quotes-components-MyForm.spec.ts`:

```typescript
import { test, expect } from '@playwright/experimental-ct-react'
import { MyForm } from '@/features/quotes/components/MyForm'

test.describe('MyForm', () => {
  test('should render the form with all fields', async ({ mount }) => {
    const component = await mount(<MyForm onSuccess={() => {}} />)

    // Check that all fields are present
    await expect(component.locator('input[name="firstName"]')).toBeVisible()
    await expect(component.locator('input[name="email"]')).toBeVisible()
    await expect(component.locator('select[name="policyType"]')).toBeVisible()
  })

  test('should show validation errors for required fields', async ({ mount }) => {
    const component = await mount(<MyForm onSuccess={() => {}} />)

    // Try to submit without filling fields
    await component.locator('button:has-text("Submit")').click()

    // Validation errors should appear
    await expect(component.locator('text=First name is required')).toBeVisible()
    await expect(component.locator('text=Email is required')).toBeVisible()
  })

  test('should show conditional field based on policy type', async ({ mount }) => {
    const component = await mount(<MyForm onSuccess={() => {}} />)

    // Business name field should not be visible by default (personal policy)
    await expect(component.locator('input[name="businessName"]')).not.toBeVisible()

    // Change to commercial
    await component.locator('select[name="policyType"]').selectOption('commercial')

    // Business name field should now be visible
    await expect(component.locator('input[name="businessName"]')).toBeVisible()
  })

  test('should submit the form with valid data', async ({ mount }) => {
    let submittedData: any = null

    const component = await mount(
      <MyForm
        onSuccess={() => {
          submittedData = 'success'
        }}
      />
    )

    // Fill all fields
    await component.locator('input[name="firstName"]').fill('John')
    await component.locator('input[name="email"]').fill('john@example.com')
    await component.locator('select[name="policyType"]').selectOption('personal')
    await component.locator('input[name="driverCount"]').fill('2')

    // Submit
    await component.locator('button:has-text("Submit")').click()

    // Assert success (wait for success callback or message)
    await expect(component.locator('text=Success')).toBeVisible()
  })

  test('should disable submit button while submitting', async ({ mount }) => {
    const component = await mount(<MyForm onSuccess={() => {}} />)

    // Fill form
    await component.locator('input[name="firstName"]').fill('John')
    await component.locator('input[name="email"]').fill('john@example.com')

    // Click submit
    const submitBtn = component.locator('button:has-text("Submit")')
    await submitBtn.click()

    // Button should be disabled during submission
    await expect(submitBtn).toBeDisabled()
  })
})
```

### Testing with Redux Store

```typescript
import { test, expect } from '@playwright/experimental-ct-react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { QuoteListPage } from '@/features/quotes/QuoteListPage'

test.describe('QuoteListPage', () => {
  test('should render the page within Redux context', async ({ mount }) => {
    const component = await mount(
      <Provider store={store}>
        <QuoteListPage />
      </Provider>
    )

    // Assertions
    await expect(component.locator('text=Quotes')).toBeVisible()
  })
})
```

### Running Component Tests

```bash
npm run test:ui        # Interactive UI mode
npm run test           # Headless run with results
```

## E2E Tests (Playwright)

### Creating an E2E Test

Create `tests/e2e/quotes.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Quotes Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('http://localhost:5173')
  })

  test('user can create a quote', async ({ page }) => {
    // Login
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button:has-text("Login")')

    // Wait for dashboard to load
    await page.waitForURL('**/dashboard')

    // Navigate to quotes
    await page.click('a:has-text("Quotes")')
    await page.waitForURL('**/quotes')

    // Click "New Quote"
    await page.click('button:has-text("New Quote")')

    // Fill out quote form
    await page.fill('input[name="insuredName"]', 'John Doe')
    await page.selectOption('select[name="lob"]', 'commercial-auto')
    await page.click('button:has-text("Next")')

    // Complete additional steps
    await page.fill('input[name="addressLine1"]', '123 Main St')
    await page.click('button:has-text("Submit")')

    // Verify success
    await expect(page.locator('text=Quote created successfully')).toBeVisible()
    await page.waitForURL('**/quotes')
  })

  test('user can edit an existing quote', async ({ page }) => {
    // Login and navigate to quotes
    await page.goto('http://localhost:5173/quotes')
    await page.waitForLoadState('networkidle')

    // Click first quote's edit button
    await page.click('table tr:first-child button:has-text("Edit")')

    // Modify a field
    await page.fill('input[name="insuredName"]', 'Jane Doe')
    await page.click('button:has-text("Save")')

    // Verify success
    await expect(page.locator('text=Quote updated')).toBeVisible()
  })

  test('permission denial is handled gracefully', async ({ page }) => {
    // Login as user without quote creation permission
    // (Assuming mock API or test account setup)
    
    await page.goto('http://localhost:5173/quotes')
    
    // "New Quote" button should not be visible or should be disabled
    const newQuoteBtn = page.locator('button:has-text("New Quote")')
    
    // Either button is hidden or disabled
    const isHidden = await newQuoteBtn.isHidden()
    const isDisabled = await newQuoteBtn.isDisabled()
    
    expect(isHidden || isDisabled).toBe(true)
  })

  test('error messages are displayed on API failure', async ({ page }) => {
    await page.goto('http://localhost:5173/quotes/new')

    // Fill minimal form
    await page.fill('input[name="insuredName"]', 'John')

    // Mock API error
    await page.route('**/api/v1/policy/CreateQuote', route =>
      route.abort('failed')
    )

    // Try to submit
    await page.click('button:has-text("Submit")')

    // Error message should appear
    await expect(page.locator('text=Failed to create quote')).toBeVisible()
  })
})
```

### Running E2E Tests

```bash
npm run test:e2e       # Headless
npm run test:e2e:ui    # Interactive UI
```

## Best Practices

### 1. Test Naming

Use descriptive names that explain the behavior:
```typescript
// ✅ Good
it('should show validation error when email is invalid')
it('should disable submit button while submitting')

// ❌ Bad
it('validates email')
it('button state')
```

### 2. Arrange-Act-Assert (AAA) Pattern

```typescript
it('should filter quotes by status', () => {
  // Arrange
  const quotes = [
    { id: 1, status: 'draft' },
    { id: 2, status: 'active' },
  ]
  
  // Act
  const filtered = quotes.filter(q => q.status === 'active')
  
  // Assert
  expect(filtered).toHaveLength(1)
  expect(filtered[0].id).toBe(2)
})
```

### 3. Mock External Dependencies

```typescript
import { vi } from 'vitest'

it('should handle API errors', async () => {
  // Mock the API call
  const mockApi = vi.fn().mockRejectedValue(new Error('Network error'))
  
  // Test error handling
  const result = await errorHandler(mockApi)
  expect(result).toBe('error')
})
```

### 4. Avoid Testing Implementation Details

```typescript
// ❌ Bad — testing how, not what
it('should call setQuotes twice', () => {
  expect(setQuotes).toHaveBeenCalledTimes(2)
})

// ✅ Good — testing the outcome
it('should display quotes after loading', async ({ mount }) => {
  const component = await mount(<QuoteList />)
  await expect(component.locator('table tbody tr')).toHaveCount(3)
})
```

## Debugging Tests

**Run tests in headed mode (see browser):**
```bash
npx playwright test --headed
```

**Debug a single test:**
```bash
npx playwright test --debug tests/e2e/quotes.spec.ts
```

**Generate coverage report:**
```bash
npm run test:unit:coverage
```

## Do / Don't

✅ **Do:**
- Test user-facing behavior, not implementation
- Use `beforeEach` to set up common test state
- Mock network calls and external APIs
- Write descriptive test names
- Keep tests focused on one behavior per test
- Run full test suite before opening PR

❌ **Don't:**
- Test library code (React, Formik, etc.)
- Mock internal state if you can test via UI
- Write overly brittle assertions (e.g., exact text matches)
- Skip tests "because it's obvious"
- Test every line of code (aim for 70%+ coverage, not 100%)

## Coverage Requirements

```bash
npm run test:unit:coverage
```

Reports coverage for:
- **Lines:** 70%+
- **Functions:** 70%+
- **Branches:** 70%+
- **Statements:** 70%+

Failing to meet these targets will block merge.

## Example Files

- [formatters.test.ts](../../tests/unit/utils/formatters.test.ts) — Unit test example
- [useBreakpoint.test.ts](../../tests/unit/hooks/useBreakpoint.test.ts) — Hook testing
- [quotes.spec.ts](../../tests/e2e/quotes.spec.ts) — E2E workflow testing
