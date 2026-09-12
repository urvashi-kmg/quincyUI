/**
 * Runtime configuration — loaded from public/config.json at app startup.
 *
 * Editing config.json on the server takes effect on the next page load
 * with no frontend rebuild or redeployment required.
 *
 * import.meta.env.VITE_* values are accepted as a fallback so that
 * local `vite dev` works without editing config.json.
 *
 * import.meta.env.BASE_URL (Vite's app sub-path, e.g. /POC9/) is
 * intentionally NOT part of this config — it is a build-time constant
 * used for asset paths and BrowserRouter basename.
 */

export interface AppConfig {
  /** Backend API root — e.g. http://10.1.8.47/POC9/QuincyGateway */
  apiBaseUrl: string;
  /** Full URL for SSO RegisterAndAssignRole endpoint */
  apiRegisterUrl: string;
  /** X-Api-Key header value sent on every request */
  apiXKey: string;
  /** Full URL for token-based auto-login endpoint */
  autoLoginUrl: string;
  /**
   * TEMPORARY (2026-07) — overrides the Notepad LIST query call's base URL to
   * a DB2 test server while pagination isn't deployed on the main gateway yet.
   * Empty/absent = no-op (the call falls back to apiBaseUrl as normal).
   * Remove this field, notepadListTempApiKey, and axiosClient.ts's
   * notepadListRequestConfig() once the gateway ships pagination — reverting
   * needs no other code changes, just clearing these two config.json fields.
   */
  notepadListTempBaseUrl: string;
  /** X-Api-Key sent on the Notepad LIST call when notepadListTempBaseUrl is set. */
  notepadListTempApiKey: string;
  /** SmartyStreets autocomplete key */
  smartyKey: string;
  /** SmartyStreets autocomplete endpoint */
  smartyEndpoint: string;

  /**
   * When true, the app automatically logs in using defaultUserId/defaultPassword
   * on boot and after a session expires — no manual login required.
   * Set to false to require manual login or ?key= auto-login.
   *
   * Security note: defaultPassword lives in public/config.json and is therefore
   * visible to anyone who can reach the app. Only use this mode with credentials
   * that are intentionally shared (demo accounts, kiosk/POC deployments).
   */
  defaultLogin: boolean;
  /** Username for default login mode — ignored when defaultLogin is false */
  defaultUserId: string;
  /** Password for default login mode — ignored when defaultLogin is false */
  defaultPassword: string;
}

let _config: AppConfig | null = null;

/**
 * Fetch and validate config.json.
 * Must be awaited in main.tsx before ReactDOM.render is called.
 * Throws if a required field is missing from both config.json and .env.
 */
export async function loadConfig(): Promise<void> {
  let raw: Partial<AppConfig> = {};

  try {
    const res = await fetch(`${import.meta.env.BASE_URL}config.json`, {
      cache: "no-store",
    });
    if (res.ok) {
      raw = (await res.json()) as Partial<AppConfig>;
    } else {
      console.warn(
        `[Quincy] config.json returned HTTP ${res.status} — using build-time defaults.`,
      );
    }
  } catch {
    console.warn(
      "[Quincy] config.json could not be fetched — using build-time defaults.",
    );
  }

  // config.json takes priority; VITE_* env vars are the local-dev fallback.
  const apiBaseUrl = raw.apiBaseUrl ?? import.meta.env.VITE_API_BASE_URL ?? "";
  const apiXKey =
    raw.apiXKey ?? (import.meta.env.VITE_API_X_KEY as string | undefined) ?? "";

  _config = {
    apiBaseUrl,
    apiRegisterUrl:
      raw.apiRegisterUrl ??
      (import.meta.env.VITE_API_REGISTER_URL as string | undefined) ??
      "",
    apiXKey,
    autoLoginUrl:
      raw.autoLoginUrl ??
      (import.meta.env.VITE_AUTO_LOGIN_URL as string | undefined) ??
      "",
    notepadListTempBaseUrl:
      raw.notepadListTempBaseUrl ??
      (import.meta.env.VITE_NOTEPAD_LIST_TEMP_BASE_URL as string | undefined) ??
      "",
    notepadListTempApiKey:
      raw.notepadListTempApiKey ??
      (import.meta.env.VITE_NOTEPAD_LIST_TEMP_API_KEY as string | undefined) ??
      "",
    smartyKey:
      raw.smartyKey ??
      (import.meta.env.VITE_SMARTY_KEY as string | undefined) ??
      "",
    smartyEndpoint:
      raw.smartyEndpoint ??
      (import.meta.env.VITE_SMARTY_ENDPOINT as string | undefined) ??
      "https://us-autocomplete-pro.api.smarty.com/lookup",

    defaultLogin: raw.defaultLogin ?? false,
    defaultUserId:
      raw.defaultUserId ??
      (import.meta.env.VITE_DEFAULT_USER_ID as string | undefined) ??
      "",
    defaultPassword:
      raw.defaultPassword ??
      (import.meta.env.VITE_DEFAULT_PASSWORD as string | undefined) ??
      "",
  };

  if (!_config.apiBaseUrl) {
    console.warn(
      '[Quincy] "apiBaseUrl" is empty — running in dev proxy mode. All /api/* requests will be handled by the Vite proxy.',
    );
  }
  if (!_config.apiXKey) {
    console.warn(
      '[Quincy] "apiXKey" is not configured — API requests will not include X-Api-Key.',
    );
  }
  if (
    _config.defaultLogin &&
    (!_config.defaultUserId || !_config.defaultPassword)
  ) {
    console.warn(
      '[Quincy] "defaultLogin" is true but "defaultUserId" or "defaultPassword" is missing — default login will not work.',
    );
  }

  if (import.meta.env.PROD && _config.defaultLogin) {
    throw new Error(
      '[Quincy] SECURITY: defaultLogin is enabled in production. This MUST be set to false in public/config.json for all production deployments. Aborting startup.',
    );
  }

  if (_config.defaultLogin) {
    console.warn(
      '[Quincy] WARNING: defaultLogin is enabled. This feature is intended for POC/demo use only and MUST be disabled in production environments.',
    );
  }
}

/**
 * Return the loaded config. Throws if called before loadConfig() resolves.
 * Safe to call anywhere after main.tsx bootstrap completes.
 */
export function getConfig(): AppConfig {
  if (!_config) {
    throw new Error(
      "[Quincy] getConfig() called before loadConfig() completed. Check bootstrap order in main.tsx.",
    );
  }
  return _config;
}
