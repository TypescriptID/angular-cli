/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Rule } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '../../utility/dependencies';

export function updateDependencies(): Rule {
  return (host, context) => {
    const dependenciesToUpdate: Record<string, string> = {
      '@angular-devkit/build-angular': '~0.901.15',
      '@angular-devkit/build-ng-packagr': '~0.901.15',
      '@angular-devkit/build-webpack': '~0.901.15',
      'zone.js': '~0.10.0',
      'ng-packagr': '^9.0.0',
      'web-animations-js': '^2.3.2',
      'codelyzer': '^5.1.2',
      '@types/node': '^12.11.1',
    };

    for (const [name, version] of Object.entries(dependenciesToUpdate)) {
      const current = getPackageJsonDependency(host, name);
      if (!current || current.version === version) {
        continue;
      }

      addPackageJsonDependency(host, {
        type: current.type,
        name,
        version,
        overwrite: true,
      });
    }

    // `@angular/pwa` package is only needed when running `ng-add`.
    removePackageJsonDependency(host, '@angular/pwa');

    // Check for @angular-devkit/schematics and @angular-devkit/core
    for (const name of ['@angular-devkit/schematics', '@angular-devkit/core']) {
      const current = getPackageJsonDependency(host, name);
      if (current) {
        context.logger.info(
          `Package "${name}" found in the workspace package.json. ` +
            'This package typically does not need to be installed manually. ' +
            'If it is not being used by project code, it can be removed from the package.json.',
        );
      }
    }
  };
}
