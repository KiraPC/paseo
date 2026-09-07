import type { EditorTargetRuntime, RemoteDestinationKind } from "./target.js";

const SSH_ONLY: readonly RemoteDestinationKind[] = ["ssh"];
const LOCAL_ONLY: readonly RemoteDestinationKind[] = [];

/**
 * Percent-encode a POSIX path for a remote URI. Each segment is encoded separately so the
 * separators and the leading slash survive, and so a space or `&` in a directory name never
 * reaches a shell as itself.
 */
export function encodeRemotePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

/**
 * Remote opens go through the editor's CLI: `--folder-uri` and `ssh://` URLs have no
 * `open -a` equivalent, so an installed application is not on its own enough. On macOS the
 * app is commonly present without the shell command — VS Code ships it behind "Shell
 * Command: Install 'code' command in PATH" — and advertising SSH there would offer an entry
 * that can only fail once the user has configured a host and clicked it.
 */
export function cliRemoteDestinationKinds(
  runtime: EditorTargetRuntime,
  commands: readonly string[],
): readonly RemoteDestinationKind[] {
  return runtime.resolveCommand(commands) === null ? LOCAL_ONLY : SSH_ONLY;
}
