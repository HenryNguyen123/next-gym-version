"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getLogin } from "@/lib/redux/features/slices/account/account.slice";

export default function AccountHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(getLogin());
  }, [dispatch]);

  return null;
}