import React, { useState, useEffect } from 'react';
import { Youtube, FileText, Bookmark, ExternalLink, Search, X, PlayCircle, Layers, ArrowRight } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { searchVideos, searchArticles } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

// Flashcard Data Store
const FLASHCARD_DATA = {
  "Data Structures and Algorithms": [
    { front: "Big O Notation", back: "Describes the worst-case scenario for the execution time or space used by an algorithm." },
    { front: "Stack vs Queue", back: "Stack is LIFO (Last In First Out). Queue is FIFO (First In First Out)." },
    { front: "Binary Search Tree", back: "A tree where left child < parent < right child for all nodes." },
    { front: "Hash Map", back: "Data structure mapping keys to values using a hash function for O(1) average access." },
    { front: "Recursion", back: "A method where the solution depends on solutions to smaller instances of the same problem." },
    { front: "Graph BFS", back: "Breadth-First Search: Explores neighbor nodes first before moving to next level neighbors." }
  ],
  "Operating Systems": [
    { front: "Kernel", back: "The core component of an OS that manages system resources and hardware." },
    { front: "Process vs Thread", back: "Process is an executing program (heavyweight). Thread is a unit of execution within a process (lightweight)." },
    { front: "Deadlock", back: "A state where processes are blocked because each is holding a resource and waiting for another." },
    { front: "Virtual Memory", back: "Memory management technique that creates an illusion of a large main memory." },
    { front: "Semaphore", back: "A variable used to control access to a common resource by multiple processes." },
    { front: "Context Switch", back: "Storing the state of a process so that it can be reloaded when required." }
  ],
  "Database Management Systems": [
    { front: "ACID Properties", back: "Atomicity, Consistency, Isolation, Durability - properties ensuring reliable transactions." },
    { front: "Normalization", back: "Process of organizing data to reduce redundancy and improve data integrity." },
    { front: "Primary Key", back: "A unique identifier for a record in a database table." },
    { front: "SQL vs NoSQL", back: "SQL is relational/structured (tables). NoSQL is non-relational (documents, key-pairs)." },
    { front: "Index", back: "Data structure that improves the speed of data retrieval operations on a table." },
    { front: "Join", back: "SQL operation to combine rows from two or more tables based on a related column." }
  ],
  "Computer Networks": [
    { front: "OSI Model", back: "7 Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application." },
    { front: "TCP vs UDP", back: "TCP is connection-oriented and reliable. UDP is connectionless and faster but unreliable." },
    { front: "IP Address", back: "Unique numerical label assigned to each device connected to a computer network." },
    { front: "DNS", back: "Domain Name System: Translates human-readable domain names to IP addresses." },
    { front: "HTTP/HTTPS", back: "Hypertext Transfer Protocol (Secure). Foundation of data communication for the WWW." },
    { front: "Router", back: "Device that forwards data packets between computer networks." }
  ],
  "Computer Organization and Architecture": [
    { front: "Instruction Cycle", back: "The cycle that a CPU follows to execute a single machine code instruction: Fetch, Decode, Execute, and Store." },
    { front: "Memory Hierarchy", back: "Organization of memory in a computer system, typically including registers, cache, RAM, and disk storage." },
    { front: "Pipelining", back: "Technique where multiple instruction phases are overlapped to improve performance." },
    { front: "RISC vs CISC", back: "Reduced Instruction Set Computing (RISC) uses a small, highly optimized instruction set. Complex Instruction Set Computing (CISC) uses a larger set of instructions." }
  ],
  "System Design (LLD + HLD)": [
    { front: "Scalability", back: "Capability of a system to handle a growing amount of work by adding resources." },
    { front: "Load Balancer", back: "Distributes network traffic across multiple servers to ensure reliability." },
    { front: "Caching", back: "Storing copies of data in a temporary storage location for faster access." },
    { front: "Microservices", back: "Architectural style structuring an app as a collection of loosely coupled services." },
    { front: "CAP Theorem", back: "A distributed system can only provide two of three: Consistency, Availability, Partition Tolerance." },
    { front: "Sharding", back: "Splitting a large database into smaller, faster, more easily managed parts." }
  ],
  "MERN Stack": [
    { front: "React Virtual DOM", back: "A lightweight copy of the DOM. React compares it with real DOM to update only changed parts." },
    { front: "Node.js Event Loop", back: "Mechanism that allows Node.js to perform non-blocking I/O operations." },
    { front: "MongoDB Document", back: "A record in MongoDB, similar to a JSON object." },
    { front: "Express Middleware", back: "Functions that have access to the request, response, and next function in the cycle." },
    { front: "React Hooks", back: "Functions that let you use state and other React features without writing a class." },
    { front: "JSX", back: "Syntax extension for JavaScript used with React to describe what the UI should look like." }
  ],
  "Machine Learning Basics": [
    { front: "Supervised Learning", back: "Learning where the model is trained on labeled data (input-output pairs)." },
    { front: "Overfitting", back: "When a model learns the training data too well, including noise, and performs poorly on new data." },
    { front: "Regression vs Classification", back: "Regression predicts continuous values. Classification predicts categorical labels." },
    { front: "Gradient Descent", back: "Optimization algorithm used to minimize the loss function by iteratively moving towards the minimum." },
    { front: "Neural Network", back: "Computing system inspired by biological neural networks, consisting of layers of nodes." },
    { front: "Bias-Variance Tradeoff", back: "Balancing error from erroneous assumptions (bias) vs error from sensitivity to small fluctuations (variance)." }
  ]
};

// Tips Data Store
const TIPS_DATA = {
  "Data Structures and Algorithms": [
    "Always analyze Time and Space Complexity (Big O) before coding.",
    "Master recursion; it's the foundation for trees and graphs.",
    "Practice identifying patterns like Two Pointers, Sliding Window, and DFS/BFS.",
    "Dry run your code on paper with edge cases before typing."
  ],
  "Operating Systems": [
    "Understand the difference between Process and Thread deeply.",
    "Visualize scheduling algorithms (FCFS, Round Robin) with Gantt charts.",
    "Focus on synchronization primitives like Semaphores and Mutexes.",
    "Don't just memorize deadlock conditions; understand how to prevent them."
  ],
  "Database Management Systems": [
    "Master SQL joins and subqueries; they are interview favorites.",
    "Understand Normalization (1NF to BCNF) to design efficient schemas.",
    "Learn indexing strategies to optimize query performance.",
    "Know the trade-offs between SQL (ACID) and NoSQL (BASE)."
  ],
  "Computer Networks": [
    "Memorize the OSI 7-layer model and protocols at each layer.",
    "Understand the TCP 3-way handshake and connection teardown.",
    "Learn how DNS resolution works step-by-step.",
    "Practice subnetting calculations until they become second nature."
  ],
  "Computer Organization and Architecture": [
    "Trace the instruction cycle: Fetch, Decode, Execute, Store.",
    "Understand memory hierarchy and cache mapping techniques.",
    "Learn how pipelining improves throughput and its hazards.",
    "Differentiate between RISC and CISC architectures."
  ],
  "System Design (LLD + HLD)": [
    "Start with requirements gathering (Functional & Non-Functional).",
    "Think about Scalability, Availability, and Reliability trade-offs.",
    "Learn standard components: Load Balancers, Caching, Message Queues.",
    "Practice back-of-the-envelope calculations for storage and bandwidth."
  ],
  "MERN Stack": [
    "Understand the React Component Lifecycle and Hooks thoroughly.",
    "Learn how to structure a scalable Node.js/Express backend.",
    "Master asynchronous programming (Promises, async/await) in JS.",
    "Practice connecting frontend and backend with REST APIs or GraphQL."
  ],
  "Machine Learning Basics": [
    "Understand the bias-variance tradeoff intuitively.",
    "Clean and preprocess your data; it's 80% of the work.",
    "Learn evaluation metrics (Precision, Recall, F1-Score) beyond Accuracy.",
    "Start with simple models (Linear Regression) before complex ones."
  ],
  "Deep Learning Basics": [
    "Grasp the concept of Backpropagation and Gradient Descent.",
    "Understand activation functions (ReLU, Sigmoid) and when to use them.",
    "Learn to prevent overfitting using Dropout and Regularization.",
    "Visualize CNN architectures for image tasks and RNNs for sequences."
  ]
};

const FlipCard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-64 w-full perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div 
          className="absolute w-full h-full bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center p-8 text-center hover:shadow-xl transition-all group-hover:-translate-y-1"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
            <Layers size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{front}</h3>
          <p className="absolute bottom-6 text-xs text-indigo-500 font-bold uppercase tracking-wider flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            Click to Reveal
          </p>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center border border-indigo-400"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <p className="text-white font-medium text-lg leading-relaxed drop-shadow-md">{back}</p>
          <div className="absolute bottom-6 w-8 h-1 bg-white/30 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};

export const Resources = () => {
  const { saveResource, savedResources, currentSession } = useLearning();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'video', 'article', 'flashcards'
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'video', title: 'Video Lectures', icon: Youtube, color: 'text-red-600 bg-red-100', action: 'Watch' },
    { id: 'article', title: 'Articles & Blogs', icon: FileText, color: 'text-blue-600 bg-blue-100', action: 'Read' },
    { id: 'flashcards', title: 'Flashcards', subtitle: 'Quick memory boosters', icon: Layers, color: 'text-yellow-600 bg-yellow-100', action: 'Review' },
  ];

  // Core Placement Topics List
  const placementTopics = [
    "Data Structures and Algorithms",
    "Operating Systems",
    "Database Management Systems",
    "Computer Networks",
    "Computer Organization and Architecture",
    "System Design (LLD + HLD)",
    "MERN Stack",
    "Machine Learning Basics",
    "Deep Learning Basics"
  ];

  // Initialize search query from session
  useEffect(() => {
    if (currentSession.topic && placementTopics.includes(currentSession.topic)) {
      setSearchQuery(currentSession.topic);
    } else {
      setSearchQuery(placementTopics[0]);
    }
  }, [currentSession.topic]);

  const handleOpenModal = async (type) => {
    setModalType(type);
    setShowModal(true);
    setVideos([]);
    setArticles([]);
    
    // Auto-fetch based on type using global searchQuery
    if (type === 'video') {
      await handleSearchVideos(searchQuery);
    } else if (type === 'article') {
      await handleSearchArticles(searchQuery);
    }
    // Flashcards use local data based on searchQuery state
  };

  const handleSearchVideos = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const searchTerm = `${query} full course tutorial`;
      const res = await searchVideos(searchTerm);
      if (res.data.success) {
        setVideos(res.data.videos.slice(0, 5));
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSearchArticles = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await searchArticles(query);
      if (res.data.success) {
        setArticles(res.data.articles);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Wrapper for manual search button click
  const handleManualSearch = () => {
    if (modalType === 'video') handleSearchVideos(searchQuery);
    if (modalType === 'article') handleSearchArticles(searchQuery);
  };

  const currentFlashcards = FLASHCARD_DATA[searchQuery] || [
    { front: "Select a Topic", back: "Please select a valid placement topic from the dropdown to see specific flashcards." }
  ];

  const currentTips = TIPS_DATA[searchQuery] || [
    "Select a topic to see specific tips and tricks.",
    "Consistency is key in learning any new technology."
  ];

  return (
    <div className="space-y-8 relative pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
          <p className="text-gray-500">Curated materials to deepen your understanding.</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
          <Bookmark size={18} className="text-indigo-600" />
          <span className="font-bold">{savedResources.length} Saved</span>
        </div>
      </div>

      {/* Global Topic Selector */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <label className="block text-xs font-extrabold text-gray-500 mb-2 uppercase tracking-wider">
          Select Topic for All Resources
        </label>
        <div className="relative">
          <select 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none bg-white font-semibold text-gray-700 appearance-none transition-all cursor-pointer hover:border-indigo-300"
          >
            {placementTopics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
           <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => handleOpenModal(cat.id)}
            className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-lg transition group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}>
              <cat.icon size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
            {cat.subtitle && <p className="text-xs text-gray-400 font-bold uppercase mb-2">{cat.subtitle}</p>}
            <p className="text-sm text-gray-500 mb-4">
              {cat.id === 'flashcards' ? 'Test your memory with quick concepts.' : `Find the best ${cat.title.toLowerCase()} for your topic.`}
            </p>
            <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              {cat.action} Now <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Tips & Tricks Section */}
      <div className="glass-card p-8 rounded-3xl border-l-8 border-yellow-400 bg-gradient-to-r from-yellow-50 to-white shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-3xl">💡</span> 
          <span>Pro Tips for <span className="text-indigo-600">{searchQuery}</span></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTips.map((tip, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-white/80 rounded-2xl border border-yellow-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-inner">
                {index + 1}
              </div>
              <p className="text-gray-700 font-medium leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resource Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {modalType === 'video' && <Youtube className="text-red-600" />}
                  {modalType === 'article' && <FileText className="text-blue-600" />}
                  {modalType === 'flashcards' && <Layers className="text-yellow-600" />}
                  
                  {modalType === 'video' && `Videos: ${searchQuery}`}
                  {modalType === 'article' && `Articles: ${searchQuery}`}
                  {modalType === 'flashcards' && `Flashcards: ${searchQuery}`}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                {/* Removed internal topic selector */}

                {/* VIDEO CONTENT */}
                {modalType === 'video' && (
                  <div className="space-y-8">
                    {loading ? (
                      <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-600 mx-auto mb-6"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Curating top recommendations...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videos.length > 0 ? (
                          videos.map((video, index) => (
                            <motion.div 
                              key={video.id} 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                              <div className="relative aspect-video overflow-hidden">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                  <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/50">
                                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-5">
                                <h4 className="font-bold text-gray-900 line-clamp-2 mb-2 text-lg leading-tight group-hover:text-red-600 transition-colors">{video.title}</h4>
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {video.channel[0]}
                                  </div>
                                  <p className="text-sm text-gray-500 font-medium">{video.channel}</p>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                  <a 
                                    href={`https://www.youtube.com/watch?v=${video.id}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                                  >
                                    Watch Now <ExternalLink size={14} />
                                  </a>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); saveResource(video); }} 
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                                    title="Save Resource"
                                  >
                                    <Bookmark size={20} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-20">
                            <p className="text-gray-500 font-medium">No videos found. Try selecting a topic.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ARTICLE CONTENT */}
                {modalType === 'article' && (
                  <div className="space-y-8">
                    {loading ? (
                      <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Fetching best reads...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {articles.length > 0 ? (
                          articles.map((article, index) => (
                            <motion.div 
                              key={article.id} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md uppercase tracking-wide">{article.source}</span>
                                  </div>
                                  <h4 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h4>
                                  <p className="text-gray-600 mb-4 leading-relaxed">{article.snippet}</p>
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    Read Full Article <ArrowRight size={16} />
                                  </a>
                                </div>
                                <button 
                                  onClick={() => saveResource(article)} 
                                  className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                >
                                  <Bookmark size={24} />
                                </button>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-20">
                            <p className="text-gray-500 font-medium">No articles found. Try selecting a topic.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* FLASHCARD CONTENT */}
                {modalType === 'flashcards' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentFlashcards.map((card, idx) => (
                        <FlipCard key={idx} front={card.front} back={card.back} />
                      ))}
                    </div>
                    {currentFlashcards.length === 0 && (
                      <p className="text-center text-gray-500 py-10">No flashcards available for this topic yet.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
