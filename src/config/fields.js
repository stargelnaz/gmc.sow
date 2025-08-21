// src/config/fields.js
import { languageOptions, LANGUAGE_LABEL_BY_CODE } from './languageOptions';

export const FIELDS = [
  // === Page 1: user enters these ===
  {
    id: 'gnpSourceId',
    label: 'GNP Source ID',
    page: 1,
    type: 'string',
    defaultValue: '',
    hint: () =>
      'Enter the GNP Source ID from GNPprojects. (Click the "Copy ID" button in Source Details, then paste here)',

    validate: (v) => (!v || v.trim() === '' ? 'Required.' : null)
  },
  {
    id: 'sourceTitle',
    label: 'Source Title',
    page: 1,
    type: 'string',
    defaultValue: '',
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
    options: languageOptions, // [{ value, label }, ...]
    defaultValue: [], // MUST be an array
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
    defaultValue: 0,
    hint: (values) =>
      Number.isFinite(values.totalCost) && values.totalCost > 0
        ? 'OK'
        : 'One combined total for ALL languages. Must be greater than 0.',
    validate: (v) => {
      if (!Number.isFinite(v)) return 'Enter a valid number.';
      if (v <= 0) return 'Price must be greater than 0.';
      return null;
    }
  },

  // === Page 2: editable with hints + derived ===
  {
    id: 'projectName',
    label: 'Project Name',
    page: 2,
    type: 'string',
    defaultValue: '',
    derived: true,
    compute: (values) => {
      // base: "Title (ID)"
      const base =
        values.sourceTitle && values.gnpSourceId
          ? `${values.sourceTitle} (${values.gnpSourceId})`
          : values.sourceTitle || values.gnpSourceId || '';

      // languages suffix: map codes -> labels; limit or "Multiple Languages"
      const langs = Array.isArray(values.languages) ? values.languages : [];
      const labels = langs.map((c) => LANGUAGE_LABEL_BY_CODE[c] || c);
      let langSuffix = '';
      if (labels.length === 1) langSuffix = ` — ${labels[0]}`;
      else if (labels.length > 1 && labels.length <= 7)
        langSuffix = ` — ${labels.join(', ')}`;
      else if (labels.length > 4) langSuffix = ' — Multiple Languages';

      return base + langSuffix;
    },
    dependsOn: ['sourceTitle', 'gnpSourceId', 'languages'],
    hint: () =>
      `Auto-generated. Change the information in the "Required Information" panel, and it will update here.`
  },

  // 1. Project Information
  {
    id: 'projectSummary',
    label: 'Project Summary',
    page: 2,
    type: 'string',
    defaultValue:
      'Translation of Global Nazarene Publications project into the language(s) indicated.  ',
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
      return d.toISOString().split('T')[0]; // yyyy-mm-dd
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
    defaultValue:
      "Global Nazarene Publications will supply electronic files for translation. Contractor will have no access to the Company's data systems unless arranged by it's Information Technology Department."
  },

  // 6. Primary Contacts
  {
    id: 'companyContact',
    label: 'Company Contact',
    page: 2,
    type: 'string',
    defaultValue: 'Ejay Berce <eberce@nazarene.org>'
  },
  {
    id: 'contractorContact',
    label: 'Contractor Contact',
    page: 2,
    type: 'string',
    defaultValue: 'Yuriy Prysiazhniuk <yuriy@christianlingua.com>'
  },
  {
    id: 'companySigner',
    label: 'Company Signer',
    page: 2,
    type: 'string',
    defaultValue: 'Gary M. Hartke, General Secretary'
  },
  {
    id: 'contractorSigner',
    label: 'Contractor Signer',
    page: 2,
    type: 'string',
    defaultValue: 'Michael Yurchuk <michael@christianlingua.com> '
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
