import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { useBlogPosts } from "@/admin/hooks/useBlogPosts";
import { AdminLayout } from "@/admin/components/AdminLayout";

const blogPostStatuses = [
  { value: "draft", label: "Draft", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  { value: "published", label: "Published", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" },
  { value: "archived", label: "Archived", color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200" },
];

const getBlogPostStatusColor = (status: string) => {
  const statusObj = blogPostStatuses.find((s) => s.value === status);
  return statusObj ? statusObj.color : "bg-muted text-muted-foreground";
};

const getBlogPostStatusLabel = (status: string) => {
  const statusObj = blogPostStatuses.find((s) => s.value === status);
  return statusObj ? statusObj.label : status;
};

export const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { posts, loading, error } = useBlogPosts();

  const filteredBlogPosts = posts.filter((post) => {
    const matchesSearch =
      (post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) || "");

    const matchesStatus = statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout title="Blog" description="Manage news and articles." segment="Blog">
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading posts…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Blog"
      description="Create, edit, and publish content for your news section."
      segment="Blog"
      headerActions={
        <Button size="sm" className="gap-2" disabled title="Editor coming soon">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New post</span>
        </Button>
      }
      toolbar={
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or excerpt…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-[180px]"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      }
    >
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Excerpt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "No posts match your filters."
                    : "No blog posts yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredBlogPosts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground">/{post.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm text-muted-foreground">{post.excerpt}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBlogPostStatusColor(post.status)}>
                      {getBlogPostStatusLabel(post.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" type="button" aria-label="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" type="button" aria-label="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-destructive hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};
