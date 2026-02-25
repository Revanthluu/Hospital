
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    title: "Automated Wound Measurement",
    subtitle: "STEP 1 OF 3",
    description: "Our AI algorithms automatically measure surface area and depth, reducing documentation time by 40%. Eliminate manual ruler errors and get precise clinical data instantly.",
    features: ["Instant contour detection", "Tissue type segmentation"],
    image: "https://liu.se/dfsmedia/dd35e243dfb7406993c1815aaf88a675/61422-50063/ai-saranalys-f-sjoberg-2022-3084"
  },
  {
    title: "AI-Driven Measurement",
    subtitle: "STEP 2 OF 3",
    description: "Our AI algorithms automatically calculates surface area and depth with 98% accuracy, removing subjectivity from your documentation and ensuring consistent longitudinal tracking.",
    features: ["Instant contour detection", "Tissue type segmentation"],
    image: "data:image/jpeg;base64,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"
  },
  {
    title: "Start Your First Assessment",
    subtitle: "STEP 3 OF 3",
    description: "The AI is calibrated and ready. You can now upload wound imagery for instant analysis and documentation. Click below to begin.",
    features: ["System is secured and HIPAA compliant."],
    image: "https://media.licdn.com/dms/image/v2/D4E22AQEL7vuRIHwOjw/feedshare-shrink_800/feedshare-shrink_800/0/1725308640464?e=2147483647&v=beta&t=U3S3HoZa12MLNofmc67gJijHEsMaimbYRTpfw-GUIY4"
  }
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      navigate('/role-selection');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-plus"></i>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg">Wound Assessment Tool</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Hospital - Grade Diagnostics</p>
          </div>
        </div>
        <button onClick={() => navigate('/role-selection')} className="text-slate-500 font-bold hover:text-slate-800 transition-colors">Skip Intro</button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full">
          <div className="md:w-1/2 bg-slate-100 p-8 flex items-center justify-center">
            <img src={step.image} alt="Feature" className="rounded-2xl shadow-lg max-h-[400px] w-full object-cover" />
          </div>
          
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <p className="text-blue-500 font-bold text-sm tracking-widest mb-4 uppercase">{step.subtitle}</p>
            <h2 className="text-4xl font-extrabold text-slate-800 mb-6 leading-tight">{step.title}</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">{step.description}</p>
            
            <ul className="space-y-4 mb-10">
              {step.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                    <i className="fas fa-check"></i>
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mb-10 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-500" 
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex-1 border border-slate-200 hover:border-slate-300 py-4 rounded-xl font-bold text-slate-600 disabled:opacity-30 transition-all"
              >
                Previous
              </button>
              <button 
                onClick={handleNext}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next Step'}
                {currentStep !== STEPS.length - 1 && <i className="fas fa-arrow-right"></i>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
