"use client";
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
       <Image
      src="/tnlogo.png"
      width={200}
      height={200}
      alt="Picture of the author"
    /> 
      <h1 className="text-4xl pt-5 font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
        Tamil Nadu TASMAC -  Responsible Drinking Awareness
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl mb-6">
      Encouraging informed and mindful alcohol consumption to ensure health and safety.  
  Stay aware of your limits, prioritize well-being, and make responsible choices.
</p>
      
<button 
      className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
      onClick={() => router.push("/user/login")}
    >
      Login to Dashboard
    </button>

    </div>
  );
}