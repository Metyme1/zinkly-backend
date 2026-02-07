import React from "react";
import "./DashboardHome.css";
import TotalSellerChart from "./TotalSellerChart";
import DailyOverviewChart from "./DailyOverviewChart";
import { HiMiniUserGroup } from "react-icons/hi2";
import { GrMoney } from "react-icons/gr";
import { useGetTotalBookingStatsQuery } from "../../../redux/api/slices/dashboardApi";

function DashboardHome() {
  const { data: totalBookingStats } = useGetTotalBookingStatsQuery([]);

  const {
    totalUser = 0,

    totalArtist = 0,
    balance = {},
  } = totalBookingStats || {};

  const data = [
    {
      name: "Total User",
      count: totalUser,
      textColor: "#6A5ECC",
      icon: <HiMiniUserGroup color="#6A5ECC" size={40} />,
      bgColor: "#E5E5E5",
    },
    {
      name: "Total Artist",
      count: totalArtist,
      textColor: "#3F0D47",
      icon: <HiMiniUserGroup color="#6A5ECC" size={40} />,
      bgColor: "#E5E5E5",
    },
    {
      name: "Total Earning",
      count: balance?.totalIncome,
      textColor: "#00B047",
      icon: <GrMoney color="#00B047" size={40} />,
      bgColor: "#E5E5E5",
    },

    {
      name: "Total Revenue",
      count: balance?.totalRevenue,
      textColor: "#00B047",
      icon: <GrMoney color="#00B047" size={40} />,
      bgColor: "#E5E5E5",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-4  gap-4 items-center mt-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-md p-10 "
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: `${item.bgColor}`,
                width: "100px",
                height: "100px",
                borderRadius: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item?.icon}
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  fontSize: "1.2em",
                  fontWeight: "400",
                  color: "#6A6D7C",
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  fontSize: "1.6em",
                  fontWeight: "600",
                  color: item?.textColor,
                }}
              >
                {item.count} +
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "15px",
          display: "grid",
          gridTemplateColumns: "auto auto",
          gap: "20px",
        }}
      >
        <div
          className="bg-black"
          style={{
            borderRadius: "15px",
            backgroundColor: "#fff",
            width: "100%",
            height: "550px",
            padding: "10px 20px 20px 20px",
          }}
        >
          <TotalSellerChart />
        </div>
        <div
          style={{
            borderRadius: "15px",
            backgroundColor: "#fff",
            width: "100%",
            height: "550px",
            padding: "10px 20px 20px 20px",
          }}
        >
          <DailyOverviewChart />
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
