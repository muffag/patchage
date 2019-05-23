export function getInstallCommandForPackageManager(
  packageManager: 'npm' | 'yarn'
) {
  switch (packageManager) {
    case 'npm':
      return 'npm install';
    case 'yarn':
      return 'yarn install';
  }
}
