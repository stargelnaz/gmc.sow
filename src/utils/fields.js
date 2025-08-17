// src/config/fields.js
export const FIELDS = [
  // === Page 1 fields ===
  {
    id: 'gnpSourceId',
    label: 'GNP Source ID',
    page: 1,
    type: 'string',
    defaultValue: ''
  },
  {
    id: 'sourceTitle',
    label: 'Source Title',
    page: 1,
    type: 'string',
    defaultValue: ''
  },
  {
    id: 'languages',
    label: 'Languages',
    page: 1,
    type: 'string[]',
    options: [
      { value: 'eng', label: 'English' },
      { value: 'spa', label: 'Spanish' },
      { value: 'fra', label: 'French' }
    ],
    defaultValue: ['eng']
  },
  {
    id: 'totalCost',
    label: 'Total Cost (USD)',
    page: 1,
    type: 'number',
    defaultValue: 0
  },

  // === Page 2 fields (placeholder; you can expand later) ===
  {
    id: 'projectName',
    label: 'Project Name',
    page: 2,
    type: 'string',
    defaultValue: ''
  }
];

export const FIELD_BY_ID = Object.fromEntries(FIELDS.map((f) => [f.id, f]));

/** Return fields for a given page number */
export const fieldsForPage = (page) => FIELDS.filter((f) => f.page === page);

/** Build initial values from schema defaults */
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
