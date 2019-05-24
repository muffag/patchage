import { sortDependencies } from './merge_package_json';

describe('sortDependencies', () => {
  it('should sort devDependencies alphabetically', () => {
    expect(
      JSON.stringify(
        sortDependencies({
          name: 'test-package',
          devDependencies: {
            zebra: '1.0.0',
            cow: '3.1.4',
            ant: '4.9.19',
          },
        })
      )
    ).toBe(
      `{"name":"test-package","devDependencies":{"ant":"4.9.19","cow":"3.1.4","zebra":"1.0.0"}}`
    );
  });

  it('should sort dependencies alphabetically', () => {
    expect(
      JSON.stringify(
        sortDependencies({
          name: 'test-package',
          dependencies: {
            tslint: '1.0.0',
            typescript: '3.1.4',
            husky: '4.9.19',
          },
        })
      )
    ).toBe(
      `{"name":"test-package","dependencies":{"husky":"4.9.19","tslint":"1.0.0","typescript":"3.1.4"}}`
    );
  });

  it('should sort dependencies and devDependencies alphabetically', () => {
    expect(
      JSON.stringify(
        sortDependencies({
          name: 'test-package',
          dependencies: {
            tslint: '1.0.0',
            typescript: '3.1.4',
            husky: '4.9.19',
          },
          devDependencies: {
            '@commitlint/cli': '1.0.0',
            typescript: '1.0.0',
            '@types/fs-extra': '1.0.0',
          },
        })
      )
    ).toBe(
      `{"name":"test-package","dependencies":{"husky":"4.9.19","tslint":"1.0.0","typescript":"3.1.4"},"devDependencies":{"@commitlint/cli":"1.0.0","@types/fs-extra":"1.0.0","typescript":"1.0.0"}}`
    );
  });
});
