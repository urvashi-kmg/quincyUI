import { useFormik, type FormikConfig, type FormikValues } from 'formik';

// Thin, truly-generic wrapper kept here only because it has zero feature
// knowledge. If a hook needs to know about quotes/policies/etc., it
// belongs in that feature's own hooks/ folder instead — this directory
// is reserved for hooks with no domain awareness.
export function useFormikForm<Values extends FormikValues>(config: FormikConfig<Values>) {
  return useFormik<Values>(config);
}
