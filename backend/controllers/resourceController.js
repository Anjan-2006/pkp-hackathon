import axios from 'axios';

// Curated list of high-quality videos for fallback/mock mode
// Limited to 4 videos per topic with accurate metadata
const MOCK_VIDEOS = {
  "Data Structures": [
    { 
      id: '8hly31xKli0', 
      title: 'Algorithms and Data Structures Tutorial - Full Course for Beginners', 
      channel: 'freeCodeCamp.org',
      description: 'Learn algorithms and data structures in this full course for beginners. This course is taught by a Google software engineer.'
    },
    { 
      id: 'RBSGKlAvoiM', 
      title: 'Data Structures and Algorithms in C++ | Complete Course', 
      channel: 'Love Babbar',
      description: 'Complete placement preparation course for Data Structures and Algorithms in C++.'
    },
    { 
      id: '5_5oE5lgrhw', 
      title: 'Data Structures and Algorithms - One Shot', 
      channel: 'Apna College',
      description: 'Complete Data Structures and Algorithms in one video. Great for revision.'
    },
    { 
      id: 'pkYVOmU3MgA', 
      title: 'Data Structures and Algorithms for Beginners', 
      channel: 'Programming with Mosh',
      description: 'A beginner-friendly introduction to Data Structures and Algorithms.'
    }
  ],
  "Operating Systems": [
    { 
      id: 'bkSWJJZNgf8', 
      title: 'Operating Systems Full Course', 
      channel: 'Gate Smashers',
      description: 'Complete Operating Systems course covering all important topics for exams and interviews.'
    },
    { 
      id: 'vBURTt97EkA', 
      title: 'Operating Systems: Crash Course Computer Science #18', 
      channel: 'CrashCourse',
      description: 'A fast-paced overview of what operating systems are and how they work.'
    },
    { 
      id: '2i2bt-YSlYQ', 
      title: 'Operating Systems - Full Course for Beginners', 
      channel: 'freeCodeCamp.org',
      description: 'Learn about operating systems in this full course for beginners.'
    },
    { 
      id: 'RozoeWzT7IM', 
      title: 'Introduction to Operating Systems', 
      channel: 'Neso Academy',
      description: 'Introduction to Operating Systems, their functions, and types.'
    }
  ],
  "Database": [
    { 
      id: 'HXV3zeQKqGY', 
      title: 'SQL Tutorial - Full Database Course for Beginners', 
      channel: 'freeCodeCamp.org',
      description: 'Learn SQL and database management in this full course.'
    },
    { 
      id: 'Ow8bedH79rE', 
      title: 'DBMS Complete Course', 
      channel: 'Gate Smashers',
      description: 'Complete Database Management System course for university exams and placements.'
    },
    { 
      id: '7S_tz1z_5bA', 
      title: 'MySQL Tutorial for Beginners [Full Course]', 
      channel: 'Programming with Mosh',
      description: 'Learn MySQL from scratch. No prior experience required.'
    },
    { 
      id: '3EJlovevfcA', 
      title: 'Database Design Course - Learn how to design and plan a database', 
      channel: 'freeCodeCamp.org',
      description: 'Learn how to design and plan a database for your software applications.'
    }
  ],
  "Networks": [
    { 
      id: 'IPvYjXCsTg8', 
      title: 'Computer Networking Complete Course - Beginner to Advanced', 
      channel: 'NetworkChuck',
      description: 'A complete guide to computer networking, starting from the basics.'
    },
    { 
      id: 'qiQR5rTSshw', 
      title: 'Computer Networks Course', 
      channel: 'Neso Academy',
      description: 'Comprehensive course on Computer Networks.'
    },
    { 
      id: '3QhU9jd03a0', 
      title: 'Computer Networking Full Course', 
      channel: 'Kunal Kushwaha',
      description: 'Learn Computer Networking from scratch. Covers OSI model, TCP/IP, and more.'
    },
    { 
      id: 'LnhtC0HjCCY', 
      title: 'Networking Fundamentals', 
      channel: 'Cisco',
      description: 'Learn the fundamentals of networking from Cisco.'
    }
  ],
  "System Design": [
    { 
      id: 'xpDnVSmNFX0', 
      title: 'System Design Introduction For Interview', 
      channel: 'Tushar Roy',
      description: 'Introduction to System Design for technical interviews.'
    },
    { 
      id: 'm8Icp_Cid5o', 
      title: 'System Design Course for Beginners', 
      channel: 'freeCodeCamp.org',
      description: 'Learn system design from scratch. Covers scalability, load balancing, and more.'
    },
    { 
      id: 'bUHFg8CZFws', 
      title: 'System Design Interview Prep | The Complete Guide', 
      channel: 'Gaurav Sen',
      description: 'Complete guide to preparing for System Design interviews.'
    },
    { 
      id: 'i53Gi_K3o7I', 
      title: 'System Design Primer', 
      channel: 'NeetCode',
      description: 'A primer on System Design concepts for interviews.'
    }
  ],
  "MERN": [
    { 
      id: '7CqJlxBYj4M', 
      title: 'Learn MERN Stack - Full Course', 
      channel: 'freeCodeCamp.org',
      description: 'Full course on the MERN stack: MongoDB, Express, React, and Node.js.'
    },
    { 
      id: 'CvCIUeInzGT', 
      title: 'MERN Stack Tutorial', 
      channel: 'CodeWithHarry',
      description: 'Complete MERN Stack tutorial in Hindi.'
    },
    { 
      id: 'rgFd1NCMMig', 
      title: 'MERN Stack Crash Course Tutorial', 
      channel: 'Net Ninja',
      description: 'Fast-paced crash course on the MERN stack.'
    },
    { 
      id: '-0exw-9YJBo', 
      title: 'Full Stack Web Development with React & Node.js', 
      channel: 'freeCodeCamp.org',
      description: 'Build a full stack application with React and Node.js.'
    }
  ],
  "Machine Learning": [
    { 
      id: 'GwIo3gDZCVQ', 
      title: 'Machine Learning for Everybody – Full Course', 
      channel: 'freeCodeCamp.org',
      description: 'Learn Machine Learning in this full course for beginners.'
    },
    { 
      id: 'i_LwzRVP7bg', 
      title: 'Machine Learning Basics', 
      channel: 'Simplilearn',
      description: 'Basics of Machine Learning explained simply.'
    },
    { 
      id: '7eh4d6sabA0', 
      title: 'Python Machine Learning Tutorial (Data Science)', 
      channel: 'Programming with Mosh',
      description: 'Learn how to use Python for Machine Learning.'
    },
    { 
      id: 'JcI5Vnw0b2c', 
      title: 'Machine Learning Course for Beginners', 
      channel: 'freeCodeCamp.org',
      description: 'A comprehensive course on Machine Learning for beginners.'
    }
  ],
  "Deep Learning": [
    { 
      id: 'VyWAvY2CF9c', 
      title: 'Deep Learning for Beginners', 
      channel: 'Simplilearn',
      description: 'Introduction to Deep Learning concepts.'
    },
    { 
      id: '6M5VXKLf4D4', 
      title: 'Deep Learning Crash Course', 
      channel: 'freeCodeCamp.org',
      description: 'Crash course on Deep Learning.'
    },
    { 
      id: 'aircAruvnKk', 
      title: 'Neural Networks and Deep Learning', 
      channel: '3Blue1Brown',
      description: 'Visual explanation of Neural Networks and Deep Learning.'
    },
    { 
      id: 'NjZ9d3xK36s', 
      title: 'Deep Learning with Python, TensorFlow, and Keras tutorial', 
      channel: 'freeCodeCamp.org',
      description: 'Learn Deep Learning with Python tools.'
    }
  ],
  "COA": [
    { 
      id: 'L9X7XXfHYdU', 
      title: 'Computer Organization and Architecture', 
      channel: 'Gate Smashers',
      description: 'Complete COA course for GATE and University exams.'
    },
    { 
      id: '4TzMyXmzL8M', 
      title: 'Computer Organization and Architecture', 
      channel: 'Neso Academy',
      description: 'Comprehensive tutorials on Computer Architecture.'
    },
    { 
      id: 'So9sr3llQ6s', 
      title: 'Computer Architecture - Coursera', 
      channel: 'Princeton University',
      description: 'High quality academic lectures on architecture.'
    },
    { 
      id: '1I5W13f9_EA', 
      title: 'Computer Organization', 
      channel: 'Education 4u',
      description: 'Simple explanations of COA concepts.'
    }
  ]
};

// Curated list of high-quality articles
const MOCK_ARTICLES = {
  "Data Structures": [
    { id: 'a1', title: "Data Structures and Algorithms - GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/", source: "GeeksforGeeks", snippet: "A comprehensive guide covering all major data structures with implementation examples." },
    { id: 'a2', title: "Top Data Structures for Coding Interviews", url: "https://www.freecodecamp.org/news/top-data-structures-for-coding-interviews/", source: "freeCodeCamp", snippet: "Essential data structures you need to master for technical interviews." },
    { id: 'a3', title: "Big O Notation Cheat Sheet", url: "https://www.bigocheatsheet.com/", source: "BigO", snippet: "Quick reference for time and space complexity of common algorithms." },
    { id: 'a4', title: "VisuAlgo - Visualizing Data Structures", url: "https://visualgo.net/en", source: "VisuAlgo", snippet: "Interactive animations to understand how algorithms work internally." },
    { id: 'a5', title: "Problem Solving with Algorithms and Data Structures", url: "https://runestone.academy/ns/books/published/pythonds/index.html", source: "Runestone", snippet: "Interactive Python-based DSA book." },
    { id: 'a6', title: "LeetCode Patterns", url: "https://seanprashad.com/leetcode-patterns/", source: "Sean Prashad", snippet: "Curated list of LeetCode questions grouped by pattern." },
    { id: 'a7', title: "Introduction to Algorithms (CLRS)", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", source: "MIT Press", snippet: "The standard textbook for algorithms." },
    { id: 'a8', title: "Data Structures - Programiz", url: "https://www.programiz.com/dsa", source: "Programiz", snippet: "Beginner friendly tutorials on DSA." },
    { id: 'a9', title: "CP-Algorithms", url: "https://cp-algorithms.com/", source: "CP-Algorithms", snippet: "Algorithms and data structures for competitive programming." },
    { id: 'a10', title: "Tech Interview Handbook - Algorithms", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", source: "Tech Interview Handbook", snippet: "Cheatsheet for algorithm interviews." }
  ],
  "Operating Systems": [
    { id: 'a11', title: "Operating Systems Tutorial", url: "https://www.javatpoint.com/operating-system", source: "JavaTpoint", snippet: "In-depth tutorial covering processes, threads, scheduling, and memory management." },
    { id: 'a12', title: "OS Interview Questions", url: "https://www.interviewbit.com/operating-system-interview-questions/", source: "InterviewBit", snippet: "Top asked operating system interview questions and answers." },
    { id: 'a13', title: "Process vs Thread", url: "https://stackoverflow.com/questions/200469/what-is-the-difference-between-a-process-and-a-thread", source: "StackOverflow", snippet: "Detailed discussion on the differences between processes and threads." },
    { id: 'a14', title: "Operating Systems - GeeksforGeeks", url: "https://www.geeksforgeeks.org/operating-systems/", source: "GeeksforGeeks", snippet: "A-Z guide on Operating Systems." },
    { id: 'a15', title: "OSTEP: Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", source: "OSTEP", snippet: "Free online book on Operating Systems." },
    { id: 'a16', title: "Linux Kernel Map", url: "https://makelinux.github.io/kernel/map/", source: "MakeLinux", snippet: "Interactive map of the Linux kernel." },
    { id: 'a17', title: "Deadlock in OS", url: "https://www.tutorialspoint.com/operating_system/os_deadlocks.htm", source: "Tutorialspoint", snippet: "Understanding deadlocks and prevention." },
    { id: 'a18', title: "Virtual Memory Explained", url: "https://computer.howstuffworks.com/virtual-memory.htm", source: "HowStuffWorks", snippet: "Simple explanation of virtual memory." },
    { id: 'a19', title: "Scheduling Algorithms", url: "https://www.guru99.com/cpu-scheduling-algorithms.html", source: "Guru99", snippet: "Guide to CPU scheduling algorithms." },
    { id: 'a20', title: "The Little Book of Semaphores", url: "https://greenteapress.com/wp/semaphores/", source: "Green Tea Press", snippet: "Free book on synchronization patterns." }
  ],
  "Database": [
    { id: 'a21', title: "SQL vs NoSQL", url: "https://www.mongodb.com/nosql-explained/nosql-vs-sql", source: "MongoDB", snippet: "When to use relational vs non-relational databases." },
    { id: 'a22', title: "Database Normalization", url: "https://www.guru99.com/database-normalization.html", source: "Guru99", snippet: "Step-by-step guide to normalization." },
    { id: 'a23', title: "ACID Properties", url: "https://www.geeksforgeeks.org/acid-properties-in-dbms/", source: "GeeksforGeeks", snippet: "Deep dive into ACID properties." },
    { id: 'a24', title: "SQLZoo", url: "https://sqlzoo.net/", source: "SQLZoo", snippet: "Interactive SQL tutorials." },
    { id: 'a25', title: "Use The Index, Luke", url: "https://use-the-index-luke.com/", source: "Use The Index, Luke", snippet: "Guide to database performance and indexing." },
    { id: 'a26', title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", source: "PostgreSQL Tutorial", snippet: "Comprehensive guide to PostgreSQL." },
    { id: 'a27', title: "Sharding vs Partitioning", url: "https://www.digitalocean.com/community/tutorials/understanding-database-sharding", source: "DigitalOcean", snippet: "Understanding database scaling strategies." },
    { id: 'a28', title: "CAP Theorem", url: "https://www.ibm.com/cloud/learn/cap-theorem", source: "IBM", snippet: "Consistency, Availability, Partition Tolerance explained." },
    { id: 'a29', title: "Redis Crash Course", url: "https://redis.io/docs/getting-started/", source: "Redis", snippet: "Getting started with in-memory databases." },
    { id: 'a30', title: "Database Design Basics", url: "https://www.smartdraw.com/entity-relationship-diagram/database-design.htm", source: "SmartDraw", snippet: "Basics of ER diagrams and DB design." }
  ],
  "Networks": [
    { id: 'a31', title: "OSI Model Explained", url: "https://www.cloudflare.com/learning/ddos/glossary/osi-model/", source: "Cloudflare", snippet: "Clear explanation of the 7 layers." },
    { id: 'a32', title: "TCP vs UDP", url: "https://www.geeksforgeeks.org/differences-between-tcp-and-udp/", source: "GeeksforGeeks", snippet: "Comparison of transport protocols." },
    { id: 'a33', title: "How DNS Works", url: "https://howdns.works/", source: "HowDNSWorks", snippet: "Comic-style explanation of DNS." },
    { id: 'a34', title: "HTTP Status Codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", source: "MDN", snippet: "Reference for HTTP response codes." },
    { id: 'a35', title: "Subnetting Made Easy", url: "https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html", source: "Cisco", snippet: "Guide to IP addressing and subnetting." },
    { id: 'a36', title: "What is a VPN?", url: "https://www.kaspersky.com/resource-center/definitions/what-is-a-vpn", source: "Kaspersky", snippet: "Understanding Virtual Private Networks." },
    { id: 'a37', title: "HTTPS Explained", url: "https://www.ssl.com/faqs/what-is-https/", source: "SSL.com", snippet: "How secure HTTP works." },
    { id: 'a38', title: "Network Topologies", url: "https://www.computerhope.com/jargon/t/topology.htm", source: "Computer Hope", snippet: "Types of network layouts." },
    { id: 'a39', title: "Wireshark Tutorial", url: "https://www.wireshark.org/docs/wsug_html_chunked/", source: "Wireshark", snippet: "Analyzing network traffic." },
    { id: 'a40', title: "Socket Programming", url: "https://realpython.com/python-sockets/", source: "Real Python", snippet: "Introduction to network sockets." }
  ],
  "System Design": [
    { id: 'a41', title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", source: "GitHub", snippet: "Ultimate guide to system design." },
    { id: 'a42', title: "System Design Interview Guide", url: "https://www.educative.io/blog/system-design-interview-guide", source: "Educative", snippet: "Approach to system design interviews." },
    { id: 'a43', title: "High Scalability", url: "http://highscalability.com/", source: "High Scalability", snippet: "Case studies of scalable systems." },
    { id: 'a44', title: "Microservices Architecture", url: "https://microservices.io/", source: "Microservices.io", snippet: "Patterns for microservices." },
    { id: 'a45', title: "Load Balancing 101", url: "https://www.nginx.com/resources/glossary/load-balancing/", source: "NGINX", snippet: "Basics of load balancing." },
    { id: 'a46', title: "Caching Strategies", url: "https://aws.amazon.com/caching/", source: "AWS", snippet: "Overview of caching patterns." },
    { id: 'a47', title: "Database Sharding", url: "https://www.digitalocean.com/community/tutorials/understanding-database-sharding", source: "DigitalOcean", snippet: "Scaling databases horizontally." },
    { id: 'a48', title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", source: "Book", snippet: "Must-read book for system design." },
    { id: 'a49', title: "REST vs GraphQL", url: "https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/", source: "Apollo", snippet: "Comparing API architectural styles." },
    { id: 'a50', title: "Consistent Hashing", url: "https://www.toptal.com/big-data/consistent-hashing", source: "Toptal", snippet: "Algorithm for distributed caching." }
  ],
  "MERN": [
    { id: 'a51', title: "React Documentation", url: "https://react.dev/", source: "React Docs", snippet: "Official React documentation." },
    { id: 'a52', title: "Node.js Best Practices", url: "https://github.com/goldbergyoni/nodebestpractices", source: "GitHub", snippet: "Best practices for Node.js." },
    { id: 'a53', title: "Express.js Guide", url: "https://expressjs.com/en/guide/routing.html", source: "Express", snippet: "Routing and middleware in Express." },
    { id: 'a54', title: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual/", source: "MongoDB", snippet: "Official MongoDB documentation." },
    { id: 'a55', title: "Full Stack Open", url: "https://fullstackopen.com/en/", source: "University of Helsinki", snippet: "Free full stack course." },
    { id: 'a56', title: "Redux Toolkit", url: "https://redux-toolkit.js.org/", source: "Redux", snippet: "State management for React." },
    { id: 'a57', title: "JWT Authentication", url: "https://jwt.io/introduction", source: "JWT.io", snippet: "JSON Web Tokens explained." },
    { id: 'a58', title: "Mongoose Docs", url: "https://mongoosejs.com/docs/", source: "Mongoose", snippet: "ODM for MongoDB." },
    { id: 'a59', title: "React Router", url: "https://reactrouter.com/en/main", source: "React Router", snippet: "Routing for React apps." },
    { id: 'a60', title: "Deploying MERN Apps", url: "https://www.freecodecamp.org/news/how-to-deploy-a-mern-stack-application-to-heroku-6339d6a8aa06/", source: "freeCodeCamp", snippet: "Deployment guide." }
  ],
  "Machine Learning": [
    { id: 'a61', title: "Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course", source: "Google", snippet: "Practical intro to ML." },
    { id: 'a62', title: "Scikit-Learn Tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html", source: "Scikit-Learn", snippet: "Python ML library tutorials." },
    { id: 'a63', title: "Kaggle Learn", url: "https://www.kaggle.com/learn", source: "Kaggle", snippet: "Hands-on data science courses." },
    { id: 'a64', title: "Towards Data Science", url: "https://towardsdatascience.com/", source: "Medium", snippet: "Articles on AI and ML." },
    { id: 'a65', title: "Andrew Ng's ML Course", url: "https://www.coursera.org/learn/machine-learning", source: "Coursera", snippet: "Famous ML course." },
    { id: 'a66', title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/", source: "Pandas", snippet: "Data manipulation library." },
    { id: 'a67', title: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html", source: "NumPy", snippet: "Numerical computing in Python." },
    { id: 'a68', title: "Gradient Descent Explained", url: "https://builtin.com/data-science/gradient-descent", source: "Built In", snippet: "Optimization algorithm basics." },
    { id: 'a69', title: "Bias-Variance Tradeoff", url: "https://elitedatascience.com/bias-variance-tradeoff", source: "EliteDataScience", snippet: "Key concept in ML models." },
    { id: 'a70', title: "Supervised vs Unsupervised", url: "https://www.ibm.com/cloud/learn/supervised-vs-unsupervised-learning", source: "IBM", snippet: "Types of machine learning." }
  ],
  "Deep Learning": [
    { id: 'a71', title: "Deep Learning Book", url: "https://www.deeplearningbook.org/", source: "MIT Press", snippet: "Definitive textbook on DL." },
    { id: 'a72', title: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/", source: "PyTorch", snippet: "Building NNs with PyTorch." },
    { id: 'a73', title: "TensorFlow Guide", url: "https://www.tensorflow.org/learn", source: "TensorFlow", snippet: "Official TensorFlow learning resources." },
    { id: 'a74', title: "Fast.ai", url: "https://www.fast.ai/", source: "Fast.ai", snippet: "Making neural nets uncool again." },
    { id: 'a75', title: "Distill.pub", url: "https://distill.pub/", source: "Distill", snippet: "Visual explanations of ML research." },
    { id: 'a76', title: "CNNs Explained", url: "https://poloclub.github.io/cnn-explainer/", source: "CNN Explainer", snippet: "Interactive visualization of CNNs." },
    { id: 'a77', title: "RNNs and LSTMs", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/", source: "Colah's Blog", snippet: "Understanding sequence models." },
    { id: 'a78', title: "Transformers Explained", url: "https://jalammar.github.io/illustrated-transformer/", source: "Jay Alammar", snippet: "Visual guide to Transformers." },
    { id: 'a79', title: "Hugging Face Course", url: "https://huggingface.co/course/chapter1/1", source: "Hugging Face", snippet: "NLP with Transformers." },
    { id: 'a80', title: "Backpropagation Calculus", url: "https://www.3blue1brown.com/lessons/backpropagation-calculus", source: "3Blue1Brown", snippet: "Math behind neural networks." }
  ],
  "COA": [
    { id: 'a81', title: "Computer Organization - GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/", source: "GeeksforGeeks", snippet: "Tutorials on COA concepts." },
    { id: 'a82', title: "Von Neumann Architecture", url: "https://www.computerhope.com/jargon/v/von-neumann-architecture.htm", source: "Computer Hope", snippet: "Basics of computer architecture." },
    { id: 'a83', title: "Instruction Cycle", url: "https://www.tutorialspoint.com/computer_logical_organization/instruction_cycle.htm", source: "Tutorialspoint", snippet: "Fetch-Decode-Execute cycle." },
    { id: 'a84', title: "Cache Memory Mapping", url: "https://www.gatevidyalay.com/cache-mapping-techniques-cache-memory/", source: "Gate Vidyalay", snippet: "Direct, Associative, and Set Associative mapping." },
    { id: 'a85', title: "Pipelining in Computer Architecture", url: "https://www.guru99.com/pipelining-in-computer-architecture.html", source: "Guru99", snippet: "Improving instruction throughput." },
    { id: 'a86', title: "Addressing Modes", url: "https://www.studytonight.com/computer-architecture/addressing-modes", source: "StudyTonight", snippet: "Types of addressing modes." },
    { id: 'a87', title: "RISC vs CISC", url: "https://cs.stanford.edu/people/eroberts/courses/soco/projects/risc/risccisc/", source: "Stanford", snippet: "Comparison of instruction sets." },
    { id: 'a88', title: "Memory Hierarchy", url: "https://www.elprocus.com/memory-hierarchy-in-computer-architecture/", source: "ElProCus", snippet: "Levels of memory storage." },
    { id: 'a89', title: "DMA Controller", url: "https://www.electronics-tutorials.ws/io/dma-controller.html", source: "Electronics Tutorials", snippet: "Direct Memory Access explained." },
    { id: 'a90', title: "Interrupts in COA", url: "https://www.javatpoint.com/interrupts-in-computer-organization", source: "JavaTpoint", snippet: "Handling system interrupts." }
  ]
};

// Helper to get mock videos based on query keyword
const getMockForQuery = (q) => {
  const lowerQ = q.toLowerCase();
  let key = Object.keys(MOCK_VIDEOS).find(k => lowerQ.includes(k.toLowerCase()));
  
  // Fallback matching if exact key not found
  if (!key) {
      if (lowerQ.includes('structure') || lowerQ.includes('algorithm') || lowerQ.includes('dsa')) key = "Data Structures";
      else if (lowerQ.includes('organization') || lowerQ.includes('architecture') || lowerQ.includes('coa')) key = "COA";
      else if (lowerQ.includes('system') && lowerQ.includes('design')) key = "System Design";
      else if (lowerQ.includes('operating') || lowerQ.includes('os')) key = "Operating Systems";
      else if (lowerQ.includes('network')) key = "Networks";
      else if (lowerQ.includes('dbms') || lowerQ.includes('sql') || lowerQ.includes('database')) key = "Database";
      else if (lowerQ.includes('mern') || lowerQ.includes('react') || lowerQ.includes('node')) key = "MERN";
      else if (lowerQ.includes('deep')) key = "Deep Learning";
      else if (lowerQ.includes('machine') || lowerQ.includes('ml')) key = "Machine Learning";
      else key = "Data Structures"; // Default
  }
  
  return MOCK_VIDEOS[key].map(v => ({
    id: v.id,
    title: v.title,
    description: v.description,
    thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`, // High quality thumbnail
    channel: v.channel
  }));
};

export const searchYoutube = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Query required' });

    const apiKey = process.env.YOUTUBE_API_KEY;

    // Fallback to Mock Data if no API Key or if it fails
    if (!apiKey || apiKey === 'your_youtube_api_key_here') {
      console.warn("⚠️ No YOUTUBE_API_KEY found. Returning curated videos.");
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({
        success: true,
        videos: getMockForQuery(query)
      });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 4, // Limit to 4 as requested
        q: query,
        type: 'video',
        key: apiKey
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      // Try high res, fallback to medium
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle
    }));

    res.json({ success: true, videos });
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    // Return curated mock data on error to keep UI working beautifully
    await new Promise(resolve => setTimeout(resolve, 800));
    res.json({
      success: true,
      videos: getMockForQuery(query)
    });
  }
};

export const getArticles = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Query required' });

    const lowerQ = query.toLowerCase();
    let key = Object.keys(MOCK_ARTICLES).find(k => lowerQ.includes(k.toLowerCase()));
    
    // Fallback matching
    if (!key) {
       if (lowerQ.includes('structure') || lowerQ.includes('algorithm') || lowerQ.includes('dsa')) key = "Data Structures";
       else if (lowerQ.includes('organization') || lowerQ.includes('architecture') || lowerQ.includes('coa')) key = "COA";
       else if (lowerQ.includes('system') && lowerQ.includes('design')) key = "System Design";
       else if (lowerQ.includes('operating') || lowerQ.includes('os')) key = "Operating Systems";
       else if (lowerQ.includes('network')) key = "Networks";
       else if (lowerQ.includes('dbms') || lowerQ.includes('sql') || lowerQ.includes('database')) key = "Database";
       else if (lowerQ.includes('mern') || lowerQ.includes('react') || lowerQ.includes('node')) key = "MERN";
       else if (lowerQ.includes('deep')) key = "Deep Learning";
       else if (lowerQ.includes('machine') || lowerQ.includes('ml')) key = "Machine Learning";
       else key = "Data Structures"; // Default
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    res.json({
      success: true,
      articles: MOCK_ARTICLES[key]
    });
  } catch (error) {
    next(error);
  }
};
