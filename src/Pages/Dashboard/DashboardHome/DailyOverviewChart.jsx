import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useGetTotalUserStatsQuery } from "../../../redux/api/slices/dashboardApi";

const DailyOverviewChart = () => {
  const [year, setYear] = useState(2024);
  const { data: totalUserStats } = useGetTotalUserStatsQuery([
    { name: "year", value: year },
  ]);

  const items = [
    {
      label: 2023,
      key: "2023",
    },
    {
      label: 2024,
      key: "2024",
    },
    {
      label: 2025,
      key: "2025",
    },
    {
      label: 2026,
      key: "2026",
    },
  ];

  const onClick = ({ key }) => {
    setYear(key);
  };

  /* useEffect(() => {
    if(year !== 2024){
      window.history.pushState(null, "", `?year=${year}`);
    }
  }, [year]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const yearParam = searchParams.get('year');
    if (yearParam) {
      const parsedYear = parseInt(yearParam, 10);
      setYear(parsedYear);
    } else {
      window.location.reload();
    }
  }, []); */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <p
          style={{
            fontSize: "18px",
            fontWeight: "500",
            color: "#555555",
          }}
        >
          Total users statistics
        </p>
        <Dropdown menu={{ items, onClick }}>
          <p
            style={{
              // width: "79px",
              cursor: "pointer",
              color: "#717171",
              border: "1px solid #E9E9E9",
              borderRadius: "4px",
              padding: "4px 12px",
            }}
            onClick={(e) => e.preventDefault()}
          >
            {year}
            <DownOutlined style={{ paddingLeft: "18px" }} color="#717171" />
          </p>
        </Dropdown>
      </div>

      {/* <div style={{display: "flex", alignItems: "center", gap: "31px", marginBottom: "19px"}}>
          <div>
            <p style={{fontSize: "12px", fontWeight: 400, color: "#808080"}}>Overly Growth</p>
            <h1 style={{fontSize: "14px", fontWeight: 700, color: "#2F2F2F"}}>38.38%</h1>
          </div>
          <div>
            <p style={{fontSize: "12px", fontWeight: 400, color: "#808080"}}>Monthly</p>
            <h1 style={{fontSize: "14px", fontWeight: 700, color: "#2F2F2F"}}>15.5%</h1>
          </div>
          <div>
            <p style={{fontSize: "12px", fontWeight: 400, color: "#808080"}}>Daily</p>
            <h1 style={{fontSize: "14px", fontWeight: 700, color: "#2F2F2F"}}>58.50%</h1>
          </div>
    </div> */}
      <ResponsiveContainer width={"100%"} height={420}>
        <LineChart data={totalUserStats} barGap={100}>
          <CartesianGrid horizontal vertical={false} />
          <XAxis
            dataKey="name"
            padding="gap"
            minTickGap={2}
            fontSize="12px"
            fontWeight="400"
            strokeOpacity={0}
          />
          <YAxis
            tickCount={15}
            width={40}
            fontSize="12px"
            fontWeight="400"
            strokeOpacity={0}
          />

          <Tooltip />
          <Line
            connectNulls
            type="linear"
            dataKey="user"
            stroke="#734D2C"
            fill="#2461CB"
          />
          <Line
            connectNulls
            type="linear"
            dataKey="artist"
            stroke="#734D2C"
            fill="#2461CB"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyOverviewChart;
