export interface IPatch {
  // Provided values in manifest.json
  name: string;
  description: string;
  files?: Array<{
    // Relative path to file you want to copy
    source: string;

    // Relative path to destination repository. Directories will be created if
    // they don't exist.
    destination: string;
  }>;
  scripts?: Array<{
    // Relative path to script file
    script: string;

    // When to execute
    exec: ExecTiming;
  }>;

  // Generated properties
  directory: string;
}

export type ExecTiming = 'preinstall' | 'postinstall';
