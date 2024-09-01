import type {RoutesPaths} from './routes.js';

export function resolvePath(key: RoutesPaths) {
  let resolvedPath = '/';

  resolvedPath = resolvedPath + key;

  return resolvedPath;
}
