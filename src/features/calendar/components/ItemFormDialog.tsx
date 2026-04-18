import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CalendarItem, ItemStatus, InspoItem } from "@/types/calendar.types";
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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
      }}
    >
      <DialogContent className="surface-solid border-0">
        <DialogHeader>
          <DialogTitle>
            {editing?.title
              ? t("dashboard.calendar.edit", { defaultValue: "Edit item" })
              : t("dashboard.calendar.create", {
                  defaultValue: "Create item",
                })}
          </DialogTitle>
        </DialogHeader>

        {editing ? (
          <CalendarItemForm
            item={editing}
            saving={saving}
            onCancel={() => onOpenChange(false)}
            onDelete={() => onDelete(editing.id)}
            onSave={(next) => onSave(next)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
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

  const inspoLinks = (draft.inspo ?? []).filter((item) => item.type === "link");
  const inspoImages = (draft.inspo ?? []).filter(
    (item) => item.type === "image",
  );

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
      inspo: (d.inspo ?? []).filter((item) => item.id !== id),
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
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

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
    <div className="space-y-4 overflow-x-hidden">
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          {t("dashboard.calendar.form.title")}
        </div>
        <Input
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder={t("dashboard.calendar.form.titlePlaceholder")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.platform")}
          </div>
          <select
            className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-sm"
            value={draft.platform}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDraft((d) => ({ ...d, platform: e.target.value as Platform }))
            }
          >
            <option value="instagram">
              {t("dashboard.platforms.instagram")}
            </option>
            <option value="tiktok">{t("dashboard.platforms.tiktok")}</option>
            <option value="youtube">{t("dashboard.platforms.youtube")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.status")}
          </div>
          <select
            className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-sm"
            value={draft.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDraft((d) => ({ ...d, status: e.target.value as ItemStatus }))
            }
          >
            <option value="idea">{t("dashboard.calendar.status.idea")}</option>
            <option value="scheduled">
              {t("dashboard.calendar.status.scheduled")}
            </option>
            <option value="posted">
              {t("dashboard.calendar.status.posted")}
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.pillar")}
          </div>
          <Input
            value={draft.pillar ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, pillar: e.target.value }))
            }
            placeholder={t("dashboard.calendar.form.pillarPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.scheduledDate")}
          </div>
          <Input
            type="datetime-local"
            value={
              draft.scheduledAt
                ? new Date(draft.scheduledAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => {
              const v = e.target.value;
              setDraft((d) => ({
                ...d,
                scheduledAt: v ? new Date(v).toISOString() : null,
              }));
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-lg font-semibold">Inspo</div>

        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Add your links</div>

          <div className="flex gap-2">
            <Input
              value={inspoLink}
              onChange={(e) => setInspoLink(e.target.value)}
              placeholder="Paste a TikTok, Instagram, Pinterest or any inspo link"
            />
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={addInspoLink}
              disabled={!inspoLink.trim()}
            >
              Add
            </Button>
          </div>

          {inspoLinks.length > 0 ? (
            <div className="space-y-2">
              {inspoLinks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border/60 bg-background/40 p-3"
                >
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block min-w-0 truncate text-sm text-muted-foreground underline"
                      title={item.url}
                    >
                      {item.url}
                    </a>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="shrink-0 rounded-full text-destructive"
                    onClick={() => removeInspo(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Add your images</div>

          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              await uploadInspoImage(file);
              e.currentTarget.value = "";
            }}
            disabled={uploadingImage}
          />

          {uploadingImage ? (
            <div className="text-xs text-muted-foreground">Uploading…</div>
          ) : null}

          {inspoImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {inspoImages.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/40"
                >
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <img
                      src={item.url}
                      alt="Inspo"
                      className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </a>

                  <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/60 to-transparent p-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white"
                      onClick={() => removeInspo(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={onCancel}
          disabled={saving}
        >
          {t("common.cancel")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full text-destructive"
            onClick={onDelete}
            disabled={saving}
          >
            {t("common.delete")}
          </Button>

          <Button
            className="rounded-full"
            onClick={() => onSave(draft)}
            disabled={saving}
          >
            {saving
              ? t("common.loading", { defaultValue: "Loading…" })
              : t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
