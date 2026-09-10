import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, User, X } from "lucide-react";
import { useTeam } from "@/admin/hooks/useTeam";
import { AdminLayout } from "@/admin/components/AdminLayout";
import type { TeamMember } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

export const Team = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberData, setMemberData] = useState({
    name: "",
    role: "",
    bio: "",
    qualifications: "",
    specialties: "",
  });
  const [saving, setSaving] = useState(false);
  const {
    teamMembers,
    loading,
    error,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  } = useTeam();
  const { toast } = useToast();

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.qualifications?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleOpenDialog = (member: TeamMember | null = null) => {
    setEditingMember(member);
    if (member) {
      setMemberData({
        name: member.name || "",
        role: member.role || "",
        bio: member.bio || "",
        qualifications: member.qualifications || "",
        specialties: (member.specialties || []).join(", "),
      });
    } else {
      setMemberData({
        name: "",
        role: "",
        bio: "",
        qualifications: "",
        specialties: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setMemberData({
      name: "",
      role: "",
      bio: "",
      qualifications: "",
      specialties: "",
    });
  };

  const handleSave = async () => {
    if (!memberData.name || !memberData.role) {
      alert("Name and role are required");
      return;
    }

    setSaving(true);
    try {
      const specialtiesArray = memberData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const dataToSave = {
        ...memberData,
        specialties: specialtiesArray,
      };

      if (editingMember) {
        await updateTeamMember(editingMember.id, dataToSave);
      } else {
        await createTeamMember(dataToSave);
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this team member? This cannot be undone.");
    if (!ok) return;

    const result = await deleteTeamMember(id);
    if (result) {
      toast({ title: "Deleted", description: "Team member removed." });
    } else {
      toast({
        title: "Delete failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Team" description="Staff profiles shown on the website." segment="Team">
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading team…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout
        title="Team"
        description="Manage surgeon profiles, specialties, and bios."
        segment="Team"
        headerActions={
          <Button size="sm" className="gap-2" onClick={() => handleOpenDialog(null)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add member</span>
          </Button>
        }
        toolbar={
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or qualifications…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        }
      >
        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-border/80 bg-card/50 py-16 text-center">
              {searchTerm ? (
                <p className="text-muted-foreground">No team members match your search.</p>
              ) : (
                <div>
                  <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
                  <p className="font-medium text-foreground">No team members yet</p>
                  <Button className="mt-4 gap-2" onClick={() => handleOpenDialog(null)}>
                    <Plus className="h-4 w-4" />
                    Add first member
                  </Button>
                </div>
              )}
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.16)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500/10 ring-2 ring-white shadow-sm">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-7 w-7 text-violet-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-sm font-medium text-primary">{member.role}</p>
                    {member.qualifications && (
                      <p className="mt-1 text-xs text-slate-500">{member.qualifications}</p>
                    )}
                  </div>
                </div>

                {member.specialties && member.specialties.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="rounded-full">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}

                {member.bio && (
                  <p className="mt-3 line-clamp-3 text-sm text-slate-500">{member.bio}</p>
                )}

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(member)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminLayout>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit team member" : "Add team member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Full name *</label>
              <Input
                placeholder="Dr. Jane Doe"
                value={memberData.name}
                onChange={(e) => setMemberData({ ...memberData, name: e.target.value })}
                disabled={saving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Role / title *</label>
              <Input
                placeholder="Plastic surgeon"
                value={memberData.role}
                onChange={(e) => setMemberData({ ...memberData, role: e.target.value })}
                disabled={saving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Qualifications</label>
              <Input
                placeholder="MBChB, FWACS, FICS"
                value={memberData.qualifications}
                onChange={(e) =>
                  setMemberData({ ...memberData, qualifications: e.target.value })
                }
                disabled={saving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Specialties</label>
              <Input
                placeholder="Comma-separated"
                value={memberData.specialties}
                onChange={(e) =>
                  setMemberData({ ...memberData, specialties: e.target.value })
                }
                disabled={saving}
              />
              <p className="mt-1 text-xs text-muted-foreground">Separate with commas</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Biography</label>
              <Textarea
                placeholder="Professional biography…"
                value={memberData.bio}
                onChange={(e) => setMemberData({ ...memberData, bio: e.target.value })}
                rows={4}
                disabled={saving}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || !memberData.name || !memberData.role}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
