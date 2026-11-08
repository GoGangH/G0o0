import { PostEditor } from "@/components/admin/PostEditor";
export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) { return <PostEditor slug={(await params).slug} />; }
