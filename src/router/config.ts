const routes = [
  {
    path: ["/", "/home"],
    exact: true,
    component: "Home",
  },
  {
    path: ["/verify/:token"],
    exact: false,
    component: "Verify",
  },
  {
    path: ["/forget/:token"],
    exact: false,
    component: "Forget",
  },
  {
    path: ["/login"],
    exact: true,
    component: "Login",
  },
  {
    path: ["/settings"],
    exact: true,
    component: "Settings",
  },
  {
    path: ["/info"],
    exact: true,
    component: "Info",
  },
];

export default routes;
