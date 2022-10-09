# next-recoil-url-sync

next-recoil-url-sync is the tool that can be used to synchronize the URL query parameters with recoil atoms. It can only be used with the next js.

## Features

- URL Persistence
  - Syncing an atom with the browser URL.

## Installation

```shell
npm install recoil next-recoil-url-sync
# or
yarn add recoil next-recoil-url-sync
# or
pnpm add recoil next-recoil-url-sync
```

### syncEffect

#### Arguments

- `queryName`
  - This prop is used to match the URL query parameter.
- `type`
  - This prop specifies what type of value query parameter will have currently only supports Number and String types.

#### Example

```tsx
import { syncEffect } from "next-recoil-url-sync";
import { atom } from "recoil";

const nameQueryAtom = atom<string | null>({
  key: "",
  default: null,
  effects: [syncEffect({ queryName: "name", type: "String" })],
});
```
