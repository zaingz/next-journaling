import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="w-screen h-screen bg-slate-800 flex justify-center items-center text-slate-100">
    <SignIn />
  </div>
  );
}
