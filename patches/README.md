# Patches

Patches get applied to existing repositories. A patch must always contain a `manifest.json` in the following format:

```json
{
  "name": "my-great-patch",
  "description": "Short description",
  "copyFiles": [
    {
      "source": "my.config.js",
      "target": "src/my.config.js"
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

### `copyFiles`

Array of files you want to copy from the patch folder to the target directory. If the target directory does not exist, it gets created.

### `scripts`

TODO
