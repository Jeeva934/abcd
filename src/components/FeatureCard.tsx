
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
          <div className="text-slate-900">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
