import type {RoutesPaths} from './routes.js';

export function resolvePath(
  key: RoutesPaths,
  params: string[][] | Record<string, string> | string | URLSearchParams = {},
) {
  let resolvedPath = '/';
  const query = new URLSearchParams(params);

  resolvedPath = resolvedPath + key + (query.size > 0 ? '?' + query.toString() : '');

  return resolvedPath;
}
