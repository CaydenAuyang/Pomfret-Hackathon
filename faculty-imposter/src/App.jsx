import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// Faculty images from public folder
const generateImages = () => {
    const baseUrl = import.meta.env.BASE_URL;
    return [
        { id: 1, url: `${baseUrl}images/faculty-1.jpg`, name: 'Dr. Cards' },
        { id: 2, url: `${baseUrl}images/faculty-2.jpg`, name: 'Prof. Puzzle' },
        { id: 3, url: `${baseUrl}images/faculty-3.jpg`, name: 'Gumball Wizard' },
        { id: 4, url: `${baseUrl}images/faculty-4.jpg`, name: 'Monsieur Bread' },
        { id: 5, url: `${baseUrl}images/faculty-5.jpg`, name: 'Fire Chief' },
        { id: 6, url: `${baseUrl}images/faculty-6.jpg`, name: 'Lion Tamer' },
        { id: 7, url: `${baseUrl}images/faculty-7.jpg`, name: 'The Lorax' },
        { id: 8, url: `${baseUrl}images/faculty-8.jpg`, name: 'Pug Chemist' },
    ];
}

// Initial players with Among Us colors
const initialPlayers = [
    { id: 1, name: 'RED', score: 0, color: '#c51111', lightColor: '#ff4444' },
    { id: 2, name: 'BLUE', score: 0, color: '#132ed1', lightColor: '#4466ff' },
    { id: 3, name: 'GREEN', score: 0, color: '#117f2d', lightColor: '#44dd66' },
    { id: 4, name: 'PINK', score: 0, color: '#ed54ba', lightColor: '#ff88dd' },
]

// --- SVG COMPONENTS ---

function CrewmateIcon({ color = '#c51111', size = 40, className = '' }) {
    return (
        <svg width={size} height={size * 1.2} viewBox="0 0 40 48" fill="none" className={className}>
            <g filter="url(#glow)">
                <ellipse cx="20" cy="30" rx="16" ry="18" fill={color} />
                <ellipse cx="20" cy="30" rx="12" ry="14" fill={color} />
                <rect x="6" y="38" width="10" height="10" rx="3" fill={color} />
                <rect x="24" y="38" width="10" height="10" rx="3" fill={color} />
                {/* Backpack */}
                <rect x="0" y="24" width="8" height="16" rx="4" fill={color} />
            </g>
            {/* Visor */}
            <ellipse cx="26" cy="22" rx="10" ry="12" fill="#9dc6e8" stroke="#1d3e5e" strokeWidth="2" />
            <ellipse cx="26" cy="22" rx="8" ry="10" fill="#c5def5" />
            <path d="M22 18C22 18 24 16 28 16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

            <defs>
                <filter id="glow" x="-10" y="-10" width="60" height="68" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
                </filter>
            </defs>
        </svg>
    )
}

function Asteroid({ size = 40, top, left, delay }) {
    return (
        <motion.div
            className="absolute opacity-60 pointer-events-none"
            style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
            animate={{
                x: [0, 100],
                y: [0, 50],
                rotate: [0, 360]
            }}
            transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: delay
            }}
        >
            <svg viewBox="0 0 100 100" fill="#4B5563">
                <path d="M30 10 L70 5 L90 30 L95 60 L70 90 L30 95 L10 70 L5 30 Z" />
            </svg>
        </motion.div>
    )
}

// --- VISUAL COMPONENTS ---

function Starfield() {
    return (
        <div className="starfield">
            <div className="stars-layer" />
            <div className="stars-layer" />
            <Asteroid size={60} top={10} left={10} delay={0} />
            <Asteroid size={40} top={20} left={80} delay={5} />
            <Asteroid size={80} top={70} left={5} delay={2} />
        </div>
    )
}

function ScorePopup({ points, position, color }) {
    return (
        <motion.div
            initial={{ opacity: 1, y: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 0, y: -80, scale: 1.5, rotate: 10 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 text-4xl font-black text-stroke-black"
            style={{
                left: position.x,
                top: position.y,
                color: color,
                textShadow: `0 0 20px ${color}`,
                WebkitTextStroke: '1px black'
            }}
        >
            +{points}
        </motion.div>
    )
}

// --- SCREENS ---

function RouletteScreen({ imagePool, onSpinComplete, allImagesUsed, onEndGame }) {
    const [isSpinning, setIsSpinning] = useState(false)
    const [animationDuration, setAnimationDuration] = useState(20)

    // --- ROULETTE LOGIC ---
    // Start in the middle of a massive duplication to ensure content on both sides
    const sets = 10
    const displayImages = Array(sets).fill(imagePool).flat()

    // Desktop metrics (w-80 = 320px, gap-6 = 24px)
    const CARD_WIDTH = 320
    const GAP = 24
    const STRIDE = CARD_WIDTH + GAP
    const START_INDEX = Math.floor(displayImages.length / 2) // Start in the middle

    // Calculate exact offset to center the target item
    // We want the center of item at START_INDEX to be at x=0 relative to the centered container
    const initialX = -(START_INDEX * STRIDE + (CARD_WIDTH / 2))

    const handleSpin = () => {
        if (imagePool.length === 0) return

        setIsSpinning(true)
        setAnimationDuration(3)

        // Slow down sequence
        setTimeout(() => setAnimationDuration(8), 1000)
        setTimeout(() => setAnimationDuration(15), 2000)

        setTimeout(() => {
            // Pick a winner
            const randomIndex = Math.floor(Math.random() * imagePool.length)
            const selectedImage = imagePool[randomIndex]

            // To land on the specific image, we need to calculate where it is relative to our current drift
            // For simplicity in this version, we just stop and show the result, 
            // but to make it smooth we would snap to the nearest instance of this image.

            setIsSpinning(false)
            setAnimationDuration(20)
            onSpinComplete(selectedImage)
        }, 3500)
    }

    if (allImagesUsed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-[#0d1117] relative overflow-hidden">
                <Starfield />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-16 text-center max-w-2xl relative z-10 border-2 border-[#f5f557] rounded-3xl"
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0d1117] px-6 py-2 rounded-full border border-[#f5f557]">
                        <span className="text-4xl">👑</span>
                    </div>
                    <h1 className="title-font text-6xl text-[#f5f557] mb-6 drop-shadow-lg">
                        GAME OVER
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 font-outfit uppercase tracking-widest">
                        All imposters have been revealed
                    </p>
                    <motion.button
                        onClick={onEndGame}
                        className="au-button au-button-shiny-red text-2xl px-16 py-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        SEE RESULTS
                    </motion.button>
                </motion.div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col bg-[#0d1117] overflow-hidden"
        >
            <Starfield />

            {/* PROFESSIONAL TITLE */}
            <div className="relative z-10 pt-16 pb-8 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                    <CrewmateIcon color="#c51111" size={40} className="transform -rotate-12" />
                    <motion.h1
                        className="title-font text-7xl text-white tracking-wider drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        FACULTY IMPOSTER
                    </motion.h1>
                    <CrewmateIcon color="#38fedc" size={40} className="transform rotate-12" />
                </div>
                <div className="h-1 w-64 bg-gradient-to-r from-transparent via-[#38fedc] to-transparent opacity-50"></div>
            </div>

            {/* ROULETTE STRIP */}
            <div className="relative z-10 flex-1 flex flex-col justify-center -mt-20 overflow-hidden">
                <div className="w-full h-80 bg-black/40 border-y-4 border-[#30363d] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm relative flex items-center justify-center group">

                    {/* Center Highlight Marker (Fixed in center of screen) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#38fedc] z-30 shadow-[0_0_15px_#38fedc] -translate-x-1/2"></div>
                    <div className="absolute left-1/2 top-4 -translate-x-1/2 text-[#38fedc] text-2xl z-30">▼</div>
                    <div className="absolute left-1/2 bottom-4 -translate-x-1/2 text-[#38fedc] text-2xl z-30">▲</div>

                    {/* Moving Strip Container - Absolute Positioned to Center */}
                    <div className="absolute left-1/2 h-60 flex items-center">
                        <motion.div
                            className="flex gap-6"
                            initial={{ x: initialX }}
                            animate={isSpinning ? { x: [initialX, initialX - 5000] } : { x: initialX }}
                            transition={{
                                duration: animationDuration,
                                ease: 'linear',
                                repeat: isSpinning ? Infinity : 0,
                            }}
                        >
                            {displayImages.map((image, index) => (
                                <div key={`${image.id}-${index}`} className="flex-shrink-0 w-80 h-60 bg-[#161b22] border-2 border-[#30363d] rounded-xl overflow-hidden shadow-xl relative">
                                    <img src={image.url} alt={image.name} className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-center font-bangers text-gray-300 tracking-wider">
                                        {image.name}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* SPIN BUTTON */}
                <div className="mt-12 flex justify-center">
                    <motion.button
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className={`au-button-3d-red ${isSpinning ? 'opacity-80 grayscale' : ''}`}
                        whileHover={!isSpinning ? { scale: 1.05, translateY: -5 } : {}}
                        whileTap={!isSpinning ? { scale: 0.95, translateY: 5 } : {}}
                    >
                        <span className="relative z-10 drop-shadow-md">
                            {isSpinning ? 'SCANNING...' : 'SPIN ROULETTE'}
                        </span>
                    </motion.button>
                </div>
            </div>

            {/* Footer Info */}
            <div className="fixed bottom-6 right-6 z-20">
                <div className="glass-panel px-6 py-2 rounded-full flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-outfit text-sm text-[#38fedc] tracking-widest uppercase">
                        Systems Online • {imagePool.length} Remaining
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

function PlayerRow({ player, onScore }) {
    const [popups, setPopups] = useState([]);
    const controlsRef = useRef(null);

    const handleScore = (points, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const colorMap = { 2: '#38fedc', 3: '#ed54ba', 5: '#50ef39' };

        const newPopup = {
            id: Date.now(),
            points,
            position: { x: rect.left + rect.width / 2 - 20, y: rect.top - 20 },
            color: colorMap[points]
        };
        setPopups(prev => [...prev, newPopup]);
        onScore(player.id, points);

        setTimeout(() => setPopups(prev => prev.filter(p => p.id !== newPopup.id)), 1000);
    };

    return (
        <div className="relative group">
            {popups.map(popup => <ScorePopup key={popup.id} {...popup} />)}

            <div className="glass-panel p-4 flex items-center justify-between transition-all hover:bg-[#1f2937]/50 hover:border-[#58a6ff]/50 hover:shadow-[0_0_20px_rgba(88,166,255,0.2)] mb-3">
                {/* Player Profile */}
                <div className="flex items-center gap-4 w-1/4">
                    <div className="relative">
                        <CrewmateIcon color={player.color} size={48} />
                        <div className="absolute -bottom-1 -right-1 bg-gray-900 text-xs font-bold px-1.5 rounded border border-gray-600">
                            Lvl.1
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bangers text-2xl tracking-wide" style={{ color: player.lightColor }}>
                            {player.name}
                        </h3>
                        <div className="text-xs text-gray-400 font-outfit uppercase tracking-wider">Crewmate</div>
                    </div>
                </div>

                {/* Score Big Display */}
                <div className="flex-1 text-center">
                    <div className="font-bangers text-5xl text-white drop-shadow-md">
                        {player.score}
                    </div>
                    <div className="text-[10px] text-gray-500 font-outfit uppercase tracking-[0.2em]">Current Score</div>
                </div>

                {/* Action Buttons - Horizontal Bar */}
                <div className="flex items-center gap-3" ref={controlsRef}>
                    <button onClick={(e) => handleScore(2, e)} className="au-action-btn au-btn-cyan group/btn">
                        <div className="icon">🎯</div>
                        <div className="content">
                            <span className="val">+2</span>
                            <span className="lbl">Caught</span>
                        </div>
                    </button>
                    <button onClick={(e) => handleScore(3, e)} className="au-action-btn au-btn-pink group/btn">
                        <div className="icon">🔄</div>
                        <div className="content">
                            <span className="val">+3</span>
                            <span className="lbl">Redeem</span>
                        </div>
                    </button>
                    <button onClick={(e) => handleScore(5, e)} className="au-action-btn au-btn-lime group/btn">
                        <div className="icon">🛡️</div>
                        <div className="content">
                            <span className="val">+5</span>
                            <span className="lbl">Alive</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

function GameScreen({ selectedImage, players, onScore, onNextImage, onEndGame, imagePool }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen flex flex-col bg-[#0d1117] overflow-hidden"
        >
            <Starfield />

            {/* Header Bar */}
            <header className="h-16 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d] flex items-center justify-between px-8 z-30 shadow-lg">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <span className="font-bangers text-xl text-gray-200 tracking-wider">FACULTY IMPOSTER</span>
                </div>

                <span className="font-outfit text-sm text-gray-400 uppercase tracking-widest">
                    Round {9 - imagePool.length} / 8
                </span>

                <button onClick={onEndGame} className="text-red-500 hover:text-red-400 font-bold text-sm tracking-wider uppercase transition-colors">
                    End Game
                </button>
            </header>

            {/* Main Content - Split Layout */}
            <main className="flex-1 flex p-8 gap-8 overflow-hidden z-20">
                {/* LEFT: Mystery Image */}
                <div className="w-[40%] flex flex-col h-full">
                    <div className="flex-1 bg-[#161b22] rounded-2xl border-4 border-[#30363d] p-2 shadow-2xl relative group overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#38fedc] z-10 shadow-[0_0_20px_#38fedc]"></div>
                        <img src={selectedImage.url} alt={selectedImage.name} className="w-full h-full object-cover rounded-xl" />

                        {/* Overlay Label */}
                        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md px-6 py-3 rounded-lg border-l-4 border-[#38fedc]">
                            <h2 className="font-bangers text-4xl text-white tracking-wide">
                                {selectedImage.name}
                            </h2>
                            <div className="text-[#38fedc] text-xs font-bold uppercase tracking-widest">
                                Target Verified
                            </div>
                        </div>
                    </div>

                    {/* Next Button */}
                    <motion.button
                        onClick={onNextImage}
                        className="mt-6 au-button-shiny-purple w-full py-5 text-xl flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>{imagePool.length > 0 ? 'NEXT ASSIGNMENT' : 'FINALIZE MISSION'}</span>
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </motion.button>
                </div>

                {/* RIGHT: Player Stats (Vertical List) */}
                <div className="w-[60%] flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-outfit font-bold text-gray-400 uppercase tracking-widest text-sm">Active Crew</h3>
                        <div className="h-px flex-1 bg-gray-700 ml-4"></div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {players.map(player => (
                            <PlayerRow key={player.id} player={player} onScore={onScore} />
                        ))}
                    </div>
                </div>
            </main>
        </motion.div>
    )
}

function VictoryScreen({ players, onRestart }) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    const winner = sortedPlayers[0]

    useEffect(() => {
        const end = Date.now() + 3000
        const colors = ['#c51111', '#132ed1', '#117f2d', '#ed54ba', '#f5f557', '#38fedc']
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
            if (Date.now() < end) requestAnimationFrame(frame)
        }
        frame()
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] p-8 overflow-y-auto"
        >
            <Starfield />

            <div className="z-10 w-full max-w-4xl relative">
                {/* Winner Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-b from-[#facc15]/10 to-transparent border border-[#facc15]/50 rounded-3xl p-10 text-center mb-10 backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="relative z-10">
                        <CrewmateIcon color={winner.color} size={100} className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]" />
                        <h1 className="font-bangers text-7xl text-[#facc15] mb-2 drop-shadow-md tracking-wider">VICTORY</h1>
                        <h2 className="font-outfit text-3xl text-white mb-6 uppercase tracking-widest font-bold">
                            {winner.name} Dominates
                        </h2>
                        <div className="inline-block bg-[#facc15] text-black font-bangers text-5xl px-8 py-2 rounded-lg transform -rotate-2 shadow-lg">
                            {winner.score} PTS
                        </div>
                    </div>
                </motion.div>

                {/* Table */}
                <div className="bg-[#161b22]/80 rounded-2xl border border-[#30363d] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#21262d] text-gray-400 font-outfit text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-4 pl-8">Rank</th>
                                <th className="p-4">Crewmate</th>
                                <th className="p-4 text-right pr-8">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player, idx) => (
                                <tr key={player.id} className="border-b border-[#30363d] last:border-0 hover:bg-[#30363d]/30 transition-colors">
                                    <td className="p-4 pl-8 font-bangers text-2xl text-gray-500">#{idx + 1}</td>
                                    <td className="p-4 flex items-center gap-3">
                                        <CrewmateIcon color={player.color} size={24} />
                                        <span className="font-bold text-lg">{player.name}</span>
                                    </td>
                                    <td className="p-4 pr-8 text-right font-bangers text-2xl text-[#38fedc]">{player.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-10 text-center">
                    <button onClick={onRestart} className="text-[#38fedc] hover:text-white font-bold tracking-widest uppercase transition-colors text-sm">
                        Initialize New Game Setup
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

function App() {
    const [currentScreen, setCurrentScreen] = useState('roulette')
    const [imagePool, setImagePool] = useState(generateImages())
    const [selectedImage, setSelectedImage] = useState(null)
    const [players, setPlayers] = useState(initialPlayers)

    const handleSpinComplete = (image) => {
        setSelectedImage(image)
        setImagePool(prev => prev.filter(img => img.id !== image.id))
        setCurrentScreen('game')
    }

    const handleScore = (playerId, points) => {
        setPlayers(prev => prev.map(p =>
            p.id === playerId ? { ...p, score: p.score + points } : p
        ))
    }

    const handleEndGame = () => setCurrentScreen('victory')

    const handleRestart = () => {
        setImagePool(generateImages())
        setPlayers(initialPlayers.map(p => ({ ...p, score: 0 })))
        setCurrentScreen('roulette')
    }

    return (
        <div className="font-outfit text-white selection:bg-[#38fedc] selection:text-black">
            <AnimatePresence mode="wait">
                {currentScreen === 'roulette' && (
                    <RouletteScreen
                        key="roulette"
                        imagePool={imagePool}
                        onSpinComplete={handleSpinComplete}
                        allImagesUsed={imagePool.length === 0}
                        onEndGame={handleEndGame}
                    />
                )}
                {currentScreen === 'game' && selectedImage && (
                    <GameScreen
                        key="game"
                        selectedImage={selectedImage}
                        players={players}
                        onScore={handleScore}
                        onNextImage={() => imagePool.length === 0 ? setCurrentScreen('victory') : setCurrentScreen('roulette')}
                        onEndGame={handleEndGame}
                        imagePool={imagePool}
                    />
                )}
                {currentScreen === 'victory' && (
                    <VictoryScreen
                        key="victory"
                        players={players}
                        onRestart={handleRestart}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
