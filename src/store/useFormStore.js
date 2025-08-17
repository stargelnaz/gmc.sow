// src/store/useFormStore.js
import { create } from 'zustand';
import { FIELDS, FIELD_BY_ID, initialValuesFromSchema } from '../config/fields';

// recompute derived values
function recompute(values) {
  const next = { ...values };
  for (const f of FIELDS) {
    if (f.derived && typeof f.compute === 'function') {
      try {
        next[f.id] = f.compute(next);
      } catch (e) {
        console.warn(`Compute failed for ${f.id}`, e);
      }
    }
  }
  return next;
}

// recompute hints
function makeHints(values) {
  const hints = {};
  for (const f of FIELDS) {
    if (typeof f.hint === 'function') {
      try {
        hints[f.id] = f.hint(values) ?? null;
      } catch {
        hints[f.id] = null;
      }
    } else {
      hints[f.id] = null;
    }
  }
  return hints;
}

// recompute errors
function makeErrors(values) {
  const errors = {};
  for (const f of FIELDS) {
    if (typeof f.validate === 'function') {
      try {
        errors[f.id] = f.validate(values[f.id], values) ?? null;
      } catch {
        errors[f.id] = 'Validation error.';
      }
    } else {
      errors[f.id] = null;
    }
  }
  return errors;
}

export const useFormStore = create((set, get) => {
  const base = initialValuesFromSchema();
  const initial = recompute(base);

  return {
    values: initial,
    hints: makeHints(initial),
    errors: makeErrors(initial),

    setValue: (id, value) => {
      const current = get().values;

      const field = FIELD_BY_ID[id];
      let newValue = value;
      if (field && typeof field.transformIn === 'function') {
        newValue = field.transformIn(value);
      }

      const next = { ...current, [id]: newValue };
      const recomputed = recompute(next);

      set({
        values: recomputed,
        hints: makeHints(recomputed),
        errors: makeErrors(recomputed)
      });
    },

    resetAll: () => {
      const resetValues = recompute(initialValuesFromSchema());
      set({
        values: resetValues,
        hints: makeHints(resetValues),
        errors: makeErrors(resetValues)
      });
    }
  };
});
