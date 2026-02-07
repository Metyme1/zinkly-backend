import { Input, Layout, Badge } from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { BiCalendarCheck } from "react-icons/bi";
import { FaHotTubPerson } from "react-icons/fa6";
import { LuUser } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { FaStore, FaFire } from "react-icons/fa";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FiUserPlus, FiLogOut } from "react-icons/fi";
import musician from "../../assets/guitarist.png";

import { RiNotification2Line } from "react-icons/ri";
import { calc } from "antd/es/theme/internal";
import { useGetUserProfileQuery } from "../../redux/api/slices/userApi";
import { imageUrl } from "../../redux/api/baseApi";
import { removeToken } from "../../lib/tokenManagement";
import Swal from "sweetalert2";
const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const { data: user } = useGetUserProfileQuery({});
  const { pathname } = useLocation();
  const [setting, setSetting] = useState(false);

  const settingsRoutes = [
    "/setting",
    "/categories",
    "/disclaimer",
    "/terms",
    "/admin-profile",
  ];

  useEffect(() => {
    // Check if the current route matches any settings-related routes
    if (settingsRoutes.includes(pathname)) {
      setSetting(true);
    } else {
      setSetting(false);
    }
  }, [pathname]);
  const navigate = useNavigate();
  // console.log(setting);
  const handleLogOut = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        removeToken();
        Swal.fire({
          title: "Logged Out Successfully",
          text: "You have been logged out. Redirecting to the login page...",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        // Redirect to login page
        navigate("/login");
        window.location.reload();
      }
    });
  };

  const linkItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: <MdOutlineDashboard size={24} />,
    },
    {
      title: "User Details",
      path: "/user-list",
      icon: <LuUser size={24} />,
    },
    {
      title: "Musician",
      path: "/musician",
      icon: <FaHotTubPerson size={24} />,
    },
    // {
    //   title: "Booking",
    //   path: "/booking",
    //   icon: <BiCalendarCheck size={24} />,
    // },
    {
      title: "Transaction",
      path: "/order-transaction-list",
      icon: <LiaFileInvoiceDollarSolid size={24} />,
    },
    {
      title: "Add admin",
      path: "/make-admin",
      icon: <FiUserPlus size={24} />,
    },

    {
      title: "Settings",
      path: "/setting",
      icon: <IoSettingsOutline size={24} />,
      option: true,
      optionsItems: [
        {
          title: "Categories",
          path: "/categories",
        },
        {
          title: "Disclaimer",
          path: "/disclaimer",
        },
        {
          title: "Terms & Condition",
          path: "/terms",
        },
        {
          title: "Profile",
          path: "/admin-profile",
        },
      ],
    },
  ];

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Sider
        width="17vw"
        trigger={false}
        style={{
          position: "fixed",
          height: "calc(100vh - 2px)",
          paddingBottom: "60px",
          zIndex: 2,
          backgroundColor: "white",
        }}
      >
        <div
          className="logo"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
            width: "100%",
            // height: 60,
            padding: "0 0 20px 0",
          }}
        >
          <Link to="/">
            <img src={Logo} height="40px" />
          </Link>
        </div>

        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            height: "100%",
            marginTop: 0,
          }}
        >
          {linkItems.map((item, index) => (
            <li
              key={index}
              style={{
                width: "100%",
                position: "relative",
                paddingLeft: "40px",
              }}
            >
              {item.option ? (
                <Link
                  to={item.path}
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    onClick={() => {
                      setSetting(!setting);
                    }}
                    style={{
                      display: "flex",

                      color: setting ? "white" : "#6A6D7C",
                      alignItems: "flex-end",
                      margin: "auto  0 auto 0",
                      gap: "14px",
                      background: setting ? "#2461CB" : "white",
                      width: "100%",
                      padding: "10px 10px",
                      borderRadius: "100px 0px 0px 100px",
                    }}
                  >
                    <div style={{ height: "24px" }}>{item.icon}</div>
                    <div
                      style={{
                        fontSize: "14px",
                        textAlign: "center",
                        height: "fit-content",
                      }}
                    >
                      {item.title}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flexDirection: "column",
                      marginTop: setting ? "15px" : 0,
                      marginBottom: "-7px",
                    }}
                  >
                    {setting &&
                      item.optionsItems.map((optionItem, optionIndex) => (
                        <Link
                          to={optionItem.path}
                          key={optionIndex}
                          style={{
                            // width: "150px",
                            height: "50px",
                            borderRadius: "0 10px 10px 0",
                            width: "100%",
                          }}
                        >
                          <Link
                            to={optionItem.path}
                            style={{
                              display: "flex",

                              color:
                                optionItem.path === pathname
                                  ? "#fff"
                                  : "#6A6D7C",
                              alignItems: "flex-end",
                              margin: "auto  0 auto 0",

                              gap: "14px",
                              background:
                                optionItem.path === pathname
                                  ? "#ADADAD"
                                  : "white",
                              width: "100%",
                              padding: "10px 50px",
                              borderRadius: "100px 0px 0px 100px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "14px",
                                textAlign: "center",
                                height: "fit-content",
                              }}
                            >
                              {optionItem.title}
                            </div>
                          </Link>
                        </Link>
                      ))}
                  </div>
                </Link>
              ) : (
                <Link
                  to={item.path}
                  style={{
                    display: "flex",
                    color: item.path === pathname ? "white" : "#6A6D7C",
                    alignItems: "flex-end",
                    margin: "auto  0 auto 0",
                    gap: "14px",
                    background: item.path === pathname ? "#2461CB" : "white",
                    width: "100%",
                    padding: "10px 10px",
                    borderRadius: "100px 0px 0px 100px",
                  }}
                >
                  <div style={{ height: "24px" }}>{item.icon}</div>
                  <div
                    style={{
                      fontSize: "14px",
                      textAlign: "center",
                      height: "fit-content",
                    }}
                  >
                    {item.title}
                  </div>
                </Link>
              )}
            </li>
          ))}
          {/* Log out as a button */}
          <li
            onClick={handleLogOut}
            style={{
              width: "100%",
              position: "relative",
              paddingLeft: "40px",
            }}
          >
            <button
              // Replace with your logout handler
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "14px",
                background: "white",
                width: "100%",
                padding: "10px 10px",
                borderRadius: "100px 0px 0px 100px",
                border: "none",
                cursor: "pointer",
                color: "#6A6D7C",
              }}
            >
              <div style={{ height: "24px" }}>
                <FiLogOut size={24} />
              </div>
              <div
                style={{
                  fontSize: "14px",
                  textAlign: "center",
                  height: "fit-content",
                }}
              >
                Log out
              </div>
            </button>
          </li>{" "}
        </ul>
      </Sider>

      <Layout>
        <Header
          style={{
            position: "fixed",
            width: "100%",
            height: "80px",
            zIndex: 1,
            padding: 0,
            background: "white",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "75px",
            paddingLeft: "17vw",
          }}
        >
          <div
            style={{
              width: "220px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              justifyContent: "space-between",
            }}
          >
            <Link to="/notification">
              <div
                style={{
                  background: "#F2F2F2",
                  width: 45,
                  height: 45,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  position: "relative",
                }}
              >
                <RiNotification2Line color="#2461CB" size={22} />

                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    background: "#00B047",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    position: "absolute",
                    top: 8,
                    right: 10,
                    fontWeight: "500",
                    fontSize: 10,
                  }}
                >
                  5
                </div>
              </div>
            </Link>
            <Link
              to={"/admin-profile"}
              style={{
                height: "42px",
                cursor: "pointer",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "10px",
              }}
            >
              <img
                src={`${imageUrl}/${user?.profile}`}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "100%",
                  borderColor: "#2461CB",
                  borderWidth: 2,
                }}
                alt=""
              />
              <h2
                style={{
                  color: "#2461CB",
                  fontSize: "16px",
                  fontWeight: "600",
                  width: 200,
                }}
              >
                {user?.name}
              </h2>
            </Link>
          </div>
        </Header>

        <Content
          style={{
            marginTop: "60px",
            marginBottom: "20px",
            marginLeft: "17%",
            marginRight: "40px",

            overflow: "auto",
            padding: "20px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
