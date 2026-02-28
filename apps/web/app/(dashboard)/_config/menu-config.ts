import { Role } from '@zagotours/types';
import {
  HelpCircle,
  House,
  Image as ImageIcon,
  MapMinus,
  Video,
} from 'lucide-react';
import {
  LuCalendar,
  LuSettings,
  LuUsers,
  LuTicket,
  LuUserPlus,
  LuPhone,
  LuFileText,
  LuStar,
  LuMessagesSquare,
  LuClipboardList,
  LuGlobe,
} from 'react-icons/lu';

// Comprehensive admin menu items
const adminMenuItems = [
  { label: 'Dashboard', icon: House, href: '/dashboard' },

  // User Management
  { label: 'Users', icon: LuUsers, href: '/admin/users' },

  // Content Management
  { label: 'Adventures', icon: MapMinus, href: '/admin/adventures' },
  { label: 'Events', icon: LuCalendar, href: '/admin/events' },
  { label: 'Reviews', icon: LuStar, href: '/admin/reviews' },
  { label: 'Posts', icon: LuMessagesSquare, href: '/admin/posts' },

  // Requests & Planning
  {
    label: 'Trip Requests',
    icon: LuClipboardList,
    href: '/admin/trip-requests',
  },
  { label: 'Callback Requests', icon: LuPhone, href: '/admin/callbacks' },
  { label: 'Planning Calls', icon: LuTicket, href: '/admin/planning-calls' },
  { label: 'Inquiries', icon: LuFileText, href: '/admin/inquiries' },
  { label: 'Galleries', icon: ImageIcon, href: '/admin/galleries' },
  { label: 'Subscribers', icon: LuGlobe, href: '/admin/newsletter' },

  // Settings
  { label: 'Account Creation', icon: LuSettings, href: '/admin/create-admin' },
  {
    label: 'Platform Settings',
    icon: LuSettings,
    href: '/admin/platform-settings',
  },
];

export const MENU_CONFIG = {
  common: {
    main: [
      { label: 'Events', icon: LuCalendar, href: '/dashboard/event' },
      { label: 'Adventures', icon: MapMinus, href: '/dashboard/adventure' },
      { label: 'Review', icon: LuStar, href: '/dashboard/review' },
    ],
    support: [
      { label: 'Help', icon: HelpCircle, href: '/dashboard/help' },
      { label: 'Settings', icon: LuSettings, href: '/dashboard/setting' },
    ],
  },
  roles: {
    [Role.SUPER_ADMIN]: adminMenuItems,
    [Role.ADMIN]: adminMenuItems,
    [Role.INDEPENDENT_AGENT]: [
      { label: 'Dashboard', icon: House, href: '/dashboard' },
      {
        label: 'Media kits',
        icon: LuTicket,
        href: '/independent-agent/media-kits',
      },
    ],
    [Role.COOPERATE_AGENT]: [
      { label: 'Dashboard', icon: House, href: '/dashboard' },
      {
        label: 'Trip-request',
        icon: LuUsers,
        href: '/corporate-agent/trip-request',
      },
    ],
    [Role.ADVENTURER]: [
      { label: 'Dashboard', icon: House, href: '/dashboard' },
      {
        label: 'Unlocked Tours',
        icon: Video,
        href: '/adventurer/unlocked-tours',
      },
    ],
    [Role.AFFILIATE]: [
      { label: 'Dashboard', icon: House, href: '/dashboard' },
      { label: 'Contract', icon: LuUserPlus, href: '/affiliate/contracts' },
    ],
  },
};

export type UserRole = Role;
