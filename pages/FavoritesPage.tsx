
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Users, Signal } from 'lucide-react';
import { db } from '../services/mockDb';
import { User, Server } from '../types';

interface FavoritesPageProps {
  user: User | null;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-4 rounded-full bg-slate-900 mb-6">
          <Heart className="w-12 h-12 text-slate-700" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Please login to view favorites</h2>
        <Link to="/login" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all inline-block shadow-lg">
          Sign In
        </Link>
      </div>
    );
  }

  const favorites = db.getFavorites(user.id);
  const allServers = db.getServers();
  const favoriteServers = allServers.filter(s => favorites.some(f => f.serverId === s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-rose-500/10 rounded-xl">
          <Heart className="w-8 h-8 text-rose-500 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Your Favorites</h1>
          <p className="text-slate-500">Quick access to servers you love.</p>
        </div>
      </div>

      {favoriteServers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteServers.map(server => (
            <Link to={`/server/${server.id}`} key={server.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-rose-500/50 transition-all flex flex-col shadow-xl">
              <div className="h-40 overflow-hidden relative">
                <img src={server.images[0]} alt={server.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 p-2 rounded-full bg-rose-500 text-white">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors mb-2">{server.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{server.shortDescription}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                   <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                          <Signal className="w-3 h-3" />
                          <span>{server.currentPlayers}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                          <Users className="w-3 h-3" />
                          <span>{server.maxPlayers}</span>
                        </div>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
           <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
           <p className="text-slate-500 text-lg">You haven't added any favorites yet.</p>
           <Link to="/" className="text-indigo-400 font-bold hover:text-indigo-300 mt-2 inline-block">Explore the catalog</Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
