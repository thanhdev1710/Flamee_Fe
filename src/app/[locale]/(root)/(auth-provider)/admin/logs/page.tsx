/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw } from "lucide-react";
import { CONFIG } from "@/global/config";

type LogEntry = {
  level: string;
  time: string;
  caller: string;
  msg: string;
  status: number;
  method: string;
  path: string;
  clientIP: string;
  userAgent: string;
  userId: string;
  latency: number;
};

type LogsResponse = {
  page: number;
  limit: number;
  total: number;
  data: LogEntry[];
};

const LEVEL_STYLES: Record<string, string> = {
  INFO: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-700",
  WARN: "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
  WARNING:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
  ERROR:
    "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200 border-red-300 dark:border-red-700",
  DEBUG:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
};

const STATUS_STYLES = {
  success:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
  warning:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
  error:
    "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200 border-red-300 dark:border-red-700",
};

function formatLatency(latency: number) {
  if (!latency || Number.isNaN(latency)) return "-";
  if (latency < 0.001) return `${(latency * 1000).toFixed(2)} ms`;
  return `${latency.toFixed(3)} s`;
}

function formatTime(time: string) {
  if (!time) return "-";
  const d = new Date(time);
  if (Number.isNaN(d.getTime())) return time;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [level, setLevel] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [autoRefresh, setAutoRefresh] = useState(false);

  const totalPages = useMemo(
    () => (total > 0 ? Math.ceil(total / limit) : 1),
    [total, limit]
  );

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (level) params.set("level", level);
      if (method) params.set("method", method);
      if (path) params.set("path", path);
      if (status) params.set("status", status);

      const res = await fetch(
        `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/logs?` + params.toString(),
        {
          method: "GET",
          headers: {
            "X-API-KEY": CONFIG.API.X_API_KEY,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Request failed with ${res.status}`);
      }

      const data: LogsResponse = await res.json();
      setLogs(data.data || []);
      setTotal(data.total || 0);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Không thể tải logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, level, method, path, status]);

  useEffect(() => {
    if (!autoRefresh) return;

    const id = setInterval(() => {
      fetchLogs();
    }, 3000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, page, limit, level, method, path, status]);

  const handleResetFilters = () => {
    setLevel("");
    setMethod("");
    setPath("");
    setStatus("");
    setPage(1);
  };

  const getStatusStyle = (statusCode: number) => {
    if (statusCode >= 500) return STATUS_STYLES.error;
    if (statusCode >= 400) return STATUS_STYLES.warning;
    return STATUS_STYLES.success;
  };

  return (
    <div className="min-h-svh bg-background text-foreground px-4 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
            <Badge
              variant="outline"
              className="text-xs uppercase tracking-widest"
            >
              Read only
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Monitor API requests from your Flamee Auth service in real time.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-mono font-semibold">{total ?? 0}</span>
            </div>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label
                htmlFor="auto-refresh"
                className="cursor-pointer text-sm font-medium"
              >
                Auto refresh
              </Label>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={fetchLogs}
            disabled={loading}
            className="gap-2 bg-transparent"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Level Filter */}
            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium">
                Level
              </Label>
              <Select
                value={level || "ALL"}
                onValueChange={(v) => {
                  setPage(1);
                  setLevel(v === "ALL" ? "" : v);
                }}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Method Filter */}
            <div className="space-y-2">
              <Label htmlFor="method" className="text-sm font-medium">
                Method
              </Label>
              <Input
                id="method"
                placeholder="GET, POST..."
                value={method}
                onChange={(e) => {
                  setPage(1);
                  setMethod(e.target.value.toUpperCase());
                }}
              />
            </div>

            {/* Path Filter */}
            <div className="space-y-2">
              <Label htmlFor="path" className="text-sm font-medium">
                Path
              </Label>
              <Input
                id="path"
                placeholder="/api/v1/auth/login"
                value={path}
                onChange={(e) => {
                  setPage(1);
                  setPath(e.target.value);
                }}
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status Code
              </Label>
              <Input
                id="status"
                placeholder="200, 401..."
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Label htmlFor="limit" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setPage(1);
                  setLimit(Number(v));
                }}
              >
                <SelectTrigger id="limit" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="w-full md:w-auto"
            >
              Reset Filters
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Page{" "}
                <span className="font-mono font-semibold text-foreground">
                  {page}
                </span>{" "}
                /{" "}
                <span className="font-mono font-semibold text-foreground">
                  {totalPages}
                </span>
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated:{" "}
              <span className="font-mono font-semibold text-foreground">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
              </span>
            </div>
          </div>

          <ScrollArea className="w-full">
            <div className="max-h-[600px]">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-muted">
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      Path
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      Message / Caller
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      Client / User
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading && logs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading logs...
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-destructive"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && logs.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-muted-foreground"
                      >
                        No logs found for current filters.
                      </td>
                    </tr>
                  )}

                  {logs.map((log, idx) => {
                    const lvl = log.level?.toUpperCase() || "INFO";
                    const lvlClass =
                      LEVEL_STYLES[lvl] ||
                      "bg-muted text-foreground border-border";
                    const statusClass = getStatusStyle(log.status);

                    return (
                      <tr
                        key={`${log.time}-${log.path}-${idx}`}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-3 font-mono text-xs">
                          {formatTime(log.time)}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${lvlClass}`}
                          >
                            {lvl}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono font-medium ${statusClass}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-xs font-medium">
                          {log.method}
                        </td>
                        <td className="px-6 py-3 font-mono text-xs">
                          <div className="truncate max-w-xs" title={log.path}>
                            {log.path}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            latency: {formatLatency(log.latency)}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-xs">
                          <div className="truncate font-mono max-w-sm">
                            {log.msg}
                          </div>
                          <div className="mt-1 truncate text-muted-foreground text-xs">
                            {log.caller}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-xs">
                          <div className="font-mono font-medium">
                            {log.clientIP || "-"}
                          </div>
                          <div className="mt-1 line-clamp-2 text-muted-foreground text-xs max-w-sm">
                            {log.userAgent}
                          </div>
                          {log.userId && (
                            <div className="mt-1 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              userId: {log.userId}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ScrollArea>

          <div className="border-t border-border px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-mono font-semibold text-foreground">
                {logs.length || 0}
              </span>{" "}
              of{" "}
              <span className="font-mono font-semibold text-foreground">
                {total ?? 0}
              </span>{" "}
              logs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <span className="px-3 py-1 rounded border border-border text-sm font-mono">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
