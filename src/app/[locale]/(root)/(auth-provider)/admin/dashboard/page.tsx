"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const dashboardData = [
  { name: "T2", users: 400, posts: 240, comments: 221 },
  { name: "T3", users: 300, posts: 139, comments: 221 },
  { name: "T4", users: 200, posts: 980, comments: 229 },
  { name: "T5", users: 278, posts: 390, comments: 200 },
  { name: "T6", users: 189, posts: 480, comments: 218 },
  { name: "T7", users: 239, posts: 380, comments: 250 },
  { name: "CN", users: 349, posts: 430, comments: 210 },
];

const stats = [
  { label: "Tổng người dùng", value: "12,543", change: "+2.5%" },
  { label: "Tổng bài viết", value: "45,231", change: "+12.3%" },
  { label: "Tổng bình luận", value: "89,456", change: "+8.1%" },
  { label: "Báo cáo chưa xử lý", value: "23", change: "-5.2%" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Chào mừng trở lại, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <span className="text-xs text-green-600 dark:text-green-400">
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Hoạt động tuần này
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="users" fill="var(--primary)" />
              <Bar dataKey="posts" fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Xu hướng bình luận
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="var(--chart-3)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Hoạt động gần đây
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Người dùng mới đăng ký
                </p>
                <p className="text-xs text-muted-foreground">2 giờ trước</p>
              </div>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                Mới
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
