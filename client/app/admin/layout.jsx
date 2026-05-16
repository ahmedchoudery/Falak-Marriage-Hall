import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: "Admin Dashboard | Falak Marriage Hall",
  description: "Administrative dashboard for Falak Marriage Hall. Manage bookings, inventory, and website content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
