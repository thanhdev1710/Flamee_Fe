/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import { usePostDashboard } from "@/services/post.hook";
import { useUserDashboard } from "@/services/user.hook";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

// Icons
const TrendingUpIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-foreground text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value.toLocaleString("vi-VN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { data: userDash } = useUserDashboard();
  const { data: postDash } = usePostDashboard();

  const totalUsers = userDash?.count ?? 0;
  const totalPosts = postDash?.count ?? 0;
  const avgUsersPerDay = totalUsers > 0 ? Math.floor(totalUsers / 7) : 0;
  const avgPostsPerDay = totalPosts > 0 ? Math.floor(totalPosts / 7) : 0;
  const postsPerUser =
    totalUsers > 0 ? (totalPosts / totalUsers).toFixed(2) : "0";

  const lastDayUsers = userDash?.weekly?.[6]?.users ?? 0;
  const lastDayPosts = postDash?.weekly?.[6]?.posts ?? 0;
  const userGrowth =
    lastDayUsers > 0
      ? ((lastDayUsers / (avgUsersPerDay || 1)) * 100 - 100).toFixed(1)
      : "0";
  const postGrowth =
    lastDayPosts > 0
      ? ((lastDayPosts / (avgPostsPerDay || 1)) * 100 - 100).toFixed(1)
      : "0";

  const chartData = DAYS.map((day, i) => ({
    name: day,
    users: userDash?.weekly?.[i]?.users ?? 0,
    posts: postDash?.weekly?.[i]?.posts ?? 0,
  }));

  const pieData = [
    { name: "Người dùng", value: totalUsers },
    { name: "Bài viết", value: totalPosts },
  ];

  const userChartData = userDash?.weekly?.map((d) => d.users) ?? [];
  const postChartData = postDash?.weekly?.map((d) => d.posts) ?? [];

  const recent = [...(userDash?.recent ?? []), ...(postDash?.recent ?? [])]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 20);

  const userActivities = userDash?.recent?.length ?? 0;
  const postActivities = postDash?.recent?.length ?? 0;
  const totalActivity =
    userChartData.reduce((a, c) => a + c, 0) +
    postChartData.reduce((a, c) => a + c, 0);

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between items-start md:items-center md:flex-row gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Tổng quan chi tiết hệ thống -{" "}
            {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow border border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">
                Tổng Người dùng
              </p>
              <p className="mt-3 text-3xl font-bold text-chart-1">
                {totalUsers.toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Trung bình: {avgUsersPerDay}/ngày
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-1/10">
              <div className="text-chart-1">
                <UsersIcon />
              </div>
            </div>
          </div>
          {userGrowth !== "0" && (
            <div className="flex items-center gap-1 mt-3">
              <TrendingUpIcon />
              <span
                className={`text-xs font-semibold ${
                  Number(userGrowth) > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Number(userGrowth) > 0 ? "+" : ""}
                {userGrowth}% vs trung bình
              </span>
            </div>
          )}
        </Card>

        {/* Total Posts Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow border border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">
                Tổng Bài viết
              </p>
              <p className="mt-3 text-3xl font-bold text-chart-2">
                {totalPosts.toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Trung bình: {avgPostsPerDay}/ngày
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-2/10">
              <div className="text-chart-2">
                <FileIcon />
              </div>
            </div>
          </div>
          {postGrowth !== "0" && (
            <div className="flex items-center gap-1 mt-3">
              <TrendingUpIcon />
              <span
                className={`text-xs font-semibold ${
                  Number(postGrowth) > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Number(postGrowth) > 0 ? "+" : ""}
                {postGrowth}% vs trung bình
              </span>
            </div>
          )}
        </Card>

        {/* Posts per User */}
        <Card className="p-6 hover:shadow-lg transition-shadow border border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">
                Bài viết/Người dùng
              </p>
              <p className="mt-3 text-3xl font-bold text-chart-3">
                {postsPerUser}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Tỉ lệ engagement
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-3/10">
              <div className="text-chart-3">
                <ActivityIcon />
              </div>
            </div>
          </div>
        </Card>

        {/* Total Weekly Activity */}
        <Card className="p-6 hover:shadow-lg transition-shadow border border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">
                Hoạt động tuần
              </p>
              <p className="mt-3 text-3xl font-bold text-chart-4">
                {totalActivity.toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Tổng hoạt động tuần này
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-4/10">
              <div className="text-chart-4">
                <TrendingUpIcon />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 - Bar and Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6 border border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Hoạt động hàng ngày
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="users"
                fill="var(--chart-1)"
                name="Người dùng"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="posts"
                fill="var(--chart-2)"
                name="Bài viết"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart */}
        <Card className="p-6 border border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Xu hướng tăng trưởng
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="var(--chart-1)"
                strokeWidth={3}
                dot={{ fill: "var(--chart-1)", r: 5 }}
                activeDot={{ r: 7 }}
                name="Người dùng"
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="var(--chart-2)"
                strokeWidth={3}
                dot={{ fill: "var(--chart-2)", r: 5 }}
                activeDot={{ r: 7 }}
                name="Bài viết"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 - Area and Composed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <Card className="p-6 border border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Phân tích khu vực
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--chart-1)"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Người dùng"
              />
              <Area
                type="monotone"
                dataKey="posts"
                stroke="var(--chart-2)"
                fillOpacity={1}
                fill="url(#colorPosts)"
                name="Bài viết"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 border border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Tỉ lệ Người dùng / Bài viết
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value, percent }) =>
                  `${name}: ${value.toLocaleString("vi-VN")} (${(
                    percent * 100
                  ).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="var(--foreground)"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => value.toLocaleString("vi-VN")}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Hoạt động người dùng
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {userActivities}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center text-chart-1">
              <UsersIcon />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Hoạt động bài viết
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {postActivities}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center text-chart-2">
              <FileIcon />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Tổng hoạt động hôm nay
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {(userDash?.weekly?.[6]?.users ?? 0) +
                  (postDash?.weekly?.[6]?.posts ?? 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center text-chart-3">
              <ActivityIcon />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Hoạt động gần đây ({recent.length} mục)
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recent.length > 0 ? (
            recent.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted p-4 rounded-lg border border-border/50 hover:border-chart-1/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      "type" in item && item.type === "user"
                        ? "bg-chart-1/10 text-chart-1"
                        : "bg-chart-2/10 text-chart-2"
                    }`}
                  >
                    {"type" in item && item.type === "user" ? (
                      <UsersIcon />
                    ) : (
                      <FileIcon />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {item.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID:{" "}
                      {"userId" in item
                        ? item.userId
                        : ("postId" in item && item.postId) || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.time).toLocaleTimeString("vi-VN")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.time).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Không có hoạt động nào
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
