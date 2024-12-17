# Moonstone

A local-first, markdown note-taking app


## Tech stacks used

- Of course, [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Milkdown](https://milkdown.dev/docs/guide/getting-started)
- [Electron Forge](https://www.electronforge.io/)
- [shadcn/uk](https://ui.shadcn.com/)

## Things to note

Creating a electron app

```bash
npx create-electron-app@latest my-new-app --template=vite-typescript
```

shadcn components

- [shadcn Blocks](https://ui.shadcn.com/blocks/sidebar) are useful
- [command](https://ui.shadcn.com/docs/components/command) menu

[Milkdown playground](https://milkdown.dev/playground) is inspring.
They have [Crepe](https://milkdown.dev/docs/guide/using-crepe), a battery-charged component with popular plugins set.


Processes in Electron

- main vs renderer
- main: create and manage application windows with the `BrowserWindow` module
- renderer: a separate renderer process for each open `BrowserWindow`
- preload: contains code that executes in a rendrer process before its web content begins loading

keyboard shortcuts as example
- main: `menu.append(new MenuItem({}))`
- preload: `contextBridge.exposeInMainWorld('electronAPI', {})`
- renderer: `window.electronAPI.onOpenVault(() => openVault())`
