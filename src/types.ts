export interface IPatchManifest {
  name: string;
  description: string;
}

export interface IPatchMeta extends IPatchManifest {
  files: string[];
}
