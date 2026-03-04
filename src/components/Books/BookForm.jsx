import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Input from "../ui/Input.jsx";
import Textarea from "../ui/Textarea.jsx";
import Button from "../ui/Button.jsx";

const defaultState = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  description: "",
  publishedYear: "",
  copies: 1,
  availableCopies: 1,
  isActive: true,
  isAvailableforIssue: true,
};

const numericFields = new Set(["copies", "availableCopies", "publishedYear"]);

const normalizeForComparison = (value, key) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (numericFields.has(key)) {
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? "" : numericValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

const buildDiffPayload = (payload, initialData) => {
  if (!initialData) {
    return payload;
  }

  return Object.entries(payload).reduce((acc, [key, value]) => {
    if (value === undefined) {
      return acc;
    }

    if (key === "bookCoverFile") {
      acc[key] = value;
      return acc;
    }

    const previousValue = normalizeForComparison(initialData?.[key], key);
    const nextValue = normalizeForComparison(value, key);

    if (previousValue !== nextValue) {
      acc[key] = value;
    }

    return acc;
  }, {});
};

export default function BookForm({
  onSubmit,
  initialData,
  loading,
  onCancel,
  readOnly = false,
}) {
  const [formValues, setFormValues] = useState(() => ({
    ...defaultState,
    ...initialData,
    copies: initialData?.copies ?? initialData?.availableCopies ?? 1,
    availableCopies: initialData?.availableCopies ?? initialData?.copies ?? 1,
    publishedYear: initialData?.publishedYear ?? "",
  }));
  const [coverPreview, setCoverPreview] = useState(
    initialData?.bookCover || null,
  );
  const [coverFile, setCoverFile] = useState(null);

  const disableIsbn = Boolean(initialData?.isbn);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = value === "" ? "" : Number(value);
    setFormValues((prev) => {
      const next = { ...prev, [name]: parsedValue };
      if (name === "copies") {
        if (
          typeof next.availableCopies === "number" &&
          typeof parsedValue === "number" &&
          next.availableCopies > parsedValue
        ) {
          next.availableCopies = parsedValue;
        }
      }
      return next;
    });
  };

  const handleAvailableCopiesChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setFormValues((prev) => {
      const maxCopies =
        typeof prev.copies === "number" ? prev.copies : Number(prev.copies);
      const clampedValue =
        typeof value === "number" && typeof maxCopies === "number"
          ? Math.min(value, maxCopies)
          : value;
      return { ...prev, availableCopies: clampedValue };
    });
  };

  const coverLabel = useMemo(() => {
    if (coverFile) return coverFile.name;
    if (coverPreview) return "Current cover";
    return "No cover selected";
  }, [coverFile, coverPreview]);

  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    setCoverFile(file || null);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCoverPreview(objectUrl);
      return;
    }
    if (!file && initialData?.bookCover) {
      setCoverPreview(initialData.bookCover);
    } else {
      setCoverPreview(null);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (readOnly) return;
        const payload = {
          ...formValues,
          copies:
            formValues.copies === "" ? undefined : Number(formValues.copies),
          availableCopies:
            formValues.availableCopies === ""
              ? undefined
              : Number(formValues.availableCopies),
          publishedYear:
            formValues.publishedYear === ""
              ? undefined
              : Number(formValues.publishedYear),
        };
        if (coverFile) {
          payload.bookCoverFile = coverFile;
        }
        const finalPayload = buildDiffPayload(payload, initialData);

        if (initialData && Object.keys(finalPayload).length === 0) {
          toast.error("No changes to save");
          return;
        }

        onSubmit(finalPayload);
      }}
      className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2"
    >
      <section className="border-b border-[var(--line)] pb-5">
        <p className="text-sm font-semibold text-[var(--text-strong)] mb-3">
          Basic information
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="title"
            label="Title"
            value={formValues.title}
            onChange={handleTextChange}
            required
            disabled={readOnly}
          />

          <Input
            name="author"
            label="Author"
            value={formValues.author}
            onChange={handleTextChange}
            required
            disabled={readOnly}
          />

          <Input
            name="isbn"
            label="ISBN"
            value={formValues.isbn}
            onChange={handleTextChange}
            required
            disabled={disableIsbn || readOnly}
          />

          <Input
            name="category"
            label="Category"
            value={formValues.category}
            onChange={handleTextChange}
            disabled={readOnly}
          />
        </div>
      </section>

      <section className="border-b border-[var(--line)] pb-5">
        <p className="text-sm font-semibold text-[var(--text-strong)] mb-3">Description</p>
        <Textarea
          name="description"
          placeholder="What makes this book unique?"
          textareaClassName="resize-none h-40"
          value={formValues.description}
          onChange={handleTextChange}
          disabled={readOnly}
        />
      </section>

      <section className="border-b border-[var(--line)] pb-5">
        <p className="text-sm font-semibold text-[var(--text-strong)] mb-3">
          Publishing & copies
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            name="publishedYear"
            label="Published Year"
            placeholder="e.g. 2016"
            value={formValues.publishedYear}
            onChange={handleNumberChange}
            disabled={readOnly}
          />

          <Input
            type="number"
            name="copies"
            label="Total Copies"
            min={1}
            value={formValues.copies}
            onChange={handleNumberChange}
            disabled={readOnly}
          />

          <Input
            type="number"
            name="availableCopies"
            label="Available Copies"
            min={0}
            value={formValues.availableCopies}
            onChange={handleAvailableCopiesChange}
            disabled={readOnly}
          />
        </div>
      </section>

      <section className="border-b border-[var(--line)] pb-5">
        <p className="text-sm font-semibold text-[var(--text-strong)] mb-3">Status</p>
        <div className="flex flex-wrap gap-6">
          <label
            className={`flex items-center gap-3 text-sm text-[var(--text-strong)] ${
              readOnly ? "opacity-60" : ""
            }`}
          >
            <span className="relative inline-flex h-6 w-11 items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formValues.isActive}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                disabled={readOnly}
              />
              <span className="absolute inset-0 rounded-full border border-[var(--line)] bg-[var(--surface)] transition peer-checked:bg-[var(--accent)]" />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </span>
            Active (visible in system)
          </label>

          <label
            className={`flex items-center gap-3 text-sm text-[var(--text-strong)] ${
              readOnly ? "opacity-60" : ""
            }`}
          >
            <span className="relative inline-flex h-6 w-11 items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formValues.isAvailableforIssue}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    isAvailableforIssue: e.target.checked,
                  }))
                }
                disabled={readOnly}
              />
              <span className="absolute inset-0 rounded-full border border-[var(--line)] bg-[var(--surface)] transition peer-checked:bg-[var(--accent)]" />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </span>
            Available for issue
          </label>
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold text-[var(--text-strong)] mb-3">Cover upload</p>
        <div className="flex flex-col  gap-4">

          <div className="">
            <Input
              type="file"
              label="Upload Image"
              accept="image/*"
              onChange={handleCoverChange}
              helperText={coverLabel}
              disabled={readOnly}
            />
          </div>
          {coverPreview && (
            <div className="overflow-hidden border border-[var(--line)] w-40 h-60 self-center">
              <img
                src={coverPreview}
                alt="Book cover preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {!readOnly && (
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[var(--line)]">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </form>
  );
}
