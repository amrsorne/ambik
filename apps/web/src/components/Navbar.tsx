import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ms' : 'en'
    void i18n.changeLanguage(newLang)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none fixed w-full bottom-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight text-[var(--color-brand-strong)]">
              Ambik!
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-gray-900">
              {t('about')}
            </a>
            <a href="#profile" className="text-gray-600 hover:text-gray-900">
              &copy; {new Date().getFullYear()}
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div
              className="relative inline-flex items-center cursor-pointer"
              onClick={toggleLanguage}
            >
              <input type="checkbox" className="sr-only" readOnly />
              <div className="w-14 h-8 bg-gray-200 rounded-full shadow-inner"></div>
              <div
                className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${i18n.language === 'ms' ? 'transform translate-x-6' : ''}`}
              >
                <span className="pt-1 absolute left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                  {i18n.language === 'ms' ? 'MY' : 'EN'}
                </span>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div
              className="relative inline-flex items-center cursor-pointer top-1"
              onClick={toggleLanguage}
            >
              <input type="checkbox" className="sr-only" readOnly />
              <div
                className={`w-14 h-8 rounded-full shadow-inner ${i18n.language === 'ms' ? 'bg-pink-400' : 'bg-gray-200'}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ${i18n.language === 'ms' ? 'transform translate-x-6' : ''}`}
              >
                <span className="pt-1 absolute left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                  {i18n.language === 'ms' ? 'MY' : 'EN'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xs rounded-b-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#benefits"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                {t('about')}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
