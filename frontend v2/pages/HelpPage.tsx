import React, { useState } from 'react';
import Card from '../components/ui/Card';

const faqs = [
  {
    question: "Is my vote truly anonymous?",
    answer: "Yes. While your eligibility to vote is verified, your actual vote is decoupled from your identity. A cryptographic hash of your voter ID is used to record the transaction, making it impossible to trace the vote back to you while still ensuring one person, one vote.",
  },
  {
    question: "How do I get a receipt for my vote?",
    answer: "After you cast your vote, you will receive a unique transaction hash. This hash is your digital receipt. You can use it in the Blockchain Explorer to confirm that a vote was successfully recorded for your election at a specific time, without revealing who you voted for.",
  },
  {
    question: "What is the purpose of the identity verification step?",
    answer: "Identity verification is a crucial one-time process to ensure that only eligible, registered voters can participate in an election. This prevents fraud and maintains the integrity of the democratic process. Your documents are used for verification purposes only and are not stored on the blockchain.",
  },
    {
    question: "Can an election be tampered with?",
    answer: "The use of blockchain technology makes tampering extremely difficult. Every vote is a transaction in a block, cryptographically linked to the previous one. To alter a vote, an attacker would need to alter all subsequent blocks on a majority of the network nodes simultaneously, which is computationally infeasible.",
  },
];

const AccordionItem: React.FC<{ q: string; a: string; isOpen: boolean; onClick: () => void; }> = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-slate-200">
        <h2>
            <button type="button" onClick={onClick} className="flex justify-between items-center w-full p-5 font-medium text-left text-slate-700 hover:bg-slate-100">
                <span>{q}</span>
                <svg className={`w-6 h-6 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </h2>
        <div className={`p-5 border-t-0 ${isOpen ? 'block' : 'hidden'}`}>
            <p className="text-slate-600">{a}</p>
        </div>
    </div>
);

const HelpPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="bg-slate-100">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-indigo-900">Help Center</h1>
                    <p className="text-lg text-slate-600 mt-1">Frequently Asked Questions</p>
                </header>
                
                <Card className="overflow-hidden">
                    {faqs.map((faq, index) => (
                        <AccordionItem 
                            key={index}
                            q={faq.question}
                            a={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </Card>

                <Card className="mt-10 p-6 bg-amber-50 border-amber-200">
                    <h2 className="text-xl font-semibold text-amber-800">Legal Disclaimer</h2>
                    <p className="text-amber-700 mt-2 text-sm">
                        The CivicTrust Platform is a demonstration application. The blockchain, transactions, and voting processes are simulated and should not be used for official, legally-binding elections. No real personal data is stored or transmitted.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default HelpPage;