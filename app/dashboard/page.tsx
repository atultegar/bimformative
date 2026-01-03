import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";
import UploadScript from "../components/UploadScript";
import { User } from "../lib/interface";
import { getUserById } from "@/lib/supabase/db";
import { ClientDataTable } from "./client-data-table-wrapper";
import { getAllScriptsByUserId, scriptsLikedByUserId } from "@/lib/services/scripts.service";

const DEV_BYPASS = process.env.NODE_ENV === "development";
const DEV_USER_ID = process.env.DEV_FAKE_USER_ID as string ?? "dev-user";

async function getCurrentUserId(): Promise<string> {
    if (DEV_BYPASS) {
        return DEV_USER_ID;
    }

    const { userId } = await auth();
    if (!userId) {
        return "guest";
    }
    return userId;
}


export default async function Dashboard(): Promise<JSX.Element>{    
    const currentUserId = await getCurrentUserId();
    const currentUser: User = await getUserById(currentUserId);

    const data = await getAllScriptsByUserId(currentUserId);
    const likesRes = await scriptsLikedByUserId(currentUserId);
        
    const likedSet = new Set(likesRes.map(l => l.script_id));

    const scriptData = data.map(s => ({
        ...s,
        liked_by_user: likedSet.has(s.id),
    }));


    if (currentUserId == "guest") {
        return (
            <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px] justify-items-start">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-[150px] w-[150px] rounded-full" />
                    <div className="space-y-5">
                        <Skeleton className="h-10 w-[250px]" />
                        <Skeleton className="h-5 w-[200px]" />
                    </div>
                </div>
            </section>            
          )
    }    

    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px] justify-items-start">            
            {currentUser && (
                <>
                    <div className="grid grid-cols-7 items-center gap-10">
                        {currentUser.avatar_url ? (
                            <Image src={currentUser.avatar_url} alt="profile" width={150} height={150} className="rounded-full col-span-1" />
                        ) : (
                            <Skeleton className="h-[150px] w-[150px] rounded-full" />
                        )}
                        <div className="col-start-2 col-span-2">
                            <h1 className="text-4xl font-semibold mb-5">{currentUser.first_name} {currentUser.last_name}</h1>
                            <p className="text-muted-foreground">{currentUser.email}</p>
                        </div>
                        <div className="flex flex-col gap-5 col-start-7 col-span-1">                            
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant={"outline"}>Edit Profile</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[950px] items-center justify-items-center bg-transparent border-none">
                                    <UserProfile />
                                </DialogContent>
                            </Dialog>
                        </div>          
                    </div>
                    <hr className="w-full h-px bg-gray-300 border-0 dark:bg-gray-700 mt-5" />
                    <Tabs defaultValue="dynamoscript" className="w-full mt-5">
                        <TabsList className="bg-transparent">
                            <TabsTrigger value="dynamoscript">Dynamo Scripts</TabsTrigger>
                            <TabsTrigger value="codes">Code Snippets</TabsTrigger>
                        </TabsList>

                        {/* Tab Dynamo Script  */}
                        <TabsContent value="dynamoscript">
                            <div className="-mt-1 p-2 content-center bg-transparent rounded-md border">
                                <div className="w-full flex flex-col mx-auto place-items-end">
                                    <UploadScript userId={currentUser.id} />  
                                </div>
                                <ClientDataTable currentUserId={currentUserId} data={scriptData} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </section>        
    )
}