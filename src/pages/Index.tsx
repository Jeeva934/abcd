import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download, Zap, Users, Shield, Brain, Settings, Image, FileKey, Share, Clock, BookOpen } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  const recentPapers = [
    {
      id: 1,
      subject: "MATRICES AND CALCULUS",
      university: "Anna University",
      date: "2025-01-15",
      marks: 100,
      sections: 3
    },
    {
      id: 2,
      subject: "DATA STRUCTURES",
      university: "VTU",
      date: "2025-01-10",
      marks: 80,
      sections: 2
    },
    {
      id: 3,
      subject: "DIGITAL ELECTRONICS",
      university: "Mumbai University",
      date: "2025-01-08",
      marks: 75,
      sections: 4
    }
  ];

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Syllabus",
      description: "Simply upload your syllabus image and let AI understand the content"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Generation",
      description: "Our advanced AI generates relevant questions based on your requirements"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Options",
      description: "Download your question papers in PDF or Word format instantly"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-slate-900" />
              <span className="text-xl font-bold text-slate-900">QuestionCraft</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/pricing" className="text-slate-700 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link to="/generator" className="text-slate-700 hover:text-slate-900 transition-colors">
                Generator
              </Link>
              <Link to="/mcq-generator" className="text-slate-700 hover:text-slate-900 transition-colors">
                MCQ Generator
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-slate-900 hover:bg-slate-800">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Generate Question Papers with{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Create professional question papers instantly with customizable sections, difficulty levels, 
            and automated answer keys. Perfect for educators and institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generator">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 px-8 py-3">
                <FileText className="w-5 h-5 mr-2" />
                Start Generating
              </Button>
            </Link>
            <Link to="/mcq-generator">
              <Button size="lg" variant="outline" className="px-8 py-3">
                <Brain className="w-5 h-5 mr-2" />
                MCQ Generator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Question Paper Creation
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features designed for modern education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap />}
              title="AI-Powered Generation"
              description="Leverage advanced AI to create relevant, well-structured questions tailored to your syllabus"
            />
            <FeatureCard
              icon={<Settings />}
              title="Customizable Sections"
              description="Configure multiple sections with different difficulty levels, marks, and question counts"
            />
            <FeatureCard
              icon={<Download />}
              title="Multiple Export Formats"
              description="Download your question papers as PDF or Word documents with professional formatting"
            />
            <FeatureCard
              icon={<Image />}
              title="Custom Headers"
              description="Upload your institution's logo and create branded question papers"
            />
            <FeatureCard
              icon={<FileKey />}
              title="Answer Key Generation"
              description="Automatically generate comprehensive answer keys with explanations"
            />
            <FeatureCard
              icon={<Brain />}
              title="MCQ Generator"
              description="Specialized tool for creating multiple choice question papers with options"
            />
            <FeatureCard
              icon={<Share />}
              title="Easy Sharing"
              description="Share question papers via email, WhatsApp, or export to Google Drive"
            />
            <FeatureCard
              icon={<Clock />}
              title="Time Configuration"
              description="Set exam duration and dates with automatic formatting"
            />
            <FeatureCard
              icon={<BookOpen />}
              title="Unit-wise Questions"
              description="Organize questions by syllabus units for comprehensive coverage"
            />
          </div>
        </div>
      </section>

      {/* Recent Papers Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Recently Created</h2>
            <Link to="/generator">
              <Button variant="outline">Create New</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{paper.subject}</CardTitle>
                  <CardDescription>{paper.university}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-slate-600 mb-4">
                    <span>Marks: {paper.marks}</span>
                    <span>Sections: {paper.sections}</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    Created: {new Date(paper.date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Question Paper Creation?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of educators who have already made the switch to AI-powered question generation.
          </p>
          <Link to="/generator">
            <Button size="lg" className="px-8 py-3 bg-white text-slate-900 hover:bg-slate-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="text-2xl">📝</div>
              <span className="text-lg font-semibold text-slate-900">QuestionPaper AI</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-600">
              <Link to="/pricing" className="hover:text-slate-900">Pricing</Link>
              <Link to="/login" className="hover:text-slate-900">Sign In</Link>
              <Link to="/signup" className="hover:text-slate-900">Sign Up</Link>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2025 QuestionPaper AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
