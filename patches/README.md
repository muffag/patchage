# Patches

Patches get applied to existing repositories. A patch must always contain a `manifest.json` in the following format:

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

## `manifest.json`

### `files`

Array of files you want to copy from the patch folder to the target directory. If the a directory int the target does not exist, it gets created.

### `scripts`

Array of bash scripts which will be executed in the target directory. The `exec` enum property defines when the script gets executed.

#### `exec`

| Value         | Description                    |
| ------------- | ------------------------------ |
| `preinstall`  | Execution before `npm install` |
| `postinstall` | Execution after `npm install`  |
