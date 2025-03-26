import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { client } from "../lib/sanity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "../resources/dynamo-scripts/data-table";
import { columns, DynamoScript } from "../resources/dynamo-scripts/columns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UploadForm from "../components/UploadForm";
import { Skeleton } from "@/components/ui/skeleton";
import dynamo from "@/public/dynamo.png";
import UploadDialog from "../components/UploadDialog";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Upload } from "lucide-react";
import {getDynScriptsByUser, getUser} from "@/app/lib/api";
import { UserDataTable } from "./datatable";
import { usercolumns } from "./usercolumns";
import { currentUser } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import UploadScript from "../components/UploadScript";

export default async function Dashboard(): Promise<JSX.Element>{
    const { getUser: getKindeUser } = getKindeServerSession();
    const {isAuthenticated, getPermission} = getKindeServerSession();
    const user = await currentUser();
    const userId = user?.id;
    const userImage = user?.imageUrl;
    console.log("User ID", userId);
    
    const data = userId ? await getDynScriptsByUser(userId) : [];

    if (!user) {
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
            {user && (
                <>
                    <div className="grid grid-cols-7 items-center gap-10">
                        {userImage ? (
                            <Image src={userImage} alt="profile" width={150} height={150} className="rounded-full col-span-1" />
                        ) : (
                            <Skeleton className="h-[150px] w-[150px] rounded-full" />
                        )}
                        <div className="col-start-2 col-span-2">
                            <h1 className="text-4xl font-semibold mb-5">{user.fullName}</h1>
                            <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
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
                                    <UploadScript userId={user?.id} />  
                                </div>
                                <UserDataTable columns={usercolumns} data={data} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </section>        
    )
}