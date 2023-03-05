import { join, resolve } from 'node:path';
import os from 'node:os';

export const PATH_TO_STATIC_FOLDER = join(resolve(), os.tmpdir());
