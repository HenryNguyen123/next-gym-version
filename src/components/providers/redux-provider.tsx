"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/redux/store";

type ReduxProviderProps = {
  children: ReactNode;
};

export default function ReduxProvider({
  children,
}: ReduxProviderProps) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
