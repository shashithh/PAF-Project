import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Monitor, 
  Clock, 
  CheckCircle2, 
  Smartphone,
  Cpu,
  Zap,
  UserCheck
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
            <Cpu className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SmartCampus
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-8 uppercase tracking-wider">
          <Zap size={14} />
          Revolutionizing Campus Management
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
          <span className="block text-white">Smart Campus</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Operations Hub
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
          Integrated ecosystem for facility management, resource booking, and maintenance tracking.
          Simplify campus operations with data-driven workflows.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl text-lg font-bold hover:scale-[1.02] transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2">
              Access Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl text-lg font-bold hover:scale-[1.02] transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-white rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Dashboard Preview Overlay */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 h-full"></div>
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              <div className="h-4 w-32 bg-slate-800 rounded-md ml-2"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-64 bg-slate-800/50 rounded-2xl animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-20 bg-slate-800/50 rounded-2xl animate-pulse"></div>
                <div className="h-40 bg-slate-800/50 rounded-2xl animate-pulse delay-75"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Ecosystem</h2>
          <p className="text-slate-400">Everything you need to manage your campus efficiently.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Calendar, title: 'Resource Booking', desc: 'Book lecture halls, labs, and equipment with real-time availability.', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
            { icon: Wrench, title: 'Maintenance Hub', desc: 'Report issues and track repairs with real-time status updates.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { icon: ShieldCheck, title: 'Approval Workflows', desc: 'Multi-level approval system for facility requests.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { icon: Smartphone, title: 'Cross-Device', desc: 'Fully responsive experience across desktop, tablet, and mobile.', color: 'text-purple-400', bg: 'bg-purple-400/10' },
          ].map((feat, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 hover:border-slate-700 hover:bg-slate-900/80 transition-all group">
              <div className={`p-3 w-fit rounded-2xl ${feat.bg} ${feat.color} mb-6 group-hover:scale-110 transition-transform`}>
                <feat.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="relative z-10 py-24 px-6 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Designed for every <br />
                <span className="text-cyan-400 underline decoration-cyan-400/20 underline-offset-8">Campus Role</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Users, role: 'Students & Staff', task: 'Book resources and report maintenance issues easily.' },
                  { icon: ShieldCheck, role: 'Administrators', task: 'Manage resources, approve bookings, and monitor analytics.' },
                  { icon: UserCheck, role: 'Technicians', task: 'View assigned tickets and update resolution progress.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-800/40 transition-colors">
                    <div className="p-3 bg-slate-800 rounded-xl text-cyan-400 h-fit">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.role}</h4>
                      <p className="text-slate-400 text-sm">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 rounded-3xl border border-cyan-500/20 h-48 flex items-end">
                  <div className="text-3xl font-bold text-white">99%</div>
                </div>
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 h-64 flex items-end">
                  <p className="text-slate-300 text-sm">Uptime for critical campus operations tracking.</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 h-64 flex items-end">
                  <p className="text-slate-300 text-sm">Automated scheduling for facilities.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-3xl border border-purple-500/20 h-48 flex items-end">
                  <div className="text-3xl font-bold text-white">10x</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 border border-white/5 rounded-[40px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.15),transparent_70%)]"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">
            Ready to streamline your campus?
          </h2>
          <p className="text-slate-400 text-lg mb-10 relative z-10 max-w-xl mx-auto">
            Join thousands of users who are already using Smart Campus Hub to manage their daily activities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-10 py-4 bg-white text-slate-950 rounded-2xl text-lg font-bold hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2">
                Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="px-10 py-4 bg-white text-slate-950 rounded-2xl text-lg font-bold hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2">
                  Create Account <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="px-10 py-4 bg-slate-900 border border-slate-700 text-white rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2.5 opacity-60">
            <Cpu size={20} />
            <span className="text-lg font-bold">SmartCampus</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Smart Campus Operations Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
