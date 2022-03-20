// @ts-ignore - Imports will be there from the upstream patch
import { createHyperscript, createText } from 'slate-hyperscript';

/**
 * This is the mapping for the JSX that creates editor state. Add to it as needed.
 * The h prefix isn't needed. It's added to be consistent and to let us know it's
 * hyperscript.
 */
export const jsx = createHyperscript({
  elements: {
    // Add any nodes here with any attributes that's required or optional
    hbq: { type: 'bq' },
    hh2: { type: 'h2' },
    himage: { type: 'img' },
    hlink: { type: 'link' },
    hp: { type: 'paragraph' },
    htext: {
      text: String
    }
  },
  creators: {
    htext: createText,
  },
})