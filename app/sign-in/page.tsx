import { SignIn } from "@clerk/nextjs";
 
export default function SignInPage() {
  return (
    <div className="w-screen h-screen bg-slate-800 flex justify-center items-center text-slate-100">
    <SignIn />
  </div>
  );
}
