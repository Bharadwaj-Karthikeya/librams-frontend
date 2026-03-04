import { useState } from "react";
import { BookPlus } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function IssueForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    isbn: "",
    toUserEmail: "",
    dueDate: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="isbn"
          label="Book ISBN"
          placeholder="ISBN"
          onChange={handleChange}
        />
        <Input
          name="toUserEmail"
          label="Student email"
          placeholder="student@email.com"
          onChange={handleChange}
        />
        <Input
          type="date"
          name="dueDate"
          label="Due date"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[var(--line)]">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          <span className="inline-flex items-center gap-2">
            <BookPlus size={16} />
            Issue book
          </span>
        </Button>
      </div>
    </form>
  );
}