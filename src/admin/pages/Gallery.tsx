import { useMemo, useState, type ChangeEvent } from "react";
import { format } from "date-fns";
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from "lucide-react";

import { AdminLayout } from "@/admin/components/AdminLayout";
import { useGallery } from "@/admin/hooks/useGallery";
import type { GalleryImage, NewGalleryImage, UpdateGalleryImage } from "@/integrations/supabase/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "facial",
  "body-contouring",
  "breast",
  "hair-transplant",
  "skin-treatment",
  "before-after",
];

const formatCategoryLabel = (cat: string) =>
  cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

type UploadState = {
  title: string;
  category: string;
  before_after: boolean;
};

const emptyUploadState: UploadState = {
  title: "",
  category: "",
  before_after: false,
};

export const Gallery = () => {
  const { images, loading, error, uploadImage, updateImage, deleteImage, refreshImages } =
    useGallery();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const matchesSearch =
        (image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (image.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesCategory =
        categoryFilter === "all" || image.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [images, searchTerm, categoryFilter]);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState<UploadState>(emptyUploadState);

  const openUpload = () => {
    setUploadDialogOpen(true);
  };

  const closeUpload = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setUploadData(emptyUploadState);
    setUploading(false);
  };

  const handleUploadFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Select an image", description: "Please choose an image file.", variant: "destructive" });
      return;
    }
    if (!uploadData.title.trim() || !uploadData.category.trim()) {
      toast({ title: "Missing details", description: "Title and category are required.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const payload: Omit<NewGalleryImage, "image_url"> = {
        title: uploadData.title.trim(),
        category: uploadData.category,
        before_after: uploadData.before_after,
      };

      const result = await uploadImage(selectedFile, payload);
      if (!result) throw new Error("Upload returned no data");

      toast({ title: "Uploaded", description: "Gallery image added successfully." });
      await refreshImages();
      closeUpload();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload image";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; category: string; before_after: boolean }>(
    { title: "", category: "", before_after: false }
  );

  const openEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setEditForm({
      title: image.title ?? "",
      category: image.category ?? "",
      before_after: image.before_after,
    });
    setEditDialogOpen(true);
  };

  const closeEdit = () => {
    setEditDialogOpen(false);
    setEditingImage(null);
    setSavingEdit(false);
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;
    if (!editForm.title.trim() || !editForm.category.trim()) {
      toast({ title: "Missing details", description: "Title and category are required.", variant: "destructive" });
      return;
    }

    setSavingEdit(true);
    try {
      const updates: UpdateGalleryImage = {
        title: editForm.title.trim(),
        category: editForm.category.trim(),
        before_after: editForm.before_after,
      };

      const result = await updateImage(editingImage.id, updates);
      if (!result) throw new Error("Update returned no data");

      toast({ title: "Saved", description: "Gallery image updated." });
      await refreshImages();
      closeEdit();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update image";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this gallery image? This will also remove the file.");
    if (!ok) return;

    const result = await deleteImage(id);
    if (result) {
      toast({ title: "Deleted", description: "Image removed." });
      await refreshImages();
    } else {
      toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <AdminLayout
        title="Gallery"
        description="Curate before-and-after and case imagery for the public website."
        segment="Gallery"
      >
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading gallery…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Gallery"
      description="Upload, edit, and curate images shown on the public site."
      segment="Gallery"
      headerActions={
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" onClick={openUpload}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload new gallery image</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image file *</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadFileChange}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  disabled={uploading}
                  placeholder="e.g. Mommy Makeover – 12 weeks"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Select
                  value={uploadData.category}
                  onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {formatCategoryLabel(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Before/After</p>
                  <p className="text-xs text-muted-foreground">Mark this image for before-after sections.</p>
                </div>
                <Switch
                  checked={uploadData.before_after}
                  onCheckedChange={(checked) => setUploadData({ ...uploadData, before_after: checked })}
                  disabled={uploading}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={closeUpload} disabled={uploading}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
      toolbar={
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search images by title or category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-[220px]">
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Category filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {formatCategoryLabel(cat)}
                  </SelectItem>
                ))}
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

      {filteredImages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center text-muted-foreground">
          {searchTerm || categoryFilter !== "all" ? (
            <>
              <p>No images match your filters.</p>
              <p className="mt-1 text-xs text-muted-foreground/80">Try a different keyword or category.</p>
            </>
          ) : (
            <>
              <ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-40" />
              <p className="font-medium text-foreground">No images uploaded yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">Upload your first image to get started.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-square bg-muted">
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:opacity-100 group-hover:bg-black/35">
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => openEdit(image)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    className="bg-destructive/15 hover:bg-destructive/25 text-destructive"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">
                  {image.title || "Untitled"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {image.category && (
                    <Badge variant="secondary">{image.category.replace("-", " ")}</Badge>
                  )}
                  {image.before_after && <Badge variant="outline">Before/After</Badge>}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {format(new Date(image.created_at), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit gallery image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                disabled={savingEdit}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                disabled={savingEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {formatCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Before/After</p>
                <p className="text-xs text-muted-foreground">Used by the before-after section.</p>
              </div>
              <Switch
                checked={editForm.before_after}
                onCheckedChange={(checked) => setEditForm({ ...editForm, before_after: checked })}
                disabled={savingEdit}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={closeEdit} disabled={savingEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={savingEdit || !editingImage}>
                {savingEdit ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

