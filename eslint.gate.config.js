import globals from 'globals'
import react from 'eslint-plugin-react'

// Minimal "will-it-crash" gate used by `npm run build`.
// It enables ONLY the rules that catch runtime ReferenceErrors that the
// bundler does NOT catch and that white-screen the app:
//   - react/jsx-no-undef : <Instagram/> used in JSX but never imported
//   - no-undef           : any bare identifier referenced but never declared
// Everything stylistic (unused imports, prop-types, hooks, etc.) is OFF here
// so the build fails ONLY for genuine crashes, never for lint noise.
// Full linting still lives in eslint.config.js via `npm run lint`.
export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // This gate intentionally enables only 2 of the ~15 rules `npm run lint`
    // checks (see header comment). A blanket `eslint-disable-next-line`
    // written for a rule that only exists in the full config (e.g.
    // react-refresh/only-export-components in AuthContext.jsx) is legitimate
    // there but has nothing to suppress under this minimal rule set — don't
    // let that report as a warning here.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-undef': 'error',
      'react/jsx-no-undef': 'error',
    },
  },
]
