// 透過 GitHub REST API 觸發 workflow_dispatch 並查詢狀態
// 使用者 token 存在 localStorage，僅用於對 api.github.com 的呼叫

const TOKEN_KEY = "ai-infra-github-pat";

const OWNER = "gmcycle7";
const REPO = "ai-infra-stock-map";
const WORKFLOW = "update-prices.yml";

export function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export interface WorkflowRun {
  id: number;
  status: string; // queued | in_progress | completed
  conclusion: string | null; // success | failure | cancelled | null
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at?: string;
}

interface ApiError {
  status: number;
  message: string;
}

async function ghFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  if (!token) throw new Error("尚未設定 GitHub Token（請先到 [設定 Token] 區塊輸入）");
  const r = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  if (!r.ok) {
    const body = await r.text();
    const err: ApiError = {
      status: r.status,
      message: body || r.statusText,
    };
    throw new Error(`GitHub API ${err.status}: ${err.message.slice(0, 200)}`);
  }
  // workflow_dispatch 回 204 No Content
  if (r.status === 204) return undefined as unknown as T;
  return r.json() as Promise<T>;
}

/** 驗證 token 有效並回傳 GitHub username */
export async function verifyToken(): Promise<{ login: string; scopes: string }> {
  const token = getStoredToken();
  if (!token) throw new Error("尚未設定 token");
  const r = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!r.ok) {
    throw new Error(`Token 認證失敗（${r.status}）`);
  }
  const scopes = r.headers.get("x-oauth-scopes") ?? "";
  const data = (await r.json()) as { login: string };
  return { login: data.login, scopes };
}

/** 觸發 update-prices workflow */
export async function triggerWorkflow(): Promise<void> {
  await ghFetch(
    `/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
    {
      method: "POST",
      body: JSON.stringify({ ref: "main" }),
    },
  );
}

/** 取最近 N 個 workflow run（指定 workflow） */
export async function listRecentRuns(perPage = 5): Promise<WorkflowRun[]> {
  const data = await ghFetch<{ workflow_runs: WorkflowRun[] }>(
    `/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=${perPage}`,
  );
  return data.workflow_runs ?? [];
}

/** 取單一 run 詳情 */
export async function getRun(runId: number): Promise<WorkflowRun> {
  return await ghFetch<WorkflowRun>(`/repos/${OWNER}/${REPO}/actions/runs/${runId}`);
}

export const REPO_URLS = {
  actions: `https://github.com/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}`,
  newToken: "https://github.com/settings/tokens/new?scopes=workflow&description=stock-map-update",
  manageTokens: "https://github.com/settings/tokens",
};
