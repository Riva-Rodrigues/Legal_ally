import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import { templates } from "@/lib/templates";

export default function TextEditor() {
  const [versions, setVersions] = useState([{ id: 1, content: "", timestamp: new Date() }]);
  const [currentVersionId, setCurrentVersionId] = useState(1);
  const editorRef = useRef(null);

  const location = useLocation();
  const { formValues, category } = location.state || {};

  // Function to safely generate the template based on the category and form values
  const generateTemplate = (category, formValues) => {
    let template = templates[category] || "Template not found.";

    if (!formValues) return template;

    // Extract all placeholders from the template
    const placeholderRegex = /\[(.*?)\]/g;
    const matches = template.match(placeholderRegex) || [];
    
    // Create a map of placeholders to their values
    const replacements = matches.reduce((acc, placeholder) => {
      // Remove brackets to get the key
      const key = placeholder.slice(1, -1).toLowerCase().replace(/\s+/g, '_');
      if (formValues[key]) {
        acc[placeholder] = formValues[key];
      }
      return acc;
    }, {});

    // Replace all placeholders with their corresponding values
    Object.entries(replacements).forEach(([placeholder, value]) => {
      template = template.split(placeholder).join(value);
    });

    return template;
  };

  useEffect(() => {
    if (formValues && category && editorRef.current) {
      const template = generateTemplate(category, formValues);
      editorRef.current.innerHTML = template;
      saveVersion(); // Save the initial content as the first version
    }
  }, [formValues, category]);

  const saveVersion = () => {
    if (editorRef.current) {
      const newVersion = {
        id: versions.length + 1,
        content: editorRef.current.innerHTML,
        timestamp: new Date(),
      };
      setVersions([...versions, newVersion]);
      setCurrentVersionId(newVersion.id);
    }
  };

  const switchVersion = (versionId) => {
    setCurrentVersionId(versionId);
    const selectedVersion = versions.find((v) => v.id === versionId);
    if (selectedVersion && editorRef.current) {
      editorRef.current.innerHTML = selectedVersion.content;
    }
  };

  const downloadAsPDF = () => {
    const input = editorRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("document.pdf");
    });
  };

  const downloadAsDoc = () => {
    const content = editorRef.current.innerText;
    const blob = new Blob(["\ufeff", content], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.doc";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row h-screen max-w-full mx-auto p-4 gap-4">
        <div className="flex flex-col w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-4">Enhanced Version Control Text Editor</h1>
          <div
            ref={editorRef}
            contentEditable
            className="flex-grow p-4 border rounded overflow-auto whitespace-pre-wrap"
            style={{ minHeight: "200px" }}
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={saveVersion}>Save Version</Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={downloadAsPDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={downloadAsDoc}>
                    <FileDown className="h-4 w-4 mr-2" />
                    DOC
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as DOC</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <h2 className="text-xl font-semibold mb-4">Versions</h2>
          <ScrollArea className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  version.id === currentVersionId ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`}
                onClick={() => switchVersion(version.id)}
              >
                <h3 className="font-medium">Version {version.id}</h3>
                <p className="text-sm">{version.timestamp.toLocaleString()}</p>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}