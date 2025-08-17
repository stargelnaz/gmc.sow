// src/config/fields.js

import { languageOptions, LANGUAGE_LABEL_BY_CODE } from './languageOptions';

export const FIELDS = [
  // === Page 1: user enters these ===
  {
    id: 'gnpSourceId',
    label: 'GNP Source ID',
    page: 1,
    type: 'string',
    defaultValue: 'An Example ID for testing',
    hint: (values) =>
      values.gnpSourceId ? `ID “${values.gnpSourceId}”` : 'e.g. GNPS00023',
    validate: (v) => (!v || v.trim() === '' ? 'Required.' : null)
  },
  {
    id: 'sourceTitle',
    label: 'Source Title',
    page: 1,
    type: 'string',
    defaultValue: 'An Example Title for testing',
    hint: (values) =>
      values.sourceTitle
        ? `Project “${values.sourceTitle}”`
        : 'For long titles, use a short version',
    validate: (v) => (!v || v.trim() === '' ? 'Required.' : null)
  },
  {
    id: 'languages',
    label: 'Languages (Ctrl/Cmd to select multiple)',
    page: 1,
    type: 'string[]', // store array of codes: ["eng", "spa", ...]
    options: languageOptions, // [{value, label}, ...]
    defaultValue: () =>
      languageOptions.length ? [languageOptions[0].value] : [],
    hint: (values) =>
      values.languages?.length
        ? `Languages: ${values.languages
            .map((code) => LANGUAGE_LABEL_BY_CODE[code] || code)
            .join(', ')}`
        : 'Add one or more target languages.',
    validate: (v) =>
      Array.isArray(v) && v.length ? null : 'Add at least one language.'
  },
  {
    id: 'totalCost',
    label: 'Total Cost (USD)',
    page: 1,
    type: 'number',
    defaultValue: 0.01,
    hint: (values) => (values.totalCost > 0 ? 'OK' : 'Set a non-zero price.'),
    validate: (v) => (v > 0 ? null : 'Price must be greater than 0.')
  },

  // === Page 2: editable with hints + derived ===
  {
    id: 'projectName',
    label: 'Project Name',
    page: 2,
    type: 'string',
    defaultValue: '',
    derived: true,
    compute: (values) =>
      values.sourceTitle && values.gnpSourceId
        ? `${values.sourceTitle} (${values.gnpSourceId})`
        : values.sourceTitle || values.gnpSourceId || '',
    dependsOn: ['sourceTitle', 'gnpSourceId'],
    hint: () => `Auto-generated from Source Title and GNP Source ID`
  },
  // 1. Project Information
  {
    id: 'projectSummary',
    label: 'Project Summary',
    page: 2,
    type: 'string',
    defaultValue: 'Translation, Editing, Formatting of',
    hint: (values) =>
      values.projectSummary
        ? 'Make sure summary matches scope and dates.'
        : 'Add a brief, client-friendly summary.'
  },
  {
    id: 'gnpProjectNumbers',
    label: 'GNP Project Numbers',
    page: 2,
    type: 'string',
    defaultValue: 'GNP00001',
    hint: () =>
      'Enter as many as necessary, separated by a comma. Example: GNP00101, GNP003332',
    validate: (v) => {
      if (!v || v.trim() === '') return 'Required.';
      const invalid = /[^A-Za-z0-9, ]/.test(v);
      return invalid
        ? 'Only letters, numbers, commas, and spaces are allowed.'
        : null;
    },
    transformIn: (v) => (v ? v.toUpperCase() : v)
  },
  // 2. Scope of work
  {
    id: 'descriptionOfServices',
    label: 'Description of Services',
    page: 2,
    type: 'string',
    defaultValue: 'Translation, Editing, Formatting'
  },
  {
    id: 'deliverables',
    label: 'Deliverables',
    page: 2,
    type: 'string',
    defaultValue: 'Indesign package, PDF, and source files'
  },
  // 3. Schedule
  {
    id: 'startDate',
    label: 'Start Date',
    page: 2,
    type: 'date',
    defaultValue: () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split('T')[0]; // yyyy-mm-dd format
    }
  },
  {
    id: 'completionDate',
    label: 'Completion Date',
    page: 2,
    type: 'date',
    defaultValue: () => {
      const d = new Date();
      d.setMonth(d.getMonth() + 10);
      return d.toISOString().split('T')[0]; // yyyy-mm-dd
    },
    hint: (values) =>
      values.completionDate
        ? `Target: ${values.completionDate}`
        : 'Automatically set to today + 10 months (editable).',
    validate: (v) => (v ? null : 'Required.')
  },
  {
    id: 'milestones',
    label: 'Milestones (if any)',
    page: 2,
    type: 'string',
    defaultValue: 'Initial translation, review, final delivery'
  },
  // 4. Compensation
  {
    id: 'paymentTerms',
    label: 'Payment Terms',
    page: 2,
    type: 'string',
    defaultValue: '55% upfront, 45% on delivery'
  },
  // 5. Work Requirements
  {
    id: 'workRequirements',
    label: 'Work Requirements',
    page: 2,
    type: 'string',
    defaultValue: 'High quality, professional standards'
  },
  // 6. Primary Contacts
  {
    id: 'companyContact',
    label: 'Company Contact',
    page: 2,
    type: 'string',
    defaultValue: 'John Doe'
  },
  {
    id: 'contractorContact', // typo fixed (was "cotractorContact")
    label: 'Contractor Contact',
    page: 2,
    type: 'string',
    defaultValue: 'Jane Smith'
  },
  {
    id: 'companySigner',
    label: 'Company Signer',
    page: 2,
    type: 'string',
    defaultValue: 'Alice Johnson'
  },
  {
    id: 'contractorSigner',
    label: 'Contractor Signer',
    page: 2,
    type: 'string',
    defaultValue: 'Bob Brown'
  },

  // Derived display field
  {
    id: 'priceDisplay',
    label: 'Price (formatted)',
    page: 2,
    type: 'string',
    defaultValue: '$0.00',
    derived: true,
    compute: (values) =>
      typeof values.totalCost === 'number'
        ? values.totalCost.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD'
          })
        : '$0.00',
    dependsOn: ['totalCost'],
    hint: () => `Auto-formatted from totalCost.`
  }
];

// Utility to get initial values from schema
export function initialValuesFromSchema() {
  const out = {};
  for (const f of FIELDS) {
    out[f.id] =
      typeof f.defaultValue === 'function'
        ? f.defaultValue()
        : f.defaultValue ?? null;
  }
  return out;
}

// Build a quick lookup for convenience
export const FIELD_BY_ID = Object.fromEntries(FIELDS.map((f) => [f.id, f]));

// Return all fields that belong to a given page number
export const fieldsForPage = (page) => FIELDS.filter((f) => f.page === page);
