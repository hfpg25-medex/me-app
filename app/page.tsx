import Header from '@/components/Header'
import LoginForm from '@/components/LoginForm'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <LoginSection id="login-section" />
      </main>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Streamline Medical Examination Submissions</h1>
          <p className="text-xl mb-8 text-blue-100">
            A centralized portal for clinics to efficiently submit statutory medical examination results to various government agencies.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { title: "Multi-Agency Submissions", description: "Submit to MOM, ICA, SPF, LTA, and more from a single platform." },
    { title: "Secure & Compliant", description: "Built with the highest security standards to protect sensitive medical data." },
    { title: "Efficient Workflow", description: "Streamline your submission process and save time on administrative tasks." },
    { title: "Real-time Updates", description: "Get instant confirmation and track the status of your submissions." },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Portal?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LoginSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Log into Your Account</h2>
          <LoginForm />
        </div>
      </div>
    </section>
  )
}

