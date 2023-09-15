import { SignIn } from "@clerk/nextjs";



export default function Page(){
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <SignIn
                afterSignInUrl={"/dashboard"}
                afterSignUpUrl={"/dashboard"}
                
            />
        </div>
    )
}