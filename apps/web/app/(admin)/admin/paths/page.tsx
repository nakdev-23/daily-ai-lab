import { getAllCareerPaths } from "@/lib/career-paths"
import PathsAdmin from "./_paths-admin"

export default async function AdminPathsPage() {
  const paths = await getAllCareerPaths()
  return <PathsAdmin paths={paths} />
}
