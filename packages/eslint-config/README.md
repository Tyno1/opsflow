# @repo/eslint-config

Shared ESLint configurations for the opsflow monorepo.

## Exports

| Export | Use case |
|--------|----------|
| `@repo/eslint-config/base` | Base rules |
| `@repo/eslint-config/next-js` | Next.js apps |
| `@repo/eslint-config/react-internal` | React libraries (e.g. `@repo/ui`) |

## Usage

```js
import { nextJsConfig } from "@repo/eslint-config/next-js";

export default nextJsConfig;
```
