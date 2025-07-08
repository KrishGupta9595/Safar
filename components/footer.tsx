import Link from "next/link"
import { MapPin, Mail, Phone, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold">Roam List</span>
            </div>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
              Your ultimate AI-powered travel companion for planning unforgettable adventures. Discover, plan, and
              explore the world with confidence and style.
            </p>
            <div className="flex space-x-6">
              {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:gradient-bg transition-all duration-300 transform hover:scale-110"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current rounded"></div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Dashboard", href: "/dashboard" },
                { name: "Sign Up", href: "/auth" },
                { name: "Profile", href: "/profile" },
                { name: "Help Center", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:gradient-text"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>hello@roamlist.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center space-x-2">
            <span>© 2024 Roam List. Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for travelers everywhere.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
