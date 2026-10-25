



// import { useRouter } from "next/navigation";

// import { apiClient } from "@/lib/api/client";
// import { useAppDispatch } from "@/lib/redux/hooks";
// import { logoutUser } from "@/lib/redux/slices/account.slice";
// import { APP_ROUTES } from "@/lib/auth/routes";

// // Bên trong component:
// const dispatch = useAppDispatch();
// const router = useRouter();

// async function handleLogout() {
//   try {
//     await apiClient.post("/auth/logout");
//   } finally {
//     await dispatch(logoutUser());
//     router.replace(APP_ROUTES.login);
//     router.refresh();
//   }
// }
