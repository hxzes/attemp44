import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Rocket, Shield } from "lucide-react"

const features = [
  {
    title: "Expert Analysis",
    description: "Receive in-depth analysis and insights from seasoned sports experts.",
    icon: <BarChart className="h-6 w-6" />,
  },
  {
    title: "Real-Time Notifications",
    description: "Get instant alerts on the latest tips and opportunities.",
    icon: <Rocket className="h-6 w-6" />,
  },
  {
    title: "Secure & Private",
    description: "Your data is protected with top-notch security measures.",
    icon: <Shield className="h-6 w-6" />,
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">WisePicks</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Expert Betting Tips & Analysis</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of bettors who trust WisePicks for premium sports betting tips and analysis.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose WisePicks?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Expert Analysis</h3>
                <p className="text-gray-600">
                  Our team of professional analysts provides in-depth research and insights.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Proven Track Record</h3>
                <p className="text-gray-600">65% win rate across all sports with transparent performance tracking.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Premium Insights</h3>
                <p className="text-gray-600">Exclusive tips and strategies available only to our premium members.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>© 2023 WisePicks. All rights reserved.</p>
          <p className="mt-2 text-gray-400 text-sm">Gambling involves risk. Please gamble responsibly.</p>
        </div>
      </footer>
    </div>
  )
}

