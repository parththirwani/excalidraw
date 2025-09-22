import RoomCanvas from "@/app/components/RoomCanvas";

export default async function CanvasPage({ params }: {
  params: {
    slug: string // Changed from roomId to slug
  }
}) {
  const slug = (await params).slug;
  return <RoomCanvas slug={slug} /> 
}