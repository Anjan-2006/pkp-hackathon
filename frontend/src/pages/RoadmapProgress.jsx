import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Map, Trophy, ArrowRight, Target } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { motion } from 'framer-motion';

// Detailed Roadmaps tailored for Interview/Placement Success
const ROADMAP_DATA = {
  "Data Structures and Algorithms": [
    { id: 1, title: "Complexity Analysis", desc: "Master Big O notation, Time vs Space trade-offs, and Amortized analysis." },
    { id: 2, title: "Arrays & Hashing", desc: "Two Pointers, Sliding Window, Prefix Sums, and HashMap patterns." },
    { id: 3, title: "Linked Lists", desc: "Fast & Slow pointers, Reversal, Cycle detection, and LRU Cache implementation." },
    { id: 4, title: "Stacks & Queues", desc: "Monotonic Stack, Parentheses matching, and Queue-based BFS." },
    { id: 5, title: "Binary Search", desc: "Search in rotated arrays, Binary Search on Answer spaces." },
    { id: 6, title: "Trees & BST", desc: "DFS/BFS traversals, Level-order, Diameter, LCA, and Tree serialization." },
    { id: 7, title: "Heaps & Priority Queues", desc: "K-th largest elements, Merge K sorted lists, Median finding." },
    { id: 8, title: "Recursion & Backtracking", desc: "Subsets, Permutations, N-Queens, and Pruning strategies." },
    { id: 9, title: "Graphs (Basics)", desc: "Adjacency list/matrix, BFS, DFS, Connected components, Flood fill." },
    { id: 10, title: "Graphs (Advanced)", desc: "Dijkstra, Bellman-Ford, Prim's, Kruskal's, Topological Sort." },
    { id: 11, title: "Dynamic Programming (1D)", desc: "Climbing stairs, House robber, Longest Increasing Subsequence." },
    { id: 12, title: "Dynamic Programming (2D)", desc: "Knapsack (0/1, Unbounded), LCS, Edit Distance, Grid paths." },
    { id: 13, title: "Tries & Union Find", desc: "Prefix trees for autocomplete, Disjoint Set Union (DSU) for cycle detection." },
    { id: 14, title: "Bit Manipulation", desc: "XOR tricks, Bit masking, Single number problems." }
  ],
  "Operating Systems": [
    { id: 1, title: "OS Fundamentals", desc: "Kernel types, System Calls, User vs Kernel Mode, Boot process." },
    { id: 2, title: "Process Management", desc: "Process states, PCB, Context Switching, Inter-process Communication (IPC)." },
    { id: 3, title: "Threads & Concurrency", desc: "User vs Kernel threads, Multithreading models, Thread safety." },
    { id: 4, title: "CPU Scheduling", desc: "Preemptive vs Non-preemptive, FCFS, SJF, Round Robin, Multilevel Feedback Queue." },
    { id: 5, title: "Process Synchronization", desc: "Race conditions, Critical Section, Mutex, Semaphores, Monitors." },
    { id: 6, title: "Deadlocks", desc: "Necessary conditions, Resource Allocation Graph, Banker's Algorithm." },
    { id: 7, title: "Memory Management", desc: "Fragmentation, Paging, Segmentation, TLB, Page Tables." },
    { id: 8, title: "Virtual Memory", desc: "Demand Paging, Page Faults, Thrashing, Page Replacement Algorithms (LRU, Optimal)." },
    { id: 9, title: "File Systems", desc: "File allocation methods, Directory structure, Disk scheduling (SCAN, C-SCAN)." }
  ],
  "Database Management Systems": [
    { id: 1, title: "DBMS Architecture", desc: "3-Schema Architecture, Data Independence, DBMS vs File System." },
    { id: 2, title: "ER Modeling", desc: "Entities, Attributes, Relationships, Cardinality, ER to Relational mapping." },
    { id: 3, title: "Relational Model", desc: "Schema, Keys (Primary, Foreign, Candidate, Super), Integrity Constraints." },
    { id: 4, title: "SQL Mastery", desc: "Joins (Inner, Outer, Self), Subqueries, Aggregation, Window Functions." },
    { id: 5, title: "Normalization", desc: "Anomalies, Functional Dependencies, 1NF, 2NF, 3NF, BCNF." },
    { id: 6, title: "Transactions & ACID", desc: "Atomicity, Consistency, Isolation, Durability, Transaction States." },
    { id: 7, title: "Concurrency Control", desc: "Conflict Serializability, Locks (Shared/Exclusive), 2PL, Deadlock handling." },
    { id: 8, title: "Indexing & Hashing", desc: "B-Trees, B+ Trees, Indexing types (Clustered/Non-clustered), Hashing." },
    { id: 9, title: "NoSQL Basics", desc: "CAP Theorem, BASE properties, Document stores (MongoDB) vs Relational." }
  ],
  "Computer Networks": [
    { id: 1, title: "Network Models", desc: "OSI 7-Layer Model vs TCP/IP Model, Data encapsulation." },
    { id: 2, title: "Application Layer", desc: "HTTP/HTTPS, DNS, SMTP, FTP, DHCP, Socket Programming basics." },
    { id: 3, title: "Transport Layer", desc: "TCP vs UDP, Three-way handshake, Flow Control, Congestion Control." },
    { id: 4, title: "Network Layer", desc: "IPv4 vs IPv6, Subnetting, CIDR, NAT, Routing Algorithms (Dijkstra, Bellman-Ford)." },
    { id: 5, title: "Data Link Layer", desc: "Framing, Error Detection (CRC), MAC Addresses, CSMA/CD, Ethernet." },
    { id: 6, title: "Network Security", desc: "Symmetric vs Asymmetric encryption, SSL/TLS handshake, Firewalls, VPNs." }
  ],
  "System Design (LLD + HLD)": [
    { id: 1, title: "Design Basics", desc: "Vertical vs Horizontal Scaling, CAP Theorem, ACID vs BASE." },
    { id: 2, title: "Networking for Design", desc: "Load Balancing (L4 vs L7), Caching strategies, CDNs, Proxy servers." },
    { id: 3, title: "Database Scaling", desc: "Replication (Master-Slave), Sharding, Consistent Hashing." },
    { id: 4, title: "Communication Protocols", desc: "REST, GraphQL, gRPC, WebSockets, Long Polling." },
    { id: 5, title: "Message Queues", desc: "Kafka/RabbitMQ basics, Pub-Sub models, Async processing." },
    { id: 6, title: "High Level Design (HLD)", desc: "Design URL Shortener, Uber, Instagram, Chat App." },
    { id: 7, title: "Object Oriented Design (LLD)", desc: "SOLID Principles, Design Patterns (Singleton, Factory, Observer, Strategy)." },
    { id: 8, title: "Schema Design", desc: "Designing DB schemas for E-commerce, Social Media, etc." }
  ],
  "MERN Stack": [
    { id: 1, title: "JavaScript Deep Dive", desc: "Event Loop, Closures, Promises, Async/Await, 'this' keyword." },
    { id: 2, title: "React Core", desc: "Virtual DOM, Reconciliation, JSX, Components, Props vs State." },
    { id: 3, title: "React Hooks & Patterns", desc: "useEffect, useMemo, useCallback, Custom Hooks, HOCs." },
    { id: '3b', title: "State Management", desc: "Context API, Redux Toolkit, Zustand." },
    { id: 4, title: "Node.js Internals", desc: "Event Emitter, Streams, Buffers, File System, Module system." },
    { id: 5, title: "Express.js", desc: "Middleware chain, Error handling, Routing, REST API best practices." },
    { id: 6, title: "MongoDB & Mongoose", desc: "Schema design, Indexing, Aggregation Pipeline, Population." },
    { id: 7, title: "Authentication", desc: "JWT, Cookies, OAuth (Google/GitHub), Password hashing (bcrypt)." },
    { id: 8, title: "Deployment & DevOps", desc: "Docker basics, CI/CD, Deploying to Vercel/AWS/Render." }
  ],
  "Computer Organization and Architecture": [
    { id: 1, title: "Data Representation", desc: "Number systems, Complements, Fixed & Floating point representation." },
    { id: 2, title: "Register Transfer", desc: "Bus and Memory transfers, Arithmetic Microoperations." },
    { id: 3, title: "Basic Computer Org", desc: "Instruction codes, Computer Registers, Instruction Cycle." },
    { id: 4, title: "Microprogrammed Control", desc: "Control memory, Address sequencing, Microinstruction format." },
    { id: 5, title: "CPU Organization", desc: "General Register Org, Stack Org, Instruction Formats, Addressing Modes." },
    { id: 6, title: "Pipeline Processing", desc: "Parallel processing, Pipelining, Arithmetic & Instruction Pipeline." },
    { id: 7, title: "Memory Organization", desc: "Memory Hierarchy, Main Memory, Auxiliary, Associative, Cache Memory." },
    { id: 8, title: "I/O Organization", desc: "Peripheral Devices, I/O Interface, DMA, IOP." }
  ],
  "Machine Learning Basics": [
    { id: 1, title: "Introduction to ML", desc: "Types of ML (Supervised, Unsupervised, RL), Applications." },
    { id: 2, title: "Data Preprocessing", desc: "Cleaning, Normalization, Encoding, Train-Test Split." },
    { id: 3, title: "Regression", desc: "Linear Regression, Polynomial Regression, Cost Function, Gradient Descent." },
    { id: 4, title: "Classification", desc: "Logistic Regression, KNN, SVM, Decision Trees, Naive Bayes." },
    { id: 5, title: "Clustering", desc: "K-Means, Hierarchical Clustering, DBSCAN." },
    { id: 6, title: "Model Evaluation", desc: "Confusion Matrix, Accuracy, Precision, Recall, F1-Score, ROC-AUC." },
    { id: 7, title: "Ensemble Methods", desc: "Bagging, Boosting, Random Forest, Gradient Boosting (XGBoost)." }
  ],
  "Deep Learning Basics": [
    { id: 1, title: "Neural Networks Intro", desc: "Neurons, Perceptrons, Multi-Layer Perceptron (MLP)." },
    { id: 2, title: "Activation Functions", desc: "Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax." },
    { id: 3, title: "Training NNs", desc: "Loss Functions, Backpropagation, Optimizers (SGD, Adam, RMSprop)." },
    { id: 4, title: "Regularization", desc: "Overfitting/Underfitting, Dropout, L1/L2 Regularization, Batch Norm." },
    { id: 5, title: "CNNs", desc: "Convolution layers, Pooling, Padding, Strides, Architectures (VGG, ResNet)." },
    { id: 6, title: "RNNs", desc: "Recurrent Neural Networks, LSTM, GRU for sequence data." }
  ]
};

export const RoadmapProgress = () => {
  const { currentSession } = useLearning();
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Use current session topic or default to DSA
  // Added fallback to ensure we always show something if topic matches partially or default
  const topic = currentSession.topic && ROADMAP_DATA[currentSession.topic] 
    ? currentSession.topic 
    : "Data Structures and Algorithms";
    
  const steps = ROADMAP_DATA[topic] || [];
  const userGoal = currentSession.goal || "Mastery";

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'guest';
    const saved = localStorage.getItem(`roadmap_${userId}_${topic}`);
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    } else {
      setCompletedSteps([]);
    }
  }, [topic]);

  const toggleStep = (id) => {
    const userId = localStorage.getItem('userId') || 'guest';
    const newCompleted = completedSteps.includes(id)
      ? completedSteps.filter(stepId => stepId !== id)
      : [...completedSteps, id];
    
    setCompletedSteps(newCompleted);
    localStorage.setItem(`roadmap_${userId}_${topic}`, JSON.stringify(newCompleted));
  };

  const progress = steps.length > 0 ? Math.round((completedSteps.length / steps.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Map className="text-indigo-600" /> Learning Roadmap
        </h1>
        <div className="flex items-center gap-2 mt-2 text-gray-600">
          <Target size={18} className="text-indigo-500" />
          <span>Goal: <span className="font-bold text-indigo-700">{userGoal}</span></span>
        </div>
        <p className="text-gray-500 mt-1">
          A comprehensive path to master <span className="font-bold text-gray-800">{topic}</span> for interviews.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-6 rounded-2xl mb-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Total Progress</p>
            <p className="text-3xl font-extrabold text-gray-900">{progress}%</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Trophy size={24} />
          </div>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-400 mt-3 text-right">{completedSteps.length} of {steps.length} steps completed</p>
      </div>

      {/* Roadmap Stepper */}
      <div className="relative border-l-4 border-indigo-100 ml-4 md:ml-8 space-y-8 py-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Connector Dot */}
              <div className="absolute -left-[1.1rem] md:-left-[1.1rem] top-6 bg-white p-1">
                <button 
                  onClick={() => toggleStep(step.id)}
                  className={`transition-all duration-300 rounded-full ${isCompleted ? 'text-green-500 scale-110' : 'text-gray-300 hover:text-indigo-400'}`}
                >
                  {isCompleted ? <CheckCircle size={28} fill="white" /> : <Circle size={28} fill="white" />}
                </button>
              </div>

              {/* Step Card */}
              <div 
                onClick={() => toggleStep(step.id)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group ${
                  isCompleted 
                    ? 'bg-green-50/50 border-green-200 shadow-sm' 
                    : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-green-800 line-through decoration-green-500/50' : 'text-gray-800'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.desc}
                    </p>
                  </div>
                  {!isCompleted && (
                    <ArrowRight className="text-gray-300 group-hover:text-indigo-400 transition-colors" size={20} />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
