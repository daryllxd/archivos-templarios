# ... existing code ...

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Monorepo Build Commands

To build **all packages** in the monorepo:

```bash
pnpm turbo run build
```

To build **only the web app**:

```bash
pnpm turbo run build --filter=@archivos-templarios/web
```

You can also run these commands from the monorepo root to ensure all dependencies and outputs are up to date across your workspace.
