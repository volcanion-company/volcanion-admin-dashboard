'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PolicyIcon from '@mui/icons-material/Policy';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { useAppSelector } from '@/store';
import { ROUTES, THEME_CONFIG } from '@/lib/constants';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/constants';

interface MenuItem {
  title: string;
  path?: string;
  icon: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Tổng quan',
    path: ROUTES.DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    title: 'Quản lý người dùng',
    path: ROUTES.USERS,
    icon: <PeopleIcon />,
    permissions: [PERMISSIONS.USERS_READ],
  },
  {
    title: 'Phân quyền',
    icon: <SecurityIcon />,
    children: [
      {
        title: 'Vai trò',
        path: ROUTES.ROLES,
        icon: <VpnKeyIcon />,
        permissions: [PERMISSIONS.ROLES_READ],
      },
      {
        title: 'Quyền hạn',
        path: ROUTES.PERMISSIONS,
        icon: <VpnKeyIcon />,
        permissions: [PERMISSIONS.PERMISSIONS_READ],
      },
      {
        title: 'Chính sách',
        path: ROUTES.POLICIES,
        icon: <PolicyIcon />,
        permissions: [PERMISSIONS.POLICIES_READ],
      },
    ],
  },
  {
    title: 'Cài đặt',
    path: ROUTES.SETTINGS,
    icon: <SettingsIcon />,
  },
];

function SidebarMenuItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if any child is active
  const isChildActive = item.children?.some(child => child.path === pathname) || false;
  const [open, setOpen] = React.useState(isChildActive);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === pathname;

  // Auto-open if child is active
  React.useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.path) {
      router.push(item.path);
    }
  };

  const renderMenuItem = () => (
    <>
      <ListItemButton
        onClick={handleClick}
        selected={isActive}
        sx={{
          pl: 2 + level * 2,
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.contrastText',
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((child, index) => (
              <SidebarMenuItem key={index} item={child} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );

  if (item.permissions || item.roles) {
    return (
      <PermissionGuard permissions={item.permissions} roles={item.roles}>
        {renderMenuItem()}
      </PermissionGuard>
    );
  }

  return renderMenuItem();
}

export default function Sidebar() {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      sx={{
        width: THEME_CONFIG.DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: THEME_CONFIG.DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h6" noWrap>
            Volcanion Admin
          </Typography>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <List>
        {menuItems.map((item, index) => (
          <SidebarMenuItem key={index} item={item} />
        ))}
      </List>
    </Drawer>
  );
}
