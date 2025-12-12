"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "./userSlice";


export default function HydrateUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      dispatch(addUser(JSON.parse(stored)));
    }
  }, []);

  return null;
}
