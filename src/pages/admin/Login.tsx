import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

export default function Login() {
  return (
    <div className="min-h-screen bg-brand-gray flex flex-col justify-center items-center p-4">
      <Link to="/" className="mb-10 hover:opacity-90 transition-opacity">
        <img src={logoLasmoras} alt="Résidence Las Moras" className="h-24 w-auto rounded-xl shadow-md" />
      </Link>
      
      <div className="bg-white w-full max-w-md p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-brand-red rounded-full mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Espace Admin</h1>
          <p className="text-gray-500 mt-2 font-medium">Connexion requise pour gérer la plateforme.</p>
        </div>

        <form className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Adresse Email</label>
            <input 
              type="email" 
              placeholder="admin@residencelasmoras.com" 
              className="w-full rounded-xl border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all font-medium text-gray-800" 
              required 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Mot de passe</label>
              <a href="#" className="text-xs font-bold text-brand-red hover:underline">Oublié ?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full rounded-xl border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all font-medium text-gray-800" 
              required 
            />
          </div>
          
          <Link to="/admin/dashboard" className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg mt-2 hover:bg-red-700 hover:shadow-[0_8px_20px_rgba(213,0,0,0.3)] transition-all duration-300 active:scale-95 text-center">
            Se Connecter
          </Link>
        </form>
      </div>
    </div>
  );
}
