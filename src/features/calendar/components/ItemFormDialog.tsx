import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { toLocalIso } from "@/lib/dates";
import type {
  CalendarItem,
  ItemStatus,
  InspoItem,
} from "@/types/calendar.types";
import type { Platform } from "@/types/platform.types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: CalendarItem | null;
  saving: boolean;
  onSave: (item: CalendarItem) => void;
  onDelete: (id: string) => void;
};

export function ItemFormDialog({
  open,
  onOpenChange,
  editing,
  saving,
  onSave,
  onDelete,
}: Props) {
  const { t } = useTranslation();

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
      }}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-lg">
            {editing?.title
              ? t("dashboard.calendar.edit", { defaultValue: "Edit item" })
              : t("dashboard.calendar.create", {
                  defaultValue: "New content",
                })}
          </SheetTitle>
          <SheetDescription>
            {editing?.title
              ? t("dashboard.calendar.editDesc", {
                  defaultValue: "Update your content details below.",
                })
              : t("dashboard.calendar.createDesc", {
                  defaultValue:
                    "Fill in the details for your new content idea.",
                })}
          </SheetDescription>
        </SheetHeader>

        {editing ? (
          <CalendarItemForm
            item={editing}
            saving={saving}
            onCancel={() => onOpenChange(false)}
            onDelete={() => onDelete(editing.id)}
            onSave={(next) => onSave(next)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: "instagram", label: "Instagram", color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
  { value: "tiktok", label: "TikTok", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { value: "youtube", label: "YouTube", color: "bg-red-500/10 text-red-600 border-red-500/20" },
];

const STATUSES: { value: ItemStatus; color: string }[] = [
  { value: "idea", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "scheduled", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "posted", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

function localDatetimeValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return toLocalIso(d);
}

function CalendarItemForm({
  item,
  saving,
  onSave,
  onCancel,
  onDelete,
}: {
  item: CalendarItem;
  saving: boolean;
  onSave: (it: CalendarItem) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<CalendarItem>(item);
  const [inspoLink, setInspoLink] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const { t } = useTranslation();

  const inspoLinks = (draft.inspo ?? []).filter((i) => i.type === "link");
  const inspoImages = (draft.inspo ?? []).filter((i) => i.type === "image");

  function addInspoLink() {
    const value = inspoLink.trim();
    if (!value) return;

    const nextItem: InspoItem = {
      id: crypto.randomUUID(),
      type: "link",
      url: value,
      title: null,
    };

    setDraft((d) => ({
      ...d,
      inspo: [...(d.inspo ?? []), nextItem],
    }));
    setInspoLink("");
  }

  function removeInspo(id: string) {
    setDraft((d) => ({
      ...d,
      inspo: (d.inspo ?? []).filter((i) => i.id !== id),
    }));
  }

  async function uploadInspoImage(file: File) {
    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop() ?? "jpg";
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `calendar-inspo/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("calendar-inspo")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage
        .from("calendar-inspo")
        .getPublicUrl(filePath);

      const nextItem: InspoItem = {
        id: crypto.randomUUID(),
        type: "image",
        url: data.publicUrl,
        title: file.name,
      };

      setDraft((d) => ({
        ...d,
        inspo: [...(d.inspo ?? []), nextItem],
      }));
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-4">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t("dashboard.calendar.form.title")}
        </label>
        <Input
          value={draft.title}
          onChange={(e) =>
            setDraft((d) => ({ ...d, title: e.target.value }))
          }
          placeholder={t("dashboard.calendar.form.titlePlaceholder")}
          className="text-base font-medium"
        />
      </div>

      {/* Platform pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t("dashboard.calendar.form.platform")}
        </label>
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              onClick={() =>
                setDraft((d) => ({ ...d, platform: p.value }))
              }
              className={[
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                draft.platform === p.value
                  ? p.color
                  : "border-border bg-background/60 text-muted-foreground hover:bg-accent",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t("dashboard.calendar.form.status")}
        </label>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() =>
                setDraft((d) => ({ ...d, status: s.value }))
              }
              className={[
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                draft.status === s.value
                  ? s.color
                  : "border-border bg-background/60 text-muted-foreground hover:bg-accent",
              ].join(" ")}
            >
              {t(`dashboard.calendar.status.${s.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Pillar + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            {t("dashboard.calendar.form.pillar")}
          </label>
          <Input
            value={draft.pillar ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, pillar: e.target.value }))
            }
            placeholder={t("dashboard.calendar.form.pillarPlaceholder")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            {t("dashboard.calendar.form.scheduledDate")}
          </label>
          <Input
            type="datetime-local"
            value={localDatetimeValue(draft.scheduledAt)}
            onChange={(e) => {
              const v = e.target.value;
              setDraft((d) => ({
                ...d,
                scheduledAt: v || null,
              }));
            }}
          />
        </div>
      </div>

      {/* Hook */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Hook
        </label>
        <Input
          value={draft.hook ?? ""}
          onChange={(e) =>
            setDraft((d) => ({ ...d, hook: e.target.value }))
          }
          placeholder={t("dashboard.calendar.form.hookPlaceholder", {
            defaultValue: "What grabs the viewer's attention?",
          })}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t("dashboard.calendar.form.description", {
            defaultValue: "Description",
          })}
        </label>
        <Textarea
          value={draft.description ?? ""}
          onChange={(e) =>
            setDraft((d) => ({ ...d, description: e.target.value }))
          }
          placeholder={t("dashboard.calendar.form.descriptionPlaceholder", {
            defaultValue: "Notes, script outline, key points…",
          })}
          rows={3}
          className="resize-none text-sm"
        />
      </div>

      {/* Inspo section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Inspo</span>
          <Badge variant="secondary" className="rounded-full text-[10px]">
            {(draft.inspo ?? []).length}
          </Badge>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            {t("dashboard.calendar.form.inspoLinks", {
              defaultValue: "Links",
            })}
          </label>

          <div className="flex gap-2">
            <Input
              value={inspoLink}
              onChange={(e) => setInspoLink(e.target.value)}
              placeholder="Paste a TikTok, Instagram, or any inspo link"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInspoLink();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0 rounded-full"
              onClick={addInspoLink}
              disabled={!inspoLink.trim()}
            >
              +
            </Button>
          </div>

          {inspoLinks.length > 0 && (
            <div className="space-y-1.5">
              {inspoLinks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 truncate text-xs text-muted-foreground underline"
                    title={item.url}
                  >
                    {item.url}
                  </a>
                  <button
                    onClick={() => removeInspo(item.id)}
                    className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            {t("dashboard.calendar.form.inspoImages", {
              defaultValue: "Images",
            })}
          </label>

          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border/60 bg-background/20 px-4 py-5 text-xs text-muted-foreground transition-colors hover:bg-accent/30">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await uploadInspoImage(file);
                e.currentTarget.value = "";
              }}
              disabled={uploadingImage}
            />
            {uploadingImage
              ? t("common.loading", { defaultValue: "Uploading…" })
              : t("dashboard.calendar.form.dropImage", {
                  defaultValue: "Click to upload an image",
                })}
          </label>

          {inspoImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {inspoImages.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-border/60"
                >
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <img
                      src={item.url}
                      alt="Inspo"
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                  <button
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeInspo(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-4">
        <Button
          variant="ghost"
          className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          disabled={saving}
          size="sm"
        >
          {t("common.delete")}
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          className="rounded-full"
          onClick={onCancel}
          disabled={saving}
          size="sm"
        >
          {t("common.cancel")}
        </Button>

        <Button
          className="rounded-full"
          onClick={() => onSave(draft)}
          disabled={saving}
          size="sm"
        >
          {saving
            ? t("common.loading", { defaultValue: "Saving…" })
            : t("common.save")}
        </Button>
      </div>
    </div>
  );
}
