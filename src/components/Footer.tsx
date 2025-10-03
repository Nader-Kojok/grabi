import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo_white.svg" alt="Grabi" className="h-8 w-auto" />
            </div>
            <p className="text-gray-300 text-sm text-left">
              La plateforme de petites annonces #1 au Sénégal. Achetez, vendez et trouvez tout ce dont vous avez besoin.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Catégories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Véhicules</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Immobilier</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Électronique</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mode & Beauté</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Emploi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/publier" className="text-gray-300 hover:text-white transition-colors">Publier une annonce</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Promouvoir mon annonce</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Boutique professionnelle</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Grabi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Signaler un problème</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-300">+221 33 123 45 67</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-300">contact@grabi.sn</span>
              </div>
              <div className="flex items-start justify-center space-x-2">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <span className="text-gray-300">
                  Dakar, Sénégal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              <div>© 2024 Grabi. Tous droits réservés.</div>
              <div>
                Developed with ❤️ by{' '}
                <a 
                  href="https://www.agencearcane.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Agence Arcane
                </a>
              </div>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;