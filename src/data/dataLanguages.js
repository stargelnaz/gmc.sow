// src/config/dataLanguages.js

// Array used to render the multi-select:
export const languageOptions = [
  { value: 'eng', label: 'English' },
  { value: 'spa', label: 'Spanish' },
  { value: 'fra', label: 'French' },
  { value: 'por', label: 'Portuguese' },
  { value: 'ara', label: 'Arabic' },
  { value: 'kor', label: 'Korean' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'rus', label: 'Russian' },
  { value: 'deu', label: 'German' },
  { value: 'ita', label: 'Italian' },
  { value: 'hin', label: 'Hindi' },
  { value: 'swa', label: 'Swahili' },
  { value: 'tha', label: 'Thai' },
  { value: 'ind', label: 'Indonesian' },
  { value: 'tgl', label: 'Tagalog' },
  { value: 'vie', label: 'Vietnamese' },
  { value: 'amh', label: 'Amharic' },
  { value: 'hat', label: 'Haitian Creole' }
];

// Lookup map for echo/labels:
export const LANGUAGE_LABEL_BY_CODE = Object.fromEntries(
  languageOptions.map((o) => [o.value, o.label])
);
