export interface IPatch {
  // Provided values in manifest.json
  name: string;
  description: string;

  // Generated properties
  directory: string;
}
