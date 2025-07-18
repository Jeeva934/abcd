
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit, Download, Upload, FileKey } from "lucide-react";
import { toast } from "sonner";
import AnswerKeyGenerator from "@/components/AnswerKeyGenerator";
import ShareDialog from "@/components/ShareDialog";
import EditableQuestionPaper from "@/components/EditableQuestionPaper";
import { generatePDF, generateWordDocument } from "@/utils/pdfGenerator";

interface QuestionPaperConfig {
  subjectName: string;
  university: string;
  examDate: string;
  duration: string;
  headerImage: string | null;
  sections: any[];
  totalMarks: number;
  type?: 'mcq' | 'descriptive';
}

interface AnswerItem {
  id: string;
  question: string;
  answer: string;
  marks: number;
  explanation?: string;
}

const Result = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<QuestionPaperConfig | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [answerKey, setAnswerKey] = useState<AnswerItem[]>([]);

  useEffect(() => {
    const savedConfig = sessionStorage.getItem('questionPaperConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      navigate('/generator');
    }
  }, [navigate]);

  const handlePDFGenerate = () => {
    const filename = config?.subjectName || 'Question Paper';
    generatePDF('question-paper-content', filename);
    toast.success("PDF export initiated - check your downloads folder");
  };

  const handleWordGenerate = () => {
    const filename = config?.subjectName || 'question-paper';
    generateWordDocument('question-paper-content', filename);
    toast.success("Word document downloaded successfully!");
  };

  const handleAnswerKeyGenerate = (answers: AnswerItem[]) => {
    setAnswerKey(answers);
    setShowAnswerKey(true);
  };

  const handleEditConfiguration = () => {
    toast.info("Redirecting to edit configuration");
    navigate('/generator');
  };

  const handleQuestionsSave = (updatedQuestions: any[]) => {
    if (config) {
      const updatedConfig = { ...config };
      sessionStorage.setItem('questionPaperConfig', JSON.stringify(updatedConfig));
      toast.success("Question paper saved successfully!");
    }
  };

  if (!config) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/generator" className="flex items-center space-x-2 text-slate-900 hover:text-slate-700">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Generator</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Generated Question Paper</span>
              <span className="sm:hidden">Paper</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Generated Question Paper</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={() => setShowAnswerKey(!showAnswerKey)} 
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <FileKey className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{showAnswerKey ? 'Hide' : 'Generate'} Answer Key</span>
              <span className="sm:hidden">Answer Key</span>
            </Button>
            <ShareDialog 
              title={config.subjectName} 
              content="Question paper generated successfully" 
            />
            <Button onClick={handleEditConfiguration} variant="outline" size="sm" className="text-xs sm:text-sm">
              <Edit className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Edit Config</span>
              <span className="sm:hidden">Config</span>
            </Button>
            <Button onClick={handleWordGenerate} variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Word</span>
              <span className="sm:hidden">DOC</span>
            </Button>
            <Button onClick={handlePDFGenerate} className="bg-slate-900 hover:bg-slate-800" size="sm">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>

        {showAnswerKey && (
          <AnswerKeyGenerator 
            onGenerate={handleAnswerKeyGenerate} 
            questionPaperType={config.type}
          />
        )}

        {answerKey.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-4 sm:p-8">
              <h3 className="text-xl font-bold mb-6">Answer Key</h3>
              <div className="space-y-4">
                {answerKey.map((answer, index) => (
                  <div key={answer.id} className="border-b border-slate-200 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                      <span className="font-medium">{answer.question}</span>
                      <span className="text-sm text-slate-500">[{answer.marks} Marks]</span>
                    </div>
                    <p className="text-slate-700 mb-2">
                      <strong>Answer:</strong> {answer.answer}
                    </p>
                    {answer.explanation && (
                      <p className="text-slate-600 text-sm">
                        <strong>Explanation:</strong> {answer.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white shadow-lg">
          <CardContent className="p-4 sm:p-8">
            <EditableQuestionPaper
              config={config}
              onSave={handleQuestionsSave}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Result;
