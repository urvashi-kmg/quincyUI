# Permission-Driven UI

**When to use:** Building user-facing features that are gated by granular permissions (show/hide buttons, disable actions, render different UI based on what the logged-in user is allowed to do).

## Trigger Conditions

- Building a feature where some users can perform an action (create, edit, delete, view, export) and others cannot
- Different user roles see different UI (admin sees more options than agent)
- An action button should be hidden or disabled based on the user's permissions

## How Permissions Work

1. **Backend** authenticates the user and returns a list of permissions (e.g., `VIEW_QUOTES`, `CREATE_QUOTE`, `EDIT_QUOTE`)
2. **Frontend** stores these permissions in Redux during login (in `authSlice`)
3. **Components** read permissions via Redux selectors and render conditionally

## Step-by-Step

### 1. Add Permission Names to Redux Selector

Open `src/redux/selector.ts` and create a selector for your feature:

```typescript
import { RootState } from '@/redux/store'

// Example: permissions for the Quotes feature
export const selectQuoteListPermissions = (state: RootState) => {
  const userPerms = state.userInfo.data?.userPermissions ?? []
  
  // Create a map for faster lookup
  const permMap = new Map(userPerms.map(p => [p.permissionValue, p]))

  return {
    // Query: can the user view the quotes list?
    canViewQuotes: permMap.has('VIEW_QUOTES'),
    
    // Commands: can the user perform actions?
    canCreateQuote: permMap.has('CREATE_QUOTE'),
    canEditQuote: permMap.has('EDIT_QUOTE'),
    canDeleteQuote: permMap.has('DELETE_QUOTE'),
    canIssueFromQuote: permMap.has('ISSUE_QUOTE'),
    canCopyQuote: permMap.has('COPY_QUOTE'),
    canChangeTransaction: permMap.has('CHANGE_TRANSACTION'),
    canDeleteTransaction: permMap.has('DELETE_TRANSACTION'),
    
    // Special: inquiry-only access (can view but not modify)
    canInquiryOnly: permMap.has('INQUIRY_ONLY_ACCESS'),
  }
}
```

### 2. Use Permissions in Components

**Hide/show UI based on permissions:**

```typescript
import { useSelector } from 'react-redux'
import { selectQuoteListPermissions } from '@/redux/selector'
import { Button } from '@/components/controls/form/Button'

export function QuoteListPage() {
  const permissions = useSelector(selectQuoteListPermissions)
  const { canViewQuotes, canCreateQuote } = permissions

  // Hide entire page if no view permission
  if (!canViewQuotes) {
    return <EmptyState title="Access Denied" description="You don't have permission to view quotes." />
  }

  return (
    <div>
      <h1>Quotes</h1>

      {/* Show "New Quote" button only if user has permission */}
      {canCreateQuote && (
        <Button onClick={handleCreateQuote}>New Quote</Button>
      )}

      {/* Otherwise show an info message */}
      {!canCreateQuote && (
        <p className="text-sm text-slate-400">You don't have permission to create quotes.</p>
      )}
    </div>
  )
}
```

**Disable buttons based on permissions:**

```typescript
export function QuoteRow({ quote }) {
  const permissions = useSelector(selectQuoteListPermissions)
  const { canEditQuote, canDeleteQuote, canCopyQuote } = permissions

  return (
    <tr>
      <td>{quote.quoteNumber}</td>
      <td>{quote.insuredName}</td>
      <td>
        {/* Edit button: disabled if no permission */}
        <Button
          size="sm"
          disabled={!canEditQuote}
          onClick={() => handleEdit(quote.id)}
          title={!canEditQuote ? 'You do not have permission to edit quotes' : 'Edit this quote'}
        >
          Edit
        </Button>

        {/* Delete button: hidden if no permission (stronger UX than just disabled) */}
        {canDeleteQuote && (
          <Button size="sm" variant="danger" onClick={() => handleDelete(quote.id)}>
            Delete
          </Button>
        )}

        {/* Copy button: shown if permission granted */}
        {canCopyQuote && (
          <Button size="sm" variant="secondary" onClick={() => handleCopy(quote.id)}>
            Copy
          </Button>
        )}
      </td>
    </tr>
  )
}
```

### 3. Check Permissions at Page Entry

Always check top-level permissions when the page loads:

```typescript
export function QuoteDetailPage({ id }: { id: string }) {
  const permissions = useSelector(selectQuoteListPermissions)
  const { canViewQuotes } = permissions

  // Redirect if no view permission
  if (!canViewQuotes) {
    return <Navigate to="/access-denied" replace />
  }

  return <QuoteDetail quoteId={id} />
}
```

### 4. Handling "Inquiry Only" Mode

If some users can only view data (no mutations), create separate logic:

```typescript
export function QuoteEditForm({ quote }: { quote: Quote }) {
  const permissions = useSelector(selectQuoteListPermissions)
  const { canEditQuote, canInquiryOnly } = permissions

  // In inquiry-only mode, disable all form fields
  if (canInquiryOnly) {
    return (
      <div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-700">
          You are viewing this quote in read-only mode.
        </div>
        
        <form>
          {/* All fields disabled */}
          <Input value={quote.insuredName} disabled />
          <Input value={quote.address} disabled />
          {/* No submit button */}
        </form>
      </div>
    )
  }

  if (!canEditQuote) {
    return <EmptyState title="Access Denied" />
  }

  // Normal edit form
  return <QuoteEditFormImpl quote={quote} />
}
```

### 5. API Error Handling (Permission Denied)

Sometimes the backend returns a 403 when an action is attempted. Handle gracefully:

```typescript
const handleDeleteQuote = async (id: string) => {
  try {
    await deleteQuote(id).unwrap()
    toast({ type: 'success', message: 'Quote deleted' })
  } catch (error: any) {
    if (error?.status === 403) {
      toast({
        type: 'error',
        message: 'You do not have permission to delete this quote.',
      })
    } else {
      toast({ type: 'error', message: 'Failed to delete quote' })
    }
  }
}
```

### 6. Testing Permission-Driven UI

Create a test that checks UI visibility based on permissions:

```typescript
import { test, expect } from '@playwright/experimental-ct-react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { QuoteListPage } from '@/features/quotes/QuoteListPage'
import { setUserInfo } from '@/redux/store' // or relevant action

test.describe('Permission-Driven UI', () => {
  test('should show "New Quote" button if user has permission', async ({ mount }) => {
    // Mock store with permissions
    const storeWithPerms = mockStore({
      userInfo: {
        data: {
          userPermissions: [
            { permissionValue: 'VIEW_QUOTES' },
            { permissionValue: 'CREATE_QUOTE' },
          ],
        },
      },
    })

    const component = await mount(
      <Provider store={storeWithPerms}>
        <QuoteListPage />
      </Provider>
    )

    await expect(component.locator('button:has-text("New Quote")')).toBeVisible()
  })

  test('should hide "New Quote" button if user lacks permission', async ({ mount }) => {
    const storeNoPerms = mockStore({
      userInfo: {
        data: {
          userPermissions: [
            { permissionValue: 'VIEW_QUOTES' },
            // No CREATE_QUOTE permission
          ],
        },
      },
    })

    const component = await mount(
      <Provider store={storeNoPerms}>
        <QuoteListPage />
      </Provider>
    )

    await expect(component.locator('button:has-text("New Quote")')).not.toBeVisible()
  })

  test('should disable edit button if user lacks permission', async ({ mount }) => {
    const storeNoEdit = mockStore({
      userInfo: {
        data: {
          userPermissions: [
            { permissionValue: 'VIEW_QUOTES' },
            // No EDIT_QUOTE permission
          ],
        },
      },
    })

    const component = await mount(
      <Provider store={storeNoEdit}>
        <QuoteListPage />
      </Provider>
    )

    const editButton = component.locator('button:has-text("Edit")').first()
    await expect(editButton).toBeDisabled()
  })
})
```

## Do / Don't

✅ **Do:**
- Create a selector for each feature's permissions (e.g., `selectQuoteListPermissions`)
- Check top-level permissions at page entry (return early if denied)
- Hide UI elements entirely if permission is required (cleaner UX than disabled buttons)
- Use `disabled` state for ancillary actions (e.g., "copy", "export") that aren't critical
- Provide clear messaging when access is denied ("You do not have permission to...")
- Test both with and without permissions

❌ **Don't:**
- Check permissions in every component (centralize in selectors)
- Mix permission checks across files (keep them in `selector.ts`)
- Assume a permission exists; always check its value
- Skip permission checks because "it won't matter" — frontend checks are UX, backend enforces security
- Hardcode permission names in components (store them in selector)
- Forget to handle 403 errors from the API

## Permission Naming Convention

Permission values typically follow this pattern:
- `VIEW_<FEATURE>` — Can view the feature/page
- `CREATE_<FEATURE>` — Can create a new item
- `EDIT_<FEATURE>` or `CHANGE_<FEATURE>` — Can modify an item
- `DELETE_<FEATURE>` — Can delete an item
- `EXPORT_<FEATURE>` — Can export/download data
- `MANAGE_<FEATURE>` — Super-user; full control

Example for Quotes:
- `VIEW_QUOTES`
- `CREATE_QUOTE`
- `EDIT_QUOTE`
- `DELETE_QUOTE`
- `ISSUE_QUOTE`
- `COPY_QUOTE`

## Example Files

- [selector.ts](../../src/redux/selector.ts) — Permission selectors
- [QuoteListPage.tsx](../../src/features/quotes/QuoteListPage.tsx) — Using `selectQuoteListPermissions`
- [userManagementService.test.ts](../../tests/unit/services/userManagementService.test.ts) — Permission testing
