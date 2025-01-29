import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bold, Italic, Type, Highlighter, AlignLeft, AlignCenter, AlignRight, Indent, Outdent, FileDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";

export default function TextEditor() {
  const [versions, setVersions] = useState([{ id: 1, content: "", timestamp: new Date() }]);
  const [currentVersionId, setCurrentVersionId] = useState(1);
  const editorRef = useRef(null);

  const location = useLocation();
  const { formValues, category } = location.state || {};

  // Function to generate the template based on the category
  const generateTemplate = (category, fields) => {
    const templates = {
      "Employee Bond for Non-Compete": `By this Bond ${fields.employee_name} residing at ${fields.employee_address} binds himself to pay to ${fields.employer_name} the sum of Rs. ${fields.amount_of_liquidated_damages} as liquidated damages.

WHEREAS the Employee is a qualified person employed by the Employer in their business of ${fields.employer_business_details} and in the course of employment may come to know trade secrets and confidential information.

AND WHEREAS as per the terms of employment, the Employee has promised not to misuse their position by disclosing to any person the knowledge acquired during employment and has agreed to execute this Bond.

AND WHEREAS however, in the event of misuse of position as stated herein, the Employee agrees to make good the loss by paying the said sum of Rs. ${fields.amount_of_liquidated_damages} as compensation.

NOW the condition of this bond is that during the course of employment, the Employee will work faithfully and honestly and shall not disclose to any person the knowledge regarding the business and shall not, after ceasing to be an employee due to resignation or dismissal or removal or for any reason whatsoever, carry on any business similar to the Employer's business or work with any other similar business, either as an employee or on ad hoc basis or partially or otherwise directly or indirectly within ${fields.non_compete_geographical_scope} and for a period of ${fields.non_compete_duration} from the time of cessation of service.

Date: ${fields.date_of_agreement}

Signed and delivered by
${fields.employee_name}

WITNESSES:
1. ${fields.witness_signatures}`,

      "Employee Service Agreement": `THIS EMPLOYEE SERVICE AGREEMENT executed at ${fields.employer_registered_office_address} on ${fields.date_of_agreement}

BETWEEN

${fields.employer_name}, represented by its authorized signatory, having its registered office at ${fields.employer_registered_office_address} (hereinafter referred to as the EMPLOYER)

AND

${fields.employee_name}, residing at ${fields.employee_address} (hereinafter referred to as the EMPLOYEE)

The Employee is hereby appointed as ${fields.job_title_post} on the following terms:

1. PROBATION: ${fields.probation_period} months with a stipend of Rs. ${fields.probation_stipend}
2. DURATION: ${fields.employment_duration} after successful probation
3. LOCATION: ${fields.place_of_posting}
4. WORKING HOURS: ${fields.work_hours} with weekly off on ${fields.weekly_holiday}
5. SALARY: Basic salary of Rs. ${fields.basic_salary_after_confirmation} after confirmation
6. BENEFITS: ${fields.benefits_perks}
7. ARBITRATION: ${fields.arbitration_details}

Signatures:
Employer: _____________
Employee: _____________

Witnesses:
1. ${fields.witness_signatures}`,

      // Add other templates here...
    };

    return templates[category] || "Template not found.";
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

  const applyStyle = (command, value) => {
    document.execCommand(command, false, value);
  };

  const changeFontSize = (increase) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      const size = increase ? "larger" : "smaller";
      span.style.fontSize = size;
      range.surroundContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const highlight = () => {
    applyStyle("hiliteColor", "yellow");
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
          <div className="flex gap-2 mb-2 flex-wrap">
            {/* Toolbar buttons */}
          </div>
          <div
            ref={editorRef}
            contentEditable
            className="flex-grow p-4 border rounded overflow-auto"
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