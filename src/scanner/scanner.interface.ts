export interface IPatch {
  // Provided values in manifest.json
  name: string;
  description: string;
  copyFiles?: Array<{
    // Relative path to file you want to copy
    source: string;

    // Relative path to destination repository. Directories will be created if
    // they don't exist.
    target: string;
  }>;

  // Generated properties
  directory: string;
}
