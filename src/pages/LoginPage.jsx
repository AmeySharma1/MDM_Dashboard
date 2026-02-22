import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiShield, FiArrowRight, FiActivity, FiCpu, FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';

// Lazy load the background animation for smooth entry
const FloatingLines = React.lazy(() => import('../components/ui/FloatingLines/FloatingLines'));

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Dramatic pause for the "system scanning" effect
        setTimeout(() => {
            const result = login(username, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                setIsSubmitting(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#050508] relative overflow-hidden text-gray-900 dark:text-white selection:bg-primary-500/30 p-10 transition-colors duration-500">
            {/* 10/10 Background: Animated Neural Grid */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="w-full h-full bg-white dark:bg-[#050508]" />}>
                    <div className="absolute inset-0 opacity-10 dark:opacity-40">
                        <FloatingLines
                            enabledWaves={["top", "middle", "bottom"]}
                            lineCount={12}
                            lineDistance={3}
                            bendRadius={5}
                            bendStrength={-0.4}
                            interactive={true}
                            parallax={true}
                        />
                    </div>
                </Suspense>

                {/* Deep Atmosphere Overlays */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-primary-600/10 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/10 via-transparent to-[#050508] pointer-events-none"></div>
            </div>

            {/* Top Navigation / Controls */}
            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 p-4 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-xl" />
            </div>

            <div className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center">
                {/* Futuristic Brand Identity */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="inline-flex relative mb-8 group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-blue-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                        <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-primary-400 p-[1px] shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                            <div className="w-full h-full bg-white dark:bg-[#0a0a0f] rounded-[2.4rem] flex items-center justify-center">
                                <FiShield className="w-11 h-11 text-primary-500 transform group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter italic mb-4 text-gray-900 dark:text-white">
                        MDM <span className="text-gradient">NETWORK</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary-500/50"></div>
                        <p className="text-primary-600 dark:text-primary-500/80 font-black uppercase tracking-[0.5em] text-[10px]">Administrative Access Protocol</p>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary-500/50"></div>
                    </div>
                </div>

                {/* The "Crazy Beautiful" Card */}
                <div className="w-full relative group">
                    {/* External Card Border Glow */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-primary-500/50 via-blue-500/20 to-primary-500/50 rounded-[3rem] blur-md opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-700"></div>

                    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden">
                        {/* Dynamic Card Internal Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        {/* Credential Hint: High Fidelity Edition - MOVED TO TOP */}
                        <div className="mb-10 pb-8 border-b border-black/10 dark:border-white/5 relative">
                            <p className="text-[10px] font-black text-primary-600 dark:text-primary-500/60 uppercase tracking-[0.4em] mb-6 text-center italic">Administrative Passwords</p>

                            <div className="grid grid-cols-2 gap-4 px-2">
                                <div className="p-4 bg-black/[0.04] dark:bg-white/[0.02] rounded-2xl border border-black/10 dark:border-white/5 group/hint hover:border-primary-500/20 transition-all duration-500 text-center">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 opacity-100 dark:opacity-60">Username</p>
                                    <p className="text-xs font-black text-primary-600 dark:text-primary-500 tracking-wider group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Admin</p>
                                </div>
                                <div className="p-4 bg-black/[0.04] dark:bg-white/[0.02] rounded-2xl border border-black/10 dark:border-white/5 group/hint hover:border-primary-500/20 transition-all duration-500 text-center">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 opacity-100 dark:opacity-60">Password</p>
                                    <p className="text-xs font-black text-primary-600 dark:text-primary-500 tracking-wider group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Admin123</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            {error && (
                                <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl animate-in shake duration-500 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="relative group/input">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary-500 transition-colors duration-300">
                                        <FiUser className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Username (Admin)"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-16 pr-8 py-6 bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 focus:border-primary-500/40 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-8 focus:ring-primary-500/5 group-hover/input:bg-black/[0.04] dark:group-hover/input:bg-white/[0.05] font-black tracking-widest text-xs"
                                        required
                                        autoComplete="off"
                                    />
                                    <div className="absolute top-0 right-6 h-full flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500/20 group-focus-within/input:bg-primary-500 group-focus-within/input:shadow-[0_0_10px_rgba(59,130,246,1)] transition-all duration-500"></div>
                                    </div>
                                </div>

                                <div className="relative group/input">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary-500 transition-colors duration-300">
                                        <FiLock className="w-5 h-5" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password (Admin123)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-16 pr-14 py-6 bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 focus:border-primary-500/40 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-8 focus:ring-primary-500/5 group-hover/input:bg-black/[0.04] dark:group-hover/input:bg-white/[0.05] font-black tracking-widest text-xs"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="relative group/btn">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-400 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition-opacity duration-500"></div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative w-full py-6 rounded-2xl bg-white dark:bg-[#0a0a0f] border border-primary-500/30 text-gray-900 dark:text-white font-black uppercase tracking-[0.4em] text-xs transition-all hover:bg-primary-500/10 flex items-center justify-center gap-4 group-hover/btn:border-primary-500/60 shadow-xl"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiActivity className="animate-spin w-5 h-5 text-primary-500" />
                                            SYSTEM HANDSHAKE...
                                        </>
                                    ) : (
                                        <>
                                            <span className="group-hover:translate-x-1 transition-transform duration-500 flex items-center gap-4">
                                                Initialize Terminal
                                                <FiArrowRight className="w-5 h-5 text-primary-500" />
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>

            <style jsx="true">{`
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
        </div>
    );
};

export default LoginPage;
