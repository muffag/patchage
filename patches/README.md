# Patches

Patches get applied to existing repositories. A patch must always contain a `manifest.json` and may contain a `package.json` which gets merged with the existing `package.json` in the target directory.

**Example `manifest.json`**

```json
{
  "name": "my-great-patch",
  "description": "Short description",
  "files": [
    {
      "source": "my.config.js",
      "destination": "src/my.config.js"
    }
  ],
  "scripts": [
    {
      "script": "init_tsconfig.sh",
      "exec": "postinstall"
    }
  ]
}
```

**Example `package.json`**

```json
{
  "devDependencies": {
    "@commitlint/cli": "^7.6.1",
    "@commitlint/config-conventional": "^7.6.0",
    "husky": "^2.3.0"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## `manifest.json`

### `files`

Array of files you want to copy from the patch folder to the target directory. If the directory in the target does not exist, it gets created.

### `scripts`

Array of bash scripts which will be executed in the target directory. The `exec` enum property defines when the script gets executed.

#### `exec`

| Value         | Description                    |
| ------------- | ------------------------------ |
| `preinstall`  | Execution before `npm install` |
| `postinstall` | Execution after `npm install`  |
