export default [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "Học sinh",
        to: "/admin/user",
        icon: "cil-user",
      },
      {
        _name: "CSidebarNavItem",
        name: "Bài viết",
        to: "/admin/topup",
        icon: "cil-library-add",
      },
      {
        _name: "CSidebarNavItem",
        name: "Các order bài viết",
        to: "/admin/transfer",
        icon: "cil-transfer",
      },
      {
        _name: "CSidebarNavItem",
        name: "Giáo viên",
        to: "/admin/user",
        icon: "cil-user",
      },
      {
        _name: "CSidebarNavItem",
        name: "Thưởng",
        to: "/admin/reward",
        icon: "cil-gift",
      },
      {
        _name: "CSidebarNavItem",
        name: "Thông báo",
        to: "/admin/notification",
        icon: "cil-bell",
      },
      {
        _name: "CSidebarNavItem",
        name: "Tin tức",
        to: "/admin/news",
        icon: "cil-newspaper",
      },
    ],
  },
];
