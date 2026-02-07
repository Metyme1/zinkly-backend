import React, { useState } from "react";
import {  IoSearchOutline } from "react-icons/io5";
import {  Input,  Select,  Table } from "antd";
import Swal from "sweetalert2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoArrowUpRight } from "react-icons/go";
import Title from "../../Shared/Title";
import TransactionModal from "../../Components/TransactionModal";
import BookingDetailsModal from "../../Components/BookingDetailsModal";

const data = [
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    }, 
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Completed",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Rejected",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Completed",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Rejected",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Completed",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Pending",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Completed",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Rejected",
  },
  {
    key: "1",

    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Completed",
  },
  {
    key: "1",

    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Pending",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Completed",
  },
  {
    key: "1",
    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Rejected",
  },
  {
    key: "1",

    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Completed",
  },
  {
    key: "1",

    user: {
      name: "Mr. Mahmud",
      img: "https://i.ibb.co/B2xfD8H/images.png",
    },
    musician_name: "ED Sheeran", 
    musician_image:"https://s3-alpha-sig.figma.com/img/3215/31da/7717f3b88e4b580d3a8d79d74b866964?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZcHk7qseAxQaJmxmmrj~fy8y4CukRTmD~Fd-MzCGwSMPYXCUzruiRXPS8GWuptR0l2~DGHxcchaejOYgycmNDuMiZnjPE2ErthBNZYU0kYwml~CFGX22YYO3BYEFrYNknt2MWBIq6UrTjUbv2eN~K~3YNKeLL5FgKtAd1TjwVxuJP4E4DqJZMy8a9HdklrKipwB8WwhnRgIZVBfhopV5mPvatTODxn1LeubH0VwYg~y0m1QY93QjgUjsW6EMY3N9teGltQyZNzGhcRaQNbb-88MTkmHkG~N3l0KbTWb2kWroyygyPOOCcGDCZtzyAO6JggHnoGPzRLHoFEqzo4LIHQ__" ,
    time: "10:00 AM",
    booking_date: "8/16/13",
    status: "Pending",
  },
  
];


const Booking = () => { 
    const [page, setPage] = useState(
        new URLSearchParams(window.location.search).get("page") || 1
      );
      const [open, setOpen] = useState(false)
    
    
      const handleDelete = (id) => {
        Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      };
    
    
      const columns = [
        {
          title: "S.No",
          dataIndex: "key",
          key: "key",
        },
        {
          title: "User",
          dataIndex: "user",
          key: "user",
          render: (user) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <img
                  style={{
                    height: 36,
                    width: 40,
                    borderRadius: "100%",
                    backgroundSize: "cover",
                  }}
                  src={user?.img}
                  alt="ok"
                />
                <p
                  style={{
                    letterSpacing: 0.4,
    
                    color: "#666666",
    
                    fontWeight: "400",
                  }}
                >
                  {user?.name}
                </p>
              </div>
            );
          },
        },
    
        {
          title: "Musician Name",
          dataIndex: "musician_name",
          key: "musician_name", 
          render:(_, record)=>(
            <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              style={{
                height: 36,
                width: 40,
                borderRadius: "100%",
                backgroundSize: "cover",
              }}
              src={record?.musician_image}
              alt="ok"
            />
            <p
              style={{
                letterSpacing: 0.4,
    
                color: "#666666",
    
                fontWeight: "400",
              }}
            >
              {record?.musician_name}
            </p>
          </div>
          )
        },
        {
          title: " Date",
          dataIndex: "booking_date",
          key: "booking_date",
        }, 
        {
          title: "Time",
          dataIndex: "time",
          key: "time",
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (_, record) => (
            <p
              style={{
                letterSpacing: 0.4,
                fontSize: "#666666",
                fontWeight: "400",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: "100%",
                  background:
                    record?.status === "Completed" ? "#00B047" : record?.status === "Rejected" ? "#CB4224" : record?.status === "Pending" && "#2461CB" ,
                  color: "white",
                  display: "flex",
                }}
              ></span>
    
              <span
                style={{
                  color:  record?.status === "Completed" ? "#00B047" : record?.status === "Rejected" ? "#CB4224" : record?.status === "Pending" && "#2461CB" ,
                }}
              >
                {record?.status}
              </span>
            </p>
          ),
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          render: (_, record) => (
            <div
              style={{
                display: "flex", 
                alignItems: "center",
                gap: 8,
              }}
            >
              <button
                onClick={() => setOpen(true)}
                style={{
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  background: "white",
                }}
              >
            <GoArrowUpRight className="text-xl font-bold text-[#2461CB] " />
              </button> 
    
              <button onClick={()=>handleDelete(record?.key)}>
              <RiDeleteBin6Line  className="text-xl font-semibold text-red-500" />
              </button> 
    
            </div>
          ),
        },
      ]; 
    
      const handleChange = (value) => {
        console.log(`selected ${value}`);
      };  
    
      const status=[
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' },
      ]
    
    
      const handlePageChange = (page) => {
        setPage(page);
        const params = new URLSearchParams(window.location.search);
        params.set("page", page);
        window.history.pushState(null, "", `?${params.toString()}`);
      };
     
    return (
        <div>
        <div
          style={{
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "16px 0",
            }}
          >
            <div>
              <Title className="">
              Booking Details
              </Title>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Input  placeholder="Search Something...." prefix={<IoSearchOutline className="text-2xl text-gray-400" />} style={{ width:"400px" , height:"40px"}} />
            <Select
        defaultValue="Status"
        style={{ width: 120 , height:"40px" }}
        onChange={handleChange}
        options={status}
      />
           
            </div>
          </div>
          <div>
            <Table
              columns={columns}
              dataSource={data}
              pagination={{
                pageSize: 10,
                defaultCurrent: parseInt(page),
                onChange: handlePageChange,
                total: 85,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} out of ${total}`,
                defaultPageSize: 20,
                // defaultCurrent: 1,
                style: {
                  marginBottom: 20,
                  marginLeft: 20,
                  marginRight: 20,
                  width: "100%",
                  display: "flex",
                  // gap: 10,
                  // justifyContent: "space-between",
                },
              }}
            />
          </div>
        </div>
     <BookingDetailsModal   open={open} setOpen={setOpen} />
      </div>
    );
};

export default Booking;