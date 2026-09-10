import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

import { AdminLayout } from "@/admin/components/AdminLayout";
import { useBlogPosts } from "@/admin/hooks/useBlogPosts";
import type { BlogPost, NewBlogPost, UpdateBlogPost } from "@/integrations/supabase/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";

type BlogStatus = "draft" | "published" | "archived";

const blogPostStatuses: { value: BlogStatus; label: string; color: string }[] = [
  {
    value: "draft",
    label: "Draft",
    color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  },
  {
    value: "published",
    label: "Published",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  {
    value: "archived",
    label: "Archived",
    color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  },
];

const getBlogPostStatusColor = (status: string) => {
  const statusObj = blogPostStatuses.find((s) => s.value === status);
  return statusObj ? statusObj.color : "bg-muted text-muted-foreground";
};

const getBlogPostStatusLabel = (status: string) => {
  const statusObj = blogPostStatuses.find((s) => s.value === status);
  return statusObj ? statusObj.label : status;
};

type BlogFormState = {
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  status: BlogStatus;
};

const emptyForm: BlogFormState = {
  title: "",
  excerpt: "",
  content: "",
  image_url: "",
  status: "draft",
};

export const Blog = () => {
  const { posts, loading, error, createPost, updatePost, deletePost, refreshPosts } =
    useBlogPosts();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");

  const filteredBlogPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        (post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesStatus =
        statusFilter === "all" || (post.status as BlogStatus) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogFormState>(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title ?? "",
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      image_url: post.image_url ?? "",
      status: (post.status as BlogStatus) ?? "draft",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this blog post? This cannot be undone.");
    if (!ok) return;

    const result = await deletePost(id);
    if (result) {
      toast({ title: "Deleted", description: "Blog post removed." });
    } else {
      toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({ title: "Missing title", description: "Blog title is required.", variant: "destructive" });
      return;
    }

    setSaving(true);

    try {
      const publishedAt = form.status === "published" ? new Date().toISOString() : null;

      const payload: Omit<NewBlogPost, "slug" | "created_at" | "updated_at"> = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim() ? form.excerpt.trim() : null,
        content: form.content.trim() ? form.content.trim() : null,
        image_url: form.image_url.trim() ? form.image_url.trim() : null,
        status: form.status,
        published_at: publishedAt,
      };

      if (editingId) {
        const updates: UpdateBlogPost = payload as unknown as UpdateBlogPost;
        const result = await updatePost(editingId, updates);
        if (!result) throw new Error("Update returned no data");
        toast({ title: "Saved", description: "Blog post updated." });
      } else {
        const result = await createPost(payload);
        if (!result) throw new Error("Create returned no data");
        toast({ title: "Created", description: "New blog post created." });
      }

      await refreshPosts();
      closeDialog();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save blog post";
      toast({ title: "Save failed", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

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
        <Button size="sm" className="gap-2" onClick={openCreate}>
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
          <div className="w-full md:w-[220px]">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v === "all" ? "all" : (v as BlogStatus))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    >
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {filteredBlogPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 py-16 text-center text-slate-500">
          {searchTerm || statusFilter !== "all"
            ? "No posts match your filters."
            : "No blog posts yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBlogPosts.map((post) => (
            <article
              key={post.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.18)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="aspect-[16/9] bg-slate-100">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-wider text-slate-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge className={getBlogPostStatusColor(post.status)}>
                    {getBlogPostStatusLabel(post.status)}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold leading-snug text-slate-900">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {post.excerpt || "No excerpt"}
                </p>
                <div className="mt-4 flex justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(post)}
                    aria-label={`Edit ${post.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(post.id)}
                    aria-label={`Delete ${post.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit blog post" : "Create new blog post"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mommy Makeover"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as BlogStatus })}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt</label>
              <Input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short summary shown on listing pages"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://... (optional)"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Tip: You can leave this blank and publish with no image.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Full article content…"
                rows={8}
                disabled={saving}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={closeDialog} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saving || !form.title.trim()}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Create post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

