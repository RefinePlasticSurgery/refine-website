import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Upload, X, Eye, Image as ImageIcon } from "lucide-react";
import { useGallery } from "@/admin/hooks/useGallery";
import { format } from "date-fns";
import { AdminLayout } from "@/admin/components/AdminLayout";

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

export const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    category: "",
    before_after: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { images, loading, error, uploadImage } = useGallery();

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      (image.title?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (image.category?.toLowerCase().includes(searchTerm.toLowerCase()) || "");

    const matchesCategory = categoryFilter === "all" || image.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(selectedFile, uploadData);
      if (result) {
        setIsUploadDialogOpen(false);
        setUploadData({ title: "", category: "", before_after: false });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout
      title="Gallery"
      description="Curate before-and-after and case imagery for the public site."
      segment="Gallery"
      headerActions={
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-muted-foreground">Selected: {selectedFile.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Title</label>
                <Input
                  placeholder="Image title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="before_after"
                  checked={uploadData.before_after}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, before_after: e.target.checked })
                  }
                  disabled={uploading}
                  className="rounded"
                />
                <label htmlFor="before_after" className="text-sm font-medium">
                  Before / after
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                  disabled={uploading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
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
              placeholder="Search by title or category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="md:w-[min(100%,220px)]">
              <SelectValue placeholder="Category" />
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
      }
    >
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading gallery…</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-border/80 bg-card/50 py-16 text-center text-muted-foreground">
                {searchTerm || categoryFilter !== "all" ? (
                  "No images match your filters."
                ) : (
                  <div>
                    <ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-40" />
                    <p className="font-medium text-foreground">No images yet</p>
                    <Button className="mt-4 gap-2" onClick={() => setIsUploadDialogOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Upload first image
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.image_url}
                      alt={image.title || "Gallery image"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                      <Button variant="secondary" size="sm" type="button">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="sm" type="button">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" type="button">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold text-foreground">
                      {image.title || "Untitled"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {image.category && (
                        <Badge variant="secondary">
                          {image.category.replace("-", " ")}
                        </Badge>
                      )}
                      {image.before_after && <Badge variant="outline">Before/After</Badge>}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {format(new Date(image.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};
