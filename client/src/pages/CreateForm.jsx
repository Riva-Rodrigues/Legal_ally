import { useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import data from "../lib/data.json"

export default function CreateForm() {
  const location = useLocation()
  const { category } = location.state || {}

  const formData = data[category]

  if (!formData) {
    return <div>No form data found for this category.</div>
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">{formData.title}</h1>
      <p className="text-center mb-10">{formData.description}</p>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`field-${index}`}>{field.label}</Label>
              <Input id={`field-${index}`} type={field.type} placeholder={field.placeholder || ""} required />
            </div>
          ))}
        </div>
        <Button type="submit" className="w-full mt-6">
          Submit
        </Button>
      </form>
    </div>
  )
}