"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How accurate are your betting tips?",
    answer:
      "Our betting tips have maintained an average success rate of 87% over the past 5 years. We achieve this through comprehensive analysis, statistical models, and expert insights from our team of professional analysts.",
  },
  {
    question: "How often do you post new betting tips?",
    answer:
      "We post new betting tips daily, focusing on quality over quantity. Premium members receive exclusive tips that aren't available to free users, along with detailed analysis and reasoning behind each recommendation.",
  },
  {
    question: "How do cryptocurrency payments work?",
    answer:
      "We accept Bitcoin (BTC) and Solana (SOL) for premium subscriptions. After selecting your plan, you'll receive wallet address details for payment. Once confirmed on the blockchain, your account is instantly upgraded to premium status.",
  },
  {
    question: "Can I cancel my premium subscription?",
    answer:
      "Yes, you can cancel your premium subscription at any time. Your premium access will remain active until the end of your current billing period. We don't offer refunds for partially used subscription periods.",
  },
  {
    question: "Do you offer tips for all sports?",
    answer:
      "We primarily focus on major sports including football (soccer), basketball, tennis, American football, and baseball. Our premium service includes coverage of additional sports and specialized betting markets.",
  },
  {
    question: "How does the bankroll management system work?",
    answer:
      "Our bankroll management system helps you determine optimal bet sizes based on your total betting budget, the odds of each bet, and your risk tolerance. It's designed to maximize long-term profits while minimizing the risk of significant losses.",
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="group overflow-hidden rounded-lg border border-purple-900/30 bg-black/40 transition-all duration-200 hover:shadow-[0_0_15px_rgba(120,58,180,0.2)]"
        >
          <button
            onClick={() => toggleFaq(index)}
            className="flex w-full items-center justify-between p-4 text-left text-white focus:outline-none"
          >
            <span className="text-lg font-medium">{faq.question}</span>
            <ChevronDown
              className={`h-5 w-5 text-purple-400 transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <p className="px-4 text-muted-foreground">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

