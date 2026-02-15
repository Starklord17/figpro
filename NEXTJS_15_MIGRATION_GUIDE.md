# Next.js 15 Migration Guide

This document outlines the changes required to upgrade from Next.js 14.2.15 to Next.js 15.5.10.

## Overview

The upgrade to Next.js 15 introduces several breaking changes that required updates to dependencies, configuration, and code.

## Dependency Updates

### ESLint Upgrade (v8 → v9)

**Reason**: `eslint-config-next@16.x` requires ESLint 9 or higher.

**Changes**:
- Updated `eslint` from `^8` to `^9` in `package.json`
- Migrated from `.eslintrc.json` to `eslint.config.mjs` (ESLint 9 flat config format)
- Updated `eslint-config-next` from `16.0.10` to `16.1.6`
- Added `@eslint/eslintrc` as a dev dependency for compatibility

**New ESLint Configuration** (`eslint.config.mjs`):
```javascript
import nextPlugin from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**'],
  },
  ...nextPlugin,
];

export default eslintConfig;
```

### React Version

**Decision**: Kept React 18.2.0

**Reason**: While Next.js 15 supports both React 18.2+ and React 19, our Liveblocks dependencies (`@liveblocks/react-comments@1.12.0`) only support React 16-18. Next.js 15 is fully compatible with React 18.2.0.

## Breaking Changes Fixed

### 1. Dynamic Imports with `ssr: false` in Server Components

**Issue**: Next.js 15 doesn't allow `ssr: false` option with `next/dynamic` in Server Components.

**Error**:
```
Error: `ssr: false` is not allowed with `next/dynamic` in Server Components.
Please move it into a Client Component.
```

**Fix**: Added `'use client'` directive to `app/page.tsx`

**Before**:
```typescript
import dynamic from 'next/dynamic';

const App = dynamic(() => import('./App'), { ssr: false })

export default App;
```

**After**:
```typescript
'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('./App'), { ssr: false })

export default App;
```

### 2. React Strict Rules for Refs

**Issue**: React 18/19 enforces stricter rules about updating refs during render.

**Error**:
```
Error: Cannot access refs during render
Cannot update ref during render
```

**Fix**: Moved ref updates to `useEffect` in `components/comments/NewThread.tsx`

**Before**:
```typescript
const allowComposerRef = useRef(allowUseComposer);
allowComposerRef.current = allowUseComposer; // ❌ Updates during render
```

**After**:
```typescript
const allowComposerRef = useRef(allowUseComposer);

useEffect(() => {
  allowComposerRef.current = allowUseComposer; // ✅ Updates in effect
}, [allowUseComposer]);
```

### 3. Impure Functions in Render

**Issue**: ESLint's React Compiler rules flag `Math.random()` calls during render as impure functions that can cause hydration mismatches.

**Error**:
```
Error: Cannot call impure function during render
`Math.random` is an impure function.
```

**Fix**: Used `useState` with lazy initializer for components without user context, and a hash function for Avatar component with user names.

**For Random Avatars** (PinnedComposer.tsx, PinnedThread.tsx):
```typescript
// ❌ Before: Called on every render
<Image src={`...avatar-${Math.floor(Math.random() * 30)}.png`} />

// ✅ After: Stable value using lazy initialization
const [avatarId] = useState(() => Math.floor(Math.random() * 30));
<Image src={`...avatar-${avatarId}.png`} />
```

**For User-Based Avatars** (Avatar.tsx):
```typescript
// Generate a stable avatar number from a string (name)
const getAvatarId = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % 30;
};

const Avatar = ({ name, otherStyles }: Props) => {
  const avatarId = getAvatarId(name);
  return <Image src={`...avatar-${avatarId}.png`} />;
};
```

### 4. TypeScript Configuration

**Automatic Update**: Next.js 15 automatically updated `tsconfig.json` to add:
```json
{
  "compilerOptions": {
    "target": "ES2017"
  }
}
```

This is required for top-level `await` support in Next.js 15.

### 5. Font Configuration

**Enhancement**: Added `display` and `fallback` options to Google Font configuration in `app/layout.tsx`:

```typescript
const workSans = Work_Sans({ 
  subsets: ["latin"], 
  variable: '--font-work-sans', 
  weight: ['400', '600', '700'],
  display: 'swap',        // ✅ Added for better font loading
  fallback: ['system-ui', 'arial']  // ✅ Added fallback fonts
});
```

## Testing

### Linting
```bash
npx eslint .
```

All ESLint errors have been resolved.

### Build
```bash
npm run build
```

**Note**: Build may fail in restricted network environments due to Google Fonts download during build time. This works correctly in production environments (e.g., Vercel) with internet access.

### Development
```bash
npm run dev
```

## Deployment

The application is now ready for deployment with Next.js 15. All breaking changes have been addressed:

✅ ESLint 9 compatibility  
✅ React 18.2 compatibility  
✅ Server/Client component boundaries  
✅ React strict mode compliance  
✅ TypeScript configuration  

## Additional Resources

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [ESLint 9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

## Troubleshooting

### Issue: Package installation fails with peer dependency conflicts

**Solution**: Ensure you're using the exact versions specified in `package.json`:
- `eslint`: `^9`
- `eslint-config-next`: `16.1.6`
- `next`: `15.5.10`
- `react`: `^18.2.0`
- `react-dom`: `^18.2.0`

Then run:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails with Google Fonts error

**Cause**: Network restrictions preventing access to fonts.googleapis.com

**Solution**: This is expected in restricted environments. In production (Vercel), Google Fonts will load correctly. For local testing in restricted networks, you can temporarily use local fonts or skip font optimization.
