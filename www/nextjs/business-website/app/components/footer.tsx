import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white shadow-lg border-t border-blue-500 pb-5">
      <div className="container mx-auto px-4 mt-5">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">CyberPrint</h3>
            <p className="text-gray-400">
              Your gateway to cutting-edge 3D printing solutions
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/print"
                  className="hover:text-blue-400 transition duration-300"
                >
                  Print
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                <Twitter />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2025 CyberPrint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
