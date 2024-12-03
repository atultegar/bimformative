import { PageBanner } from "@/app/components/PageBanner";
import { otherassets } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import { Metadata } from "next";
import { OtherDataTable } from "./other-data-table";
import { othercolumns } from "./other-columns";

export const revalidate = 30;  //revalidate at most 30 seconds

export const metadata: Metadata = {
    title : "Dynamo Scripts"
}

async function getData() {
    const query = `
  *[_type == 'otherassets'] | order(_createdAt desc) {
    file,
    title,
    description,
    "image": image.asset->url,
    assettype,
    youtubelink,
    tags,
    "fileUrl": file.asset->url,
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function OtherAssetsPage() {
    const data: otherassets[] = await getData();
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <PageBanner title="Other Assets" description="Including custom subassemblies for Civil 3D, Revit Families, Excel Sheets & Templates, CAD Lisps, and more." />            
            <div className="container max-w-[1280px] mx-auto py-10">
                <OtherDataTable columns={othercolumns} data={data} />
            </div>
        </section>       
    )
}