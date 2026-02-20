"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    Check,
    LayoutTemplate,
    Users,
    FileText,
    Send
} from "lucide-react";
import Step1Details from "./Steps/Step1Details";
import Step2Audience from "./Steps/Step2Audience";
import Step3Content from "./Steps/Step3Content";
import Step4Review from "./Steps/Step4Review";

const steps = [
    { id: 1, title: "Details", icon: FileText },
    { id: 2, title: "Audience", icon: Users },
    { id: 3, title: "Content", icon: LayoutTemplate },
    { id: 4, title: "Review", icon: Send },
];

export default function CampaignWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [campaignData, setCampaignData] = useState({
        name: "",
        subject: "",
        listId: "",
        listName: "", // For display
        templateId: "",
        templateName: "", // For display
        htmlContent: "", // For preview
        scheduledAt: null
    });

    const updateData = (data: any) => {
        setCampaignData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Details data={campaignData} updateData={updateData} onNext={nextStep} />;
            case 2:
                // We'll implement Audience Fetching here
                return <Step2Audience data={campaignData} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 3:
                // We'll implement Template Selection here
                return <Step3Content data={campaignData} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 4:
                return <Step4Review data={campaignData} onBack={prevStep} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">

            {/* Wizard Progress Header */}
            <div className="mb-10">
                <div className="flex justify-between items-center relative">
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />

                    {/* Active Progress Bar */}
                    <div
                        className="absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center bg-white px-2">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                                        ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                                            isActive ? 'bg-white border-blue-600 text-blue-600' :
                                                'bg-white border-gray-300 text-gray-400'}
                                    `}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                {renderStep()}
            </div>
        </div>
    );
}
