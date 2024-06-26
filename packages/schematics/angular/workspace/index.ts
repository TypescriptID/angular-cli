/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {
  Rule,
  apply,
  applyTemplates,
  filter,
  mergeWith,
  noop,
  strings,
  url,
} from '@angular-devkit/schematics';
import { latestVersions } from '../utility/latest-versions';
import { Schema as WorkspaceOptions } from './schema';

export default function (options: WorkspaceOptions): Rule {
  return mergeWith(
    apply(url('./files'), [
      options.minimal ? filter((path) => !path.endsWith('editorconfig.template')) : noop(),
      applyTemplates({
        utils: strings,
        ...options,
        'dot': '.',
        latestVersions,
      }),
    ]),
  );
}
