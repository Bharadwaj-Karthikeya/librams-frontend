import { useEffect, useMemo, useState } from "react";

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

export default function BookForm({
  onSubmit,
  initialData,
  loading,
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

  useEffect(() => {
    if (!initialData) return;
    setFormValues((prev) => ({
      ...prev,
      ...initialData,
      copies: initialData?.copies ?? initialData?.availableCopies ?? 1,
      availableCopies: initialData?.availableCopies ?? initialData?.copies ?? 1,
      publishedYear: initialData?.publishedYear ?? "",
    }));
    setCoverPreview(initialData?.bookCover || null);
  }, [initialData]);

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

  const commonInputClasses =
    "p-2 border rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500";

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
        onSubmit(payload);
      }}
      className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2"
    >
      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Basic Information
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm text-gray-600 flex flex-col gap-1">
            <span>Title</span>
            <input
              name="title"
              className={commonInputClasses}
              value={formValues.title}
              onChange={handleTextChange}
              required
              disabled={readOnly}
            />
          </label>

          <label className="text-sm text-gray-600 flex flex-col gap-1">
            <span>Author</span>
            <input
              name="author"
              className={commonInputClasses}
              value={formValues.author}
              onChange={handleTextChange}
              required
              disabled={readOnly}
            />
          </label>

          <label className="text-sm text-gray-600 flex flex-col gap-1">
            <span>ISBN</span>
            <input
              name="isbn"
              className={commonInputClasses}
              value={formValues.isbn}
              onChange={handleTextChange}
              required
              disabled={disableIsbn || readOnly}
            />
          </label>

          <label className="text-sm text-gray-600 flex flex-col gap-1">
            <span>Category</span>
            <input
              name="category"
              className={commonInputClasses}
              value={formValues.category}
              onChange={handleTextChange}
              disabled={readOnly}
            />
          </label>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Description</p>
        <textarea
          name="description"
          placeholder="What makes this book unique?"
          className="p-3 border rounded-md resize-none h-40 w-full bg-white disabled:bg-gray-100 disabled:text-gray-500"
          value={formValues.description}
          onChange={handleTextChange}
          disabled={readOnly}
        />
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Publishing & Copies
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-sm text-gray-600 flex flex-col gap-1">
            <span>Published Year</span>
            <input
              type="number"
              name="publishedYear"
              placeholder="e.g. 2016"
              className={commonInputClasses}
              value={formValues.publishedYear}
              onChange={handleNumberChange}
              disabled={readOnly}
            />
          </label>

          <label className="text-sm text-gray-600 flex flex-col gap-1">
            <span>Total Copies</span>
            <input
              type="number"
              name="copies"
              min={1}
              className={commonInputClasses}
              value={formValues.copies}
              onChange={handleNumberChange}
              disabled={readOnly}
            />
          </label>

          <label className="text-sm text-gray-600 flex flex-col gap-1">
            <span>Available Copies</span>
            <input
              type="number"
              min={0}
              className={commonInputClasses}
              value={formValues.availableCopies}
              onChange={handleAvailableCopiesChange}
              disabled={readOnly}
            />
          </label>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Status</p>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formValues.isActive}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              disabled={readOnly}
            />
            Active (visible in system)
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formValues.isAvailableforIssue}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  isAvailableforIssue: e.target.checked,
                }))
              }
              disabled={readOnly}
            />
            Available for issue
          </label>
        </div>
      </section>

      <section className="bg-white h-400 border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Cover Upload</p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="block w-full text-sm"
              disabled={readOnly}
            />
            <p className="text-xs text-gray-500 mt-1">{coverLabel}</p>
          </div>

          {coverPreview && (
            <div className="rounded-xl overflow-hidden border w-28 h-36 self-center">
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
        <button
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      )}
    </form>
  );
}
