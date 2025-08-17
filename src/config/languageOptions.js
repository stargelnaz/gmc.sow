// src/config/languageOptions.js
import raw from './dataLanguages.json';

// Convert [{ "eng": "English" }, ...] → [{ value: "eng", label: "English" }, ...]
export const languageOptions = raw.map((obj) => {
  const [code, name] = Object.entries(obj)[0];
  return { value: code, label: name };
});

// Handy lookup: code → label
export const LANGUAGE_LABEL_BY_CODE = Object.fromEntries(
  languageOptions.map((o) => [o.value, o.label])
);
