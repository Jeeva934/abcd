
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AnswerItem {
  id: string;
  question: string;
  answer: string;
  marks: number;
  explanation?: string;
}

interface AnswerKeyGeneratorProps {
  onGenerate: (answers: AnswerItem[]) => void;
  questionPaperType?: 'mcq' | 'descriptive';
}

const AnswerKeyGenerator = ({ onGenerate, questionPaperType = 'descriptive' }: AnswerKeyGeneratorProps) => {
  const [answers, setAnswers] = useState<AnswerItem[]>([
    {
      id: "1",
      question: "Question 1",
      answer: "",
      marks: 2,
      explanation: ""
    }
  ]);

  const addAnswer = () => {
    const newAnswer: AnswerItem = {
      id: Date.now().toString(),
      question: `Question ${answers.length + 1}`,
      answer: "",
      marks: 2,
      explanation: ""
    };
    setAnswers([...answers, newAnswer]);
  };

  const removeAnswer = (id: string) => {
    if (answers.length > 1) {
      setAnswers(answers.filter(answer => answer.id !== id));
    }
  };

  const updateAnswer = (id: string, field: keyof AnswerItem, value: any) => {
    setAnswers(answers.map(answer => 
      answer.id === id ? { ...answer, [field]: value } : answer
    ));
  };

  const handleGenerate = () => {
    const validAnswers = answers.filter(answer => answer.answer.trim());
    if (validAnswers.length === 0) {
      toast.error("Please provide at least one answer");
      return;
    }
    
    onGenerate(validAnswers);
    toast.success("Answer key generated successfully!");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Generate Answer Key</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Answer Configuration</h3>
          <Button onClick={addAnswer} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Answer
          </Button>
        </div>

        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={answer.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Answer {index + 1}</h4>
                {answers.length > 1 && (
                  <Button
                    onClick={() => removeAnswer(answer.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Question Reference</Label>
                  <Input
                    value={answer.question}
                    onChange={(e) => updateAnswer(answer.id, 'question', e.target.value)}
                    placeholder="Question 1"
                  />
                </div>
                <div>
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    value={answer.marks}
                    onChange={(e) => updateAnswer(answer.id, 'marks', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                {questionPaperType === 'mcq' && (
                  <div>
                    <Label>Correct Option</Label>
                    <Select
                      value={answer.answer}
                      onValueChange={(value) => updateAnswer(answer.id, 'answer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {questionPaperType === 'descriptive' && (
                <div className="mb-4">
                  <Label>Answer</Label>
                  <textarea
                    className="w-full mt-1 p-2 border border-slate-300 rounded-md"
                    rows={3}
                    value={answer.answer}
                    onChange={(e) => updateAnswer(answer.id, 'answer', e.target.value)}
                    placeholder="Enter the complete answer..."
                  />
                </div>
              )}

              <div>
                <Label>Explanation (Optional)</Label>
                <textarea
                  className="w-full mt-1 p-2 border border-slate-300 rounded-md"
                  rows={2}
                  value={answer.explanation}
                  onChange={(e) => updateAnswer(answer.id, 'explanation', e.target.value)}
                  placeholder="Add explanation for the answer..."
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={handleGenerate} className="bg-slate-900 hover:bg-slate-800">
            <FileText className="w-5 h-5 mr-2" />
            Generate Answer Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerKeyGenerator;
