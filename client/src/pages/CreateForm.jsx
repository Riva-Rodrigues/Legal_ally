import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import data from "../lib/data.json";

export default function CreateForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || {};

  const formData = data[category];

  if (!formData) {
    return <div>No form data found for this category.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    // Navigate to the TextEditor page with the form data
    navigate(`${location.pathname}/text-editor`, { state: { formValues, category } });
  };

  return (
    <div className="container mx-auto px-10 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">{formData.title}</h1>
      <p className="text-center mb-10">{formData.description}</p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {formData.fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              name={field.label.toLowerCase().replace(/ /g, "_")} // Convert label to a valid field name
              type={field.type}
              placeholder={field.placeholder || ""}
              required
            />
          </div>
        ))}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}