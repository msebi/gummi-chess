import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';
import SignInFormComponent from '@/components/signin/SignInFormComponent';

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ReactHeaderComponent />
      <main className="flex-grow flex items-center justify-center p-4">
        {/* The form takes 50% width by being inside a flex container */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <SignInFormComponent />
        </div>
      </main>
      <ReactFooterComponent />
    </div>
  );
};

export default LoginPage;