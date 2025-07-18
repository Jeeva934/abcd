import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Upload, FileText, Image, Settings, Wand2, Brain } from "lucide-react";
import { toast } from "sonner";

interface QuestionConfig {
  id: string;
  text?: string; // Optional for AI-generated questions
  marks: number;
  difficulty: string;
  unit: string;
  subQuestionsCount: number;
  isAIGenerated: boolean;
  subQuestions?: SubQuestion[];
}

interface SubQuestion {
  id: string;
  text: string;
  marks: number;
}

interface AutoGenConfig {
  questionCount: number;
  marksPerQuestion: number;
  difficulty: string;
  units: string[];
  subQuestionsCount: number;
}

interface Section {
  id: string;
  name: string;
  isAutoGenerate: boolean;
  autoConfig: AutoGenConfig;
  questions: QuestionConfig[];
}

const Generator = () => {
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState("");
  const [university, setUniversity] = useState("");
  const [examDate, setExamDate] = useState("");
  const [duration, setDuration] = useState("");
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      name: "Section A",
      isAutoGenerate: true,
      autoConfig: {
        questionCount: 5,
        marksPerQuestion: 2,
        difficulty: "Easy",
        units: ["UNIT I"],
        subQuestionsCount: 0
      },
      questions: []
    }
  ]);

  const handleHeaderImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderImage(e.target?.result as string);
        toast.success("Header image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Section ${String.fromCharCode(65 + sections.length)}`,
      isAutoGenerate: true,
      autoConfig: {
        questionCount: 5,
        marksPerQuestion: 2,
        difficulty: "Medium",
        units: ["UNIT I"],
        subQuestionsCount: 0
      },
      questions: []
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== id));
    }
  };

  const updateSection = (id: string, field: keyof Section, value: any) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const updateAutoConfig = (sectionId: string, field: keyof AutoGenConfig, value: any) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          autoConfig: { ...section.autoConfig, [field]: value }
        };
      }
      return section;
    }));
  };

  const toggleAutoUnit = (sectionId: string, unit: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const units = section.autoConfig.units.includes(unit)
          ? section.autoConfig.units.filter(u => u !== unit)
          : [...section.autoConfig.units, unit];
        return {
          ...section,
          autoConfig: { ...section.autoConfig, units }
        };
      }
      return section;
    }));
  };

  // Smart AI Question Configuration
  const generateSmartQuestions = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const questions: QuestionConfig[] = [];
        for (let i = 0; i < section.autoConfig.questionCount; i++) {
          questions.push({
            id: `smart-${Date.now()}-${i}`,
            marks: section.autoConfig.marksPerQuestion,
            difficulty: section.autoConfig.difficulty,
            unit: section.autoConfig.units[0] || "UNIT I",
            subQuestionsCount: section.autoConfig.subQuestionsCount,
            isAIGenerated: true
          });
        }
        return { ...section, questions };
      }
      return section;
    }));
    toast.success("Smart question configuration generated!");
  };

  const addManualQuestion = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newQuestion: QuestionConfig = {
          id: Date.now().toString(),
          text: "",
          marks: 2,
          difficulty: "Medium",
          unit: "UNIT I",
          subQuestionsCount: 0,
          isAIGenerated: false,
          subQuestions: []
        };
        return { ...section, questions: [...section.questions, newQuestion] };
      }
      return section;
    }));
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.filter(q => q.id !== questionId)
        };
      }
      return section;
    }));
  };

  const updateQuestion = (sectionId: string, questionId: string, field: keyof QuestionConfig, value: any) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map(q =>
            q.id === questionId ? { ...q, [field]: value } : q
          )
        };
      }
      return section;
    }));
  };

  const generateAutoQuestions = (section: Section) => {
    const questions: QuestionConfig[] = [];
    
    if (section.isAutoGenerate) {
      // Use bulk auto-generation
      for (let i = 0; i < section.autoConfig.questionCount; i++) {
        const unitIndex = i % section.autoConfig.units.length;
        questions.push({
          id: `auto-${Date.now()}-${i}`,
          text: `AI will generate a ${section.autoConfig.difficulty.toLowerCase()} level question from ${section.autoConfig.units[unitIndex]}`,
          marks: section.autoConfig.marksPerQuestion,
          difficulty: section.autoConfig.difficulty,
          unit: section.autoConfig.units[unitIndex],
          subQuestionsCount: section.autoConfig.subQuestionsCount,
          isAIGenerated: true
        });
      }
    } else {
      // Use individual question configurations
      questions.push(...section.questions.map(q => ({
        ...q,
        text: q.isAIGenerated 
          ? `AI will generate a ${q.difficulty.toLowerCase()} level question from ${q.unit} (${q.marks} marks)${q.subQuestionsCount > 0 ? ` with ${q.subQuestionsCount} sub-questions` : ''}`
          : q.text || ""
      })));
    }
    
    return questions;
  };

  const totalMarks = sections.reduce((total, section) => {
    if (section.isAutoGenerate) {
      const baseMarks = section.autoConfig.questionCount * section.autoConfig.marksPerQuestion;
      const subMarks = section.autoConfig.questionCount * section.autoConfig.subQuestionsCount;
      return total + baseMarks + subMarks;
    } else {
      return total + section.questions.reduce((sectionTotal, question) => {
        const baseMarks = question.marks;
        const subMarks = question.subQuestionsCount || 0;
        return sectionTotal + baseMarks + subMarks;
      }, 0);
    }
  }, 0);

  const handleGenerate = () => {
    if (!subjectName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    
    const processedSections = sections.map(section => ({
      ...section,
      questions: generateAutoQuestions(section)
    }));
    
    const config = {
      subjectName,
      university,
      examDate,
      duration,
      headerImage,
      sections: processedSections,
      totalMarks,
      type: 'descriptive'
    };
    
    sessionStorage.setItem('questionPaperConfig', JSON.stringify(config));
    console.log("Generating question paper with:", config);
    toast.success("Question paper generated successfully!");
    navigate("/result");
  };

  const units = ["UNIT I", "UNIT II", "UNIT III", "UNIT IV", "UNIT V"];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:text-slate-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Upload Header Image */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Image className="w-5 h-5" />
              <span>Upload Custom Header Image (Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleHeaderImageUpload}
                className="hidden"
                id="header-upload"
              />
              <label htmlFor="header-upload" className="cursor-pointer">
                {headerImage ? (
                  <div className="space-y-4">
                    <img src={headerImage} alt="Header preview" className="max-h-32 mx-auto rounded" />
                    <p className="text-green-600">Header image uploaded!</p>
                  </div>
                ) : (
                  <>
                    <Image className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600">Click to upload your university/institution header</p>
                    <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                  </>
                )}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Configure Question Paper */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Configure Question Paper</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University/Institution</Label>
                <Input
                  id="university"
                  placeholder="e.g., Anna University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Name</Label>
                <Input
                  id="subject"
                  placeholder="e.g., MATRICES AND CALCULUS"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Exam Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 3 Hours"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            {/* Sections Configuration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Sections Configuration</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-green-600 font-medium">
                    Total Marks: {totalMarks}
                  </span>
                  <Button onClick={addSection} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div key={section.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Section Configuration</h4>
                      {sections.length > 1 && (
                        <Button
                          onClick={() => removeSection(section.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label>Section Name</Label>
                        <Input
                          value={section.name}
                          onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                          placeholder="Section A"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={section.isAutoGenerate}
                          onCheckedChange={(checked) => updateSection(section.id, 'isAutoGenerate', checked)}
                        />
                        <Label className="text-sm">
                          {section.isAutoGenerate ? 'Bulk AI Generation' : 'Individual Question Config'}
                        </Label>
                      </div>
                    </div>

                    {section.isAutoGenerate ? (
                      /* Bulk AI Generation */
                      <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900 flex items-center">
                          <Wand2 className="w-4 h-4 mr-2" />
                          Bulk AI Generation Settings
                        </h5>
                        <p className="text-sm text-blue-700">Configure common settings for all questions in this section</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Number of Questions</Label>
                            <Input
                              type="number"
                              value={section.autoConfig.questionCount}
                              onChange={(e) => updateAutoConfig(section.id, 'questionCount', parseInt(e.target.value) || 1)}
                              min="1"
                              max="20"
                            />
                          </div>
                          
                          <div>
                            <Label>Marks per Question</Label>
                            <Input
                              type="number"
                              value={section.autoConfig.marksPerQuestion}
                              onChange={(e) => updateAutoConfig(section.id, 'marksPerQuestion', parseInt(e.target.value) || 1)}
                              min="1"
                              max="20"
                            />
                          </div>
                          
                          <div>
                            <Label>Difficulty Level</Label>
                            <Select
                              value={section.autoConfig.difficulty}
                              onValueChange={(value) => updateAutoConfig(section.id, 'difficulty', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Sub-questions per Question</Label>
                            <Input
                              type="number"
                              value={section.autoConfig.subQuestionsCount}
                              onChange={(e) => updateAutoConfig(section.id, 'subQuestionsCount', parseInt(e.target.value) || 0)}
                              min="0"
                              max="5"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Units to Include</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {units.map((unit) => (
                              <Button
                                key={unit}
                                onClick={() => toggleAutoUnit(section.id, unit)}
                                variant={section.autoConfig.units.includes(unit) ? "default" : "outline"}
                                size="sm"
                                className={section.autoConfig.units.includes(unit) ? "bg-slate-900" : ""}
                              >
                                {unit}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Individual Question Configuration */
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium flex items-center">
                            <Brain className="w-4 h-4 mr-2" />
                            Smart Question Configuration
                          </h5>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => generateSmartQuestions(section.id)}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Smart Config
                            </Button>
                            <Button
                              onClick={() => addManualQuestion(section.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Manual Question
                            </Button>
                          </div>
                        </div>
                        
                        {section.questions.length === 0 && (
                          <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
                            <Brain className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                            <p className="mb-2">No questions configured yet</p>
                            <p className="text-sm">Use "Generate Smart Config" for AI-powered questions or "Add Manual Question" to write your own</p>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          {section.questions.map((question, questionIndex) => (
                            <div key={question.id} className={`border rounded p-4 ${question.isAIGenerated ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                              <div className="flex justify-between items-start mb-3">
                                <h6 className="text-sm font-medium text-slate-700 flex items-center">
                                  {question.isAIGenerated && <Wand2 className="w-4 h-4 mr-1 text-blue-600" />}
                                  Question {questionIndex + 1} {question.isAIGenerated ? '(AI Generated)' : '(Manual)'}
                                </h6>
                                <Button
                                  onClick={() => removeQuestion(section.id, question.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-4">
                                {!question.isAIGenerated && (
                                  <div>
                                    <Label>Question Text</Label>
                                    <Textarea
                                      value={question.text || ""}
                                      onChange={(e) => updateQuestion(section.id, question.id, 'text', e.target.value)}
                                      placeholder="Enter your question here..."
                                      className="min-h-[80px]"
                                    />
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div>
                                    <Label>Marks</Label>
                                    <Input
                                      type="number"
                                      value={question.marks}
                                      onChange={(e) => updateQuestion(section.id, question.id, 'marks', parseInt(e.target.value) || 1)}
                                      min="1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Difficulty</Label>
                                    <Select
                                      value={question.difficulty}
                                      onValueChange={(value) => updateQuestion(section.id, question.id, 'difficulty', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label>Unit</Label>
                                    <Select
                                      value={question.unit}
                                      onValueChange={(value) => updateQuestion(section.id, question.id, 'unit', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {units.map((unit) => (
                                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label>Sub-questions</Label>
                                    <Input
                                      type="number"
                                      value={question.subQuestionsCount}
                                      onChange={(e) => updateQuestion(section.id, question.id, 'subQuestionsCount', parseInt(e.target.value) || 0)}
                                      min="0"
                                      max="5"
                                    />
                                  </div>
                                </div>

                                {question.isAIGenerated && (
                                  <div className="bg-white p-3 rounded border border-blue-200">
                                    <p className="text-sm text-blue-700">
                                      🎯 <strong>AI will generate:</strong> A {question.difficulty.toLowerCase()} level question from {question.unit} 
                                      worth {question.marks} marks
                                      {question.subQuestionsCount > 0 && ` with ${question.subQuestionsCount} sub-questions`}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            onClick={handleGenerate}
            size="lg" 
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800"
          >
            <FileText className="w-5 h-5 mr-2" />
            Generate Question Paper
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Generator;
