import { notFound } from "next/navigation"
import { getCareerPathById } from "@/lib/career-paths"
import PathEdit from "./_path-edit"

export default async function AdminPathEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const path = await getCareerPathById(id)
  if (!path) notFound()
  return <PathEdit path={path} />
}
