
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SubQuestion {
  id: string;
  text: string;
  marks: number;
}

interface Question {
  id: string;
  text: string;
  options?: string[];
  marks: number;
  unit: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  subQuestions?: SubQuestion[];
}

interface EditableQuestionPaperProps {
  config: any;
  questions?: Question[];
  onSave: (updatedQuestions: Question[]) => void;
}

const EditableQuestionPaper = ({ config, questions = [], onSave }: EditableQuestionPaperProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState(config);

  const handleSave = () => {
    onSave(config.sections?.flatMap((section: any) => section.questions) || []);
    setIsEditing(false);
    toast.success("Question paper updated successfully!");
  };

  const handleCancel = () => {
    setEditedConfig(config);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date: ___________";
    const date = new Date(dateString);
    return `Date: ${date.toLocaleDateString()}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div id="question-paper-content" className="relative">
      <div className="flex justify-end mb-4 no-print">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Paper
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Header */}
      {editedConfig.headerImage && (
        <div className="header text-center mb-6">
          <img 
            src={editedConfig.headerImage} 
            alt="Institution Header" 
            className="max-h-24 mx-auto mb-4"
          />
        </div>
      )}

      <div className="header text-center mb-8">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editedConfig.university || ""}
              onChange={(e) => setEditedConfig({...editedConfig, university: e.target.value})}
              placeholder="University Name"
              className="text-center text-2xl font-bold"
            />
            <Input
              value={editedConfig.subjectName}
              onChange={(e) => setEditedConfig({...editedConfig, subjectName: e.target.value})}
              placeholder="Subject Name"
              className="text-center text-xl font-semibold"
            />
          </div>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              {editedConfig.university || "University Name"}
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-6">
              {editedConfig.subjectName}
            </h3>
          </>
        )}
        
        <div className="exam-details flex flex-col sm:flex-row justify-between items-center text-sm text-slate-600 border-b-2 border-slate-900 pb-4 gap-2">
          <span>{formatDate(editedConfig.examDate)}</span>
          <span>Time: {editedConfig.duration || "Duration: ___________"}</span>
          <span className="marks">Total Marks: {editedConfig.totalMarks}</span>
        </div>
      </div>

      {/* Sections */}
      {editedConfig.sections?.map((section: any, sectionIndex: number) => (
        <div key={section.id} className="mb-8">
          <h4 className="section-title text-lg font-semibold text-slate-900 mb-6">
            {section.name}
          </h4>
          
          <div className="space-y-6">
            {section.questions?.map((question: Question, index: number) => (
              <div key={question.id} className="question border-b border-slate-200 pb-6 last:border-b-0">
                <div className="question-header flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="question-number text-lg font-medium">{index + 1}.</span>
                      {question.difficulty && (
                        <span className={`difficulty-badge text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div className="question-text text-slate-800 leading-relaxed mb-3">
                      {question.text}
                    </div>
                    
                    {editedConfig.type === 'mcq' && question.options && (
                      <div className="question-options mt-3 ml-4">
                        {question.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="mb-2">{option}</div>
                        ))}
                      </div>
                    )}
                    
                    {question.subQuestions && question.subQuestions.length > 0 && (
                      <div className="sub-questions ml-6 mt-4 space-y-3">
                        {question.subQuestions.map((subQ, subIndex) => (
                          <div key={subQ.id} className="sub-question flex justify-between items-start">
                            <p className="text-slate-700 flex-1">
                              {String.fromCharCode(97 + subIndex)}. {subQ.text}
                            </p>
                            <span className="marks text-sm font-medium text-slate-600 ml-4">
                              [{subQ.marks} Mark{subQ.marks !== 1 ? 's' : ''}]
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="unit-info text-sm text-slate-500 mt-3">
                      (From {question.unit})
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="marks font-medium text-slate-900">
                      [{question.subQuestions && question.subQuestions.length > 0 
                        ? question.marks + question.subQuestions.reduce((total, sq) => total + sq.marks, 0)
                        : question.marks} Mark{((question.subQuestions && question.subQuestions.length > 0 
                          ? question.marks + question.subQuestions.reduce((total, sq) => total + sq.marks, 0)
                          : question.marks) !== 1) ? 's' : ''}]
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="footer mt-12 pt-4 border-t border-slate-200 text-center">
        <p className="text-sm text-slate-500">
          Generated using AI Question Paper Generator • {editedConfig.university || "University"} Format
        </p>
      </div>
    </div>
  );
};

export default EditableQuestionPaper;
