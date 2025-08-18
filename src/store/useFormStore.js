// src/store/useFormStore.js
import { create } from 'zustand';
import { initialValuesFromSchema } from '../config/fields';

// Extra keys used by the PDF/export flow (from your legacy app.js)
const SOW_DEFAULTS = {
  // Page 1-ish
  gnpRef: '',
  sourceTitle: '',
  languages: [],
  priceCents: 0,
  effectiveDate: '',
  startDate: '',
  completionDate: '',

  // Page 2-ish
  projectSummary: '',
  services: '',
  deliverables: '',
  milestones: '',
  paymentTerms: '',
  materials: '',
  companyRep: '',
  contractorRep: '',
  companySignature: '',
  contractorSignature: '',
  contractorName: '',
  contractorTitle: ''
};

// Build initial values by combining schema defaults with SOW defaults.
// Schema wins if both define the same key.
function buildInitialValues() {
  const schemaVals = initialValuesFromSchema() || {};
  return { ...SOW_DEFAULTS, ...schemaVals };
}

// Optional helper if you want to auto-compute completionDate when startDate changes.
// Currently assumes startDate as "DD Mon YYYY" (e.g., "07 Sep 2025").
function computeCompletionFromStartDDMMMYYYY(startDateStr) {
  if (!startDateStr) return '';
  const parts = startDateStr.split(' ');
  if (parts.length !== 3) return '';
  const [dd, mon, yyyy] = parts;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const m = months.indexOf(mon);
  if (m < 0) return '';
  const d = new Date(Number(yyyy), m, Number(dd));
  d.setMonth(d.getMonth() + 10);
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export const useFormStore = create((set, get) => ({
  values: buildInitialValues(),
  errors: {},
  hints: {},

  // Set a single field; clears only that field’s error
  setValue: (id, val) =>
    set((state) => ({
      values: { ...state.values, [id]: val },
      errors: { ...state.errors, [id]: null }
    })),

  // Bulk set many fields; clears errors for those fields
  setMany: (patch) =>
    set((state) => ({
      values: { ...state.values, ...patch },
      errors: {
        ...state.errors,
        ...Object.fromEntries(Object.keys(patch).map((k) => [k, null]))
      }
    })),

  // New: apply multiple validation errors at once
  setErrors: (errs) =>
    set((state) => ({
      errors: { ...state.errors, ...errs }
    })),

  // Optional: set start date and auto-calc completion date (DD Mon YYYY format)
  setStartDateAndComputeCompletion: (startDateStr) => {
    const completion = computeCompletionFromStartDDMMMYYYY(startDateStr);
    set((state) => ({
      values: {
        ...state.values,
        startDate: startDateStr,
        completionDate: completion
      },
      errors: { ...state.errors, startDate: null, completionDate: null }
    }));
  },

  // Reset everything to initial (schema + SOW defaults)
  resetAll: () =>
    set({
      values: buildInitialValues(),
      errors: {},
      hints: {}
    })
}));
