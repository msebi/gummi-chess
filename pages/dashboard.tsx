import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from 'next';
import authOptions from './api/auth/[...nextauth]';

// Define a type for the page props
interface DashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div>
      <h1>Protected Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <p>This page is protected on the server. You can only see it if you are logged in.</p>
    </div>
  );
}

// This function runs on the server for every request to this page
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the session from the request
  const session = await getServerSession(context.req, context.res, authOptions);

  // If there's no session, the user is not logged in.
  // Redirect them to the login page.
  if (!session || typeof session !== 'object' || !('user' in session) || !session.user) {
    return {
      redirect: {
        destination: '/login', // Your login page
        permanent: false,
      },
    };
  }

  // If a session exists, pass the user data to the page as props
  return {
    props: {
      user: session.user,
    },
  };
};