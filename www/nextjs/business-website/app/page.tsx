import GetPrintingButton from "./components/get-printing-button";
import ServicesSlideshow from "./components/services-slideshow";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat bg-[length:100px_100px]"
          style={{
            backgroundImage: "url('/placeholder.svg?height=100&width=100')",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-12">
          <section className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Welcome to CyberPrint
            </h1>
            <p className="text-2xl mb-8 text-gray-300">
              Your gateway to cutting-edge 3D printing solutions
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-4xl font-semibold mb-8 text-center">
              Our Services
            </h2>
            <ServicesSlideshow />
          </section>

          <section className="mb-16">
            <h2 className="text-4xl font-semibold mb-8 text-center">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Cutting-edge Technology
                </h3>
                <p>
                  We use only the finest Belgian plastics to ensure the highest
                  quality prints for our customers.
                </p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Expert Team</h3>
                <p>
                  Our team of top-notch 3D printing experts will sit and watch
                  the machine make your creation from beginning to end.
                </p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Fast Turnaround</h3>
                <p>
                  Leveraging cutting-edge AI-driven automation, scalable cloud
                  infrastructure, and blockchain-based solutions, we ensure a
                  lightning-fast turnaround by seamlessly integrating machine
                  learning models, real-time data processing pipelines, and
                  decentralized crypto technologies, empowering agile workflows
                  and accelerating innovation.
                </p>
              </div>
            </div>
            <div className="text-center mt-20">
              <GetPrintingButton />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
