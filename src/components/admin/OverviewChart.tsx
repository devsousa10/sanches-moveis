"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface OverviewChartProps {
    data: { name: string; total: number }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `R$${value}`}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#000",
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                        }}
                        itemStyle={{ color: "#fff", fontWeight: "bold" }}
                        labelStyle={{ color: "#9ca3af", marginBottom: "4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}
                        cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#000000"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#000" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}