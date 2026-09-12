# Building Complex Forms

**When to use:** Creating a form with validation, multiple sections, conditional fields, and async submission (create quotes, endorse policies, manage users).

## Trigger Conditions

- Building a form with Formik + Yup validation
- Form has multiple sections or pages (wizard-like flow)
- Form fields have dependencies or conditional rendering
- Form submission calls an API endpoint

## Step-by-Step

### 1. Define a Yup Validation Schema

Create or open `src/features/<feature>/components/use<Feature>Form.ts`:

```typescript
import * as Yup from 'yup';

export const myFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  policyType: Yup.string()
    .required('Policy type is required')
    .oneOf(['commercial', 'personal'], 'Invalid policy type'),
  driverCount: Yup.number()
    .required()
    .min(1, 'At least one driver is required')
    .max(10, 'Maximum 10 drivers allowed'),
  // Conditional field (only required if dolicyType === 'commercial')
  businessName: Yup.string().when('policyType', {
    is: 'commercial',
    then: (schema) => schema.required('Business name is required for commercial policies'),
    otherwise: (schema) => schema.optional(),
  }),
});
```

### 2. Create a Custom Hook for Form Logic

In the same file (or in the component file), create a hook:

```typescript
import { useFormik } from 'formik';

export function useMyForm(onSubmitSuccess?: () => void) {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      email: '',
      policyType: 'personal',
      driverCount: 1,
      businessName: '',
    },
    validationSchema: myFormSchema,
    onSubmit: async (values) => {
      try {
        // API call
        const response = await apiClient.post('/api/v1/MyFeature/CreateItem', values);
        onSubmitSuccess?.();
        return response.data;
      } catch (error) {
        formik.setStatus({ error: 'Failed to submit form' });
      }
    },
  });

  return formik;
}
```

### 3. Build the Form Component

Create `src/features/<feature>/components/MyForm.tsx`:

```typescript
import { useMyForm } from './useMyForm'
import { Input } from '@/components/controls/form/Input'
import { Select } from '@/components/controls/form/Select'
import { Button } from '@/components/controls/form/Button'
import clsx from 'clsx'

export function MyForm({ onSuccess }: { onSuccess?: () => void }) {
  const formik = useMyForm(onSuccess)

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Section 1: Basic Info */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-base font-semibold text-slate-800">Basic Information</h2>

        <Input
          label="First Name"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && formik.errors.firstName}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
        />
      </div>

      {/* Section 2: Policy Details */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-base font-semibold text-slate-800">Policy Details</h2>

        <Select
          label="Policy Type"
          name="policyType"
          value={formik.values.policyType}
          onChange={(e) => {
            formik.setFieldValue('policyType', e.target.value)
            // Conditionally clear businessName if switching to personal
            if (e.target.value === 'personal') {
              formik.setFieldValue('businessName', '')
            }
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.policyType && formik.errors.policyType}
          options={[
            { value: 'personal', label: 'Personal Auto' },
            { value: 'commercial', label: 'Commercial Auto' },
          ]}
        />

        {/* Conditional field: show only if policyType === 'commercial' */}
        {formik.values.policyType === 'commercial' && (
          <Input
            label="Business Name"
            name="businessName"
            value={formik.values.businessName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.businessName && formik.errors.businessName}
          />
        )}

        <Input
          label="Number of Drivers"
          name="driverCount"
          type="number"
          min={1}
          max={10}
          value={formik.values.driverCount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.driverCount && formik.errors.driverCount}
        />
      </div>

      {/* Status message */}
      {formik.status?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {formik.status.error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" type="button">
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {formik.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}
```

### 4. Multi-Step Forms (Wizards)

If your form spans multiple steps, use a parent component to manage active step:

```typescript
export function MyMultiStepForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState<'info' | 'details' | 'review'>('info')
  const formik = useMyForm(onSuccess)

  const handleNextStep = () => {
    // Validate current step before advancing
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        setStep('details')
      }
    })
  }

  return (
    <div>
      {step === 'info' && (
        <>
          {/* Step 1 fields */}
          <Button onClick={handleNextStep}>Next</Button>
        </>
      )}
      {step === 'details' && (
        <>
          {/* Step 2 fields */}
          <Button onClick={() => setStep('info')}>Back</Button>
          <Button onClick={() => setStep('review')}>Continue</Button>
        </>
      )}
      {step === 'review' && (
        <>
          {/* Summary of all fields */}
          <Button onClick={() => setStep('details')}>Back</Button>
          <Button onClick={formik.submitForm}>Submit</Button>
        </>
      )}
    </div>
  )
}
```

### 5. Async Field Validation

For fields that need server-side validation (e.g., checking if email is unique):

```typescript
const myFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .test('is-unique', 'Email already in use', async (value) => {
      if (!value) return true;
      const response = await apiClient.get(`/api/v1/Users/CheckEmail?email=${value}`);
      return response.data.isUnique;
    }),
});
```

### 6. Form Hooks & Reusability

Extract form logic into a custom hook for reuse across pages:

```typescript
// src/features/quotes/components/usePolicieForm.ts
export function usePolicieForm(initialData?: PolicyData) {
  const formik = useFormik({
    initialValues: initialData || defaultValues,
    validationSchema: policiesSchema,
    onSubmit: async (values) => { /* ... */ },
    enableReinitialize: true, // Auto-reset when initialData changes
  })
  return formik
}

// Usage in both create and edit pages:
function CreatePolicyPage() {
  const formik = usePolicieForm()
  return <PolicyForm formik={formik} />
}

function EditPolicyPage({ id }) {
  const { data } = useGetPolicyQuery(id)
  const formik = usePolicieForm(data)
  return <PolicyForm formik={formik} />
}
```

### 7. Error Handling & User Feedback

```typescript
// Display field-level errors (already done above with error prop)

// Display form-level errors (API rejection):
{formik.status?.error && (
  <Alert variant="error" title="Submission Failed">
    {formik.status.error}
  </Alert>
)}

// Success feedback:
// Use Toast provider (typically in parent page):
const { toast } = useToast()
// In onSubmitSuccess callback:
toast({ type: 'success', message: 'Policy created successfully' })
```

### 8. Testing the Form

Create `tests/ct/domains-quotes-components-MyForm.spec.ts`:

```typescript
import { test, expect } from '@playwright/experimental-ct-react'
import { MyForm } from '@/features/quotes/components/MyForm'

test.describe('MyForm', () => {
  test('should validate required fields', async ({ mount }) => {
    const component = await mount(<MyForm />)

    // Try to submit without filling required fields
    await component.locator('button:has-text("Submit")').click()

    // Check that validation errors appear
    await expect(component.locator('text=First name is required')).toBeVisible()
  })

  test('should submit the form', async ({ mount }) => {
    const component = await mount(<MyForm onSuccess={() => {}} />)

    await component.locator('input[name="firstName"]').fill('John')
    await component.locator('input[name="email"]').fill('john@example.com')
    await component.locator('button:has-text("Submit")').click()

    // Assert success state (e.g., page navigates or success message shows)
    await expect(component.locator('text=Success')).toBeVisible()
  })
})
```

## Do / Don't

✅ **Do:**

- Define validation schemas **before** building components
- Use Formik's `setFieldValue` for complex field interactions
- Extract form logic into custom hooks for reusability
- Display field-level and form-level errors clearly
- Handle loading/disabled states during submission
- Test validation and submission flows

❌ **Don't:**

- Manage form state with multiple `useState` calls (use Formik)
- Skip validation on required fields
- Hardcode error messages (centralize them in the schema)
- Call API endpoints directly from the form (use a hook wrapping the API)
- Forget to set `disabled` or `isSubmitting` on submit button
- Use `onSubmit` for non-form submissions (use click handlers instead)

## Example Files

- [usePolicieForm.ts](../../src/features/quotes/steps/PolicyDetailsStep/usePolicyDetailsForm.ts) — Custom form hook with Formik setup
- [PolicyDetailsStep](../../src/features/quotes/steps/PolicyDetailsStep/index.tsx) — Multi-step form with conditional fields
- [Input.tsx](../../src/components/controls/form/Input.tsx) — Form control with error display
