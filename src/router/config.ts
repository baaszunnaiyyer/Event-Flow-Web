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
];

export default routes;
