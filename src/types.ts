export interface PatchManifest {
  name: string;
  description: string;
}

export interface PatchMeta extends PatchManifest {
  files: string[];
}
