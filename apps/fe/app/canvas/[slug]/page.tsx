import RoomCanvas from "@/app/components/RoomCanvas";

export default async function CanvasPage({ params }: {
  params: {
    slug: string 
  }
}) {
  const slug = (await params).slug;
  return <RoomCanvas slug={slug} /> 
}