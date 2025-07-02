// Welcome to your Code4Collage React App!
// This version fixes a runtime error by setting the API URL directly.

/*
  ==========================================
  Developed by: Yash Dhanani
  GitHub: github.com/yashdhanani
  ==========================================
*/

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// ===================================================================================
// --- DATA & CONFIGURATION ---
// All data and helper functions are defined here, before any components.
// ===================================================================================

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function createAITipsDatabase() {
    return {
        'html': {
            greeting: "Welcome to the HTML tutorial! I can help you with tags, attributes, and page structure.",
            tips: [
                "**Tip:** Every HTML page needs a `<!DOCTYPE html>` declaration and `<html>`, `<head>`, and `<body>` tags.",
                "Want to see a basic HTML layout? Ask for an 'example'.",
            ],
            rules: {
                "div": "A `<div>` is a generic container for flow content.",
                "example": "Here's a simple layout template:\n```html\n<header>\n  <h1>My Website</h1>\n</header>\n```"
            }
        },
        'default': {
            greeting: "Hello! I'm your Code Assistant. How can I help you today?",
            tips: [ "You can ask me for definitions, code examples, or best practices." ],
            rules: { "python": "Python is a high-level programming language." }
        }
    }
}

const AI_TIPS_DATABASE = createAITipsDatabase();
const AuthContext = createContext(null);

// ===================================================================================
// --- APPLICATION COMPONENTS ---
// The components are now ordered correctly to avoid reference errors.
// ===================================================================================

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const login = (name) => setUser({ name });
    const logout = () => setUser(null);
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

const Navbar = ({ setPage, theme, toggleTheme, onLoginClick }) => {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    setPage({ name: 'home' });
  };
  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setPage({ name: 'home' })} className="font-bold text-2xl text-cyan-600 dark:text-cyan-400 hover:opacity-80 transition">
              Code4Collage
            </button>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => setPage({ name: 'home' })} className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</button>
                <button onClick={() => setPage({ name: 'tutorials' })} className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Tutorials</button>
                <button onClick={() => setPage({ name: 'exercises' })} className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Exercises</button>
              </div>
            </div>
            <div className="ml-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold hidden sm:block">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-600">Logout</button>
                </div>
              ) : (
                <button onClick={onLoginClick} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-green-600">Sign In</button>
              )}
            </div>
            <button 
              onClick={toggleTheme} 
              className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 border-b-4 border-gray-300 dark:border-gray-900 active:border-b-0 active:translate-y-1 transition-all duration-100 focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              }
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AuthModal = ({ onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProvider, setLoadingProvider] = useState('');
    const { login } = useAuth();

    const handleStandardSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            login(name.trim());
            onClose();
        }
    };

    const handleSocialLogin = (provider) => {
        setLoadingProvider(provider);
        setIsLoading(true);
        setTimeout(() => {
            login(`${provider} User`);
            setIsLoading(false);
            setLoadingProvider('');
            onClose();
        }, 1500);
    };

    const SocialButton = ({ provider, children }) => (
        <button type="button" onClick={() => handleSocialLogin(provider)} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            {children}
        </button>
    );

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connecting to {loadingProvider}...</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Please wait while we securely log you in.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in-down" onClick={e => e.stopPropagation()}>
                {isLoginView ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">Sign in</h2>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
                            Don't have an account? <button onClick={() => setIsLoginView(false)} className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline">Register</button>
                        </p>
                        <form onSubmit={handleStandardSubmit}>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name (for demo)" className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            <button type="submit" className="w-full py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700 transition">Sign In</button>
                        </form>
                        <div className="mt-4 flex items-center justify-center">
                            <button className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">Forgot your password?</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">Create your account</h2>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
                            Already have an account? <button onClick={() => setIsLoginView(true)} className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline">Sign In</button>
                        </p>
                        <form onSubmit={handleStandardSubmit}>
                             <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            <button type="submit" className="w-full py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700 transition">Create account</button>
                        </form>
                    </div>
                )}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <SocialButton provider="Google">Google</SocialButton>
                    <SocialButton provider="Facebook">Facebook</SocialButton>
                    <SocialButton provider="GitHub">GitHub</SocialButton>
                </div>
                <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
                    This site is protected by reCAPTCHA and the Google <a href="#!" className="underline">Privacy Policy</a> and <a href="#!" className="underline">Terms of Service</a> apply.
                </p>
            </div>
        </div>
    );
};

const ScrollingBanner = ({ setPage }) => {
    const [tutorialIndex, setTutorialIndex] = useState([]);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/tutorials`);
                const data = await response.json();
                setTutorialIndex(data);
            } catch (error) {
                console.error("Failed to fetch tutorial index:", error);
            }
        };
        fetchTutorials();
    }, []);

    const renderTechButton = (tech, index) => (
        <button 
            key={index} 
            onClick={() => setPage({ name: 'tutorial', id: tech.id })}
            className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 mx-4 px-2 py-1 rounded-md"
        >
            {tech.title}
        </button>
    );

    return (
        <div className="bg-gray-200 dark:bg-gray-900 py-2 overflow-hidden shadow-inner">
            <div className="relative flex items-center">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {tutorialIndex.map(renderTechButton)}
                </div>
                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
                    {tutorialIndex.map((tech, index) => renderTechButton(tech, index + tutorialIndex.length))}
                </div>
            </div>
        </div>
    );
};

const Footer = ({ onAboutClick }) => {
  return (
    <footer className="footer-fade-in bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 mt-auto border-t border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          Developed with ❤️ by <button onClick={onAboutClick} className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">Yash Dhanani</button>
        </p>
      </div>
    </footer>
  );
};

const AboutModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 animate-fade-in-down" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About the Developer</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Hi! I’m Yash Dhanani, a full-stack developer passionate about creating beautiful and functional web applications.
            </p>
            <div className="flex justify-center space-x-4">
                <a href="https://github.com/yashdhanani" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">GitHub</a>
                <a href="#!" className="text-cyan-600 dark:text-cyan-400 hover:underline">LinkedIn</a>
            </div>
            <button onClick={onClose} className="mt-6 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">Close</button>
        </div>
    </div>
);

const LanguageCard = ({ setPage, lang, index }) => {
    const { id, title, description, color, bgColor, example } = lang;
    return (
        <div className={`w-full lg:w-1/2 p-8 ${bgColor} dark:bg-gray-800 animate-fade-in-stagger`} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">{description}</p>
                <button onClick={() => setPage({ name: 'tutorial', id })} className={`mt-4 px-8 py-2 rounded-full font-bold text-white ${color} hover:opacity-90`}>
                    Learn {title}
                </button>
            </div>
            <div className="mt-6 bg-gray-800 dark:bg-black rounded-lg shadow-lg p-4">
                <h3 className="text-white font-semibold mb-2">{title} Example:</h3>
                <pre className="text-white text-sm whitespace-pre-wrap"><code>{example}</code></pre>
                <button onClick={() => setPage({ name: 'tutorial', id })} className="mt-4 w-full py-2 rounded-md font-bold text-white bg-green-600 hover:bg-green-700">
                    Try it Yourself
                </button>
            </div>
        </div>
    );
};

const HomePage = ({ setPage }) => {
    const languages = [
        { id: 'html', title: 'HTML', description: 'The language for building web pages', color: 'bg-green-500', bgColor: 'bg-green-50', example: `<!DOCTYPE html>\n<html>\n<title>HTML Tutorial</title>\n<body>\n\n<h1>This is a heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>` },
        { id: 'css', title: 'CSS', description: 'The language for styling web pages', color: 'bg-blue-500', bgColor: 'bg-blue-50', example: `body {\n  background-color: lightblue;\n}\n\nh1 {\n  color: white;\n  text-align: center;\n}\n\np {\n  font-family: verdana;\n}` },
        { id: 'javascript', title: 'JavaScript', description: 'The language for programming web pages', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', example: `<button onclick="myFunction()">Click Me!</button>\n\n<script>\nfunction myFunction() {\n  let x = document.getElementById("demo");\n  x.style.fontSize = "25px";\n  x.style.color = "red";\n}\n</script>` },
        { id: 'python', title: 'Python', description: 'A popular programming language', color: 'bg-purple-500', bgColor: 'bg-purple-50', example: `if 5 > 2:\n  print("Five is greater than two!")` },
        { id: 'sql', title: 'SQL', description: 'A language for accessing databases', color: 'bg-red-500', bgColor: 'bg-red-50', example: `SELECT * FROM Customers\nWHERE Country='Mexico';` },
        { id: 'react', title: 'React', description: 'A library for building user interfaces', color: 'bg-sky-500', bgColor: 'bg-sky-50', example: `function Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}` },
    ];

  return (
    <div className="flex-grow">
      <div className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center animate-fade-in-down">
          <h1 className="text-6xl font-bold tracking-tight">
            Learn to Code
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            With the world's largest web developer site.
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap">
          {languages.map((lang, index) => <LanguageCard key={lang.id} setPage={setPage} lang={lang} index={index} />)}
      </div>

    </div>
  );
};

const TutorialsPage = ({ setPage }) => {
  const [tutorialIndex, setTutorialIndex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tutorials`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTutorialIndex(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  if (loading) return <div className="text-center p-8">Loading tutorials...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: Could not load tutorials. Is the backend server running?</div>;

  return (
    <div className="flex-grow container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100 animate-fade-in-down">All Tutorials</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-down" style={{animationDelay: '100ms'}}>Select a topic to start learning.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tutorialIndex.map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => setPage({ name: 'tutorial', id: topic.id })}
              className="p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 bg-white dark:bg-gray-800 hover:bg-cyan-50 dark:hover:bg-gray-700 cursor-pointer animate-fade-in-stagger"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{topic.title}</h2>
            </div>
          ))}
      </div>
    </div>
  );
};

const OutputPane = ({ language, code }) => {
    if (language === 'html') {
        return (
            <iframe
                srcDoc={code}
                title="Live Preview"
                sandbox="allow-scripts"
                width="100%"
                height="100%"
                className="bg-white"
            />
        );
    }

    let simulatedOutput = `> Simulating execution for ${language}...\n`;
    if (language === 'python') {
        simulatedOutput += `> Hello, World!`;
    } else if (language === 'java') {
        simulatedOutput += `> Hello, World!`;
    } else if (language === 'sql') {
        simulatedOutput += `> (1 row(s) affected)`;
    } else {
        simulatedOutput += `> Live execution for this language is not supported in this demo.`;
    }

    return (
        <div className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm">
            <pre>{simulatedOutput}</pre>
        </div>
    );
};

const TutorialDisplayPage = ({ setPage, tutorialId }) => {
  const { user } = useAuth();
  const [tutorial, setTutorial] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorialDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/tutorials/${tutorialId}`);
        if (!response.ok) {
          throw new Error('Could not find this tutorial.');
        }
        const data = await response.json();
        setTutorial(data);
        setCode(data.code);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorialDetail();
  }, [tutorialId]);
  
  if (loading) return <div className="text-center p-8">Loading tutorial...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setPage({ name: 'tutorials' })} className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-500 dark:hover:bg-gray-600 transition">
          &larr; Back to All Tutorials
        </button>
        {user && (
            <button onClick={() => setPage({ name: 'certificate', tutorialTitle: tutorial.title })} className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition">
                Get Certificate
            </button>
        )}
      </div>
      <div className="prose dark:prose-invert max-w-none lg:prose-xl mb-8">
          <ReactMarkdown children={tutorial.content} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[500px]">
        <div className="lg:w-1/2 h-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg flex flex-col">
           <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 font-mono text-sm">Live Editor</div>
           <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            className="w-full h-full p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm resize-none border-0 focus:ring-0 outline-none"
            aria-label="Live Code Editor"
          />
        </div>
        <div className="lg:w-1/2 h-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <OutputPane language={tutorial.language} code={code} />
        </div>
      </div>
    </div>
  );
};

const ExercisesPage = () => {
  return (
    <div className="flex-grow container mx-auto p-8 text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Coding Exercises</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">This section is under construction.</p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Come back soon to test your skills!</p>
    </div>
  );
};

const CertificatePage = ({ setPage, tutorialTitle }) => {
    const { user } = useAuth();
    const certificateRef = useRef(null);
    const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const handleDownload = () => {
        if (window.html2canvas) {
            window.html2canvas(certificateRef.current).then(canvas => {
                const link = document.createElement('a');
                link.download = `Code4Collage-${tutorialTitle}-Certificate.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        } else {
            alert('Could not download certificate. Please try again in a moment.');
        }
    };

    if (!user) {
        return (
            <div className="flex-grow container mx-auto p-8 text-center animate-fade-in">
                <h1 className="text-2xl font-bold text-red-500">Please log in to view your certificate.</h1>
                <button onClick={() => setPage({ name: 'home' })} className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Go to Home</button>
            </div>
        );
    }
    
    return (
        <div className="flex-grow container mx-auto p-4 md:p-8 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <button onClick={() => setPage({ name: 'tutorials' })} className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-500 dark:hover:bg-gray-600 transition">
                    &larr; Back to All Tutorials
                </button>
                <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">
                    Download Certificate
                </button>
             </div>
            <div ref={certificateRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 border-4 border-cyan-500 dark:border-cyan-400">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">Certificate of Completion</h1>
                    <p className="text-lg mt-4 text-gray-600 dark:text-gray-300">This certificate is proudly presented to</p>
                    <p className="text-4xl font-serif font-bold my-8 text-gray-800 dark:text-gray-100">{user.name}</p>
                    <p className="text-lg text-gray-600 dark:text-gray-300">for successfully completing the course</p>
                    <p className="text-2xl font-semibold my-4 text-gray-700 dark:text-gray-200">{tutorialTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">on {completionDate}</p>
                    <div className="mt-12">
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Code4Collage</p>
                        <p className="text-xs text-gray-500">An Online Learning Platform</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIAssistantWidget = ({ onClick }) => (
    <div className="fixed bottom-4 right-4 z-30 group">
        <button onClick={onClick} className="bg-cyan-600 text-white rounded-full p-4 shadow-lg hover:bg-cyan-700 transition-transform transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
        <div className="absolute bottom-1/2 right-full mr-2 transform translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help?
        </div>
    </div>
);

const AIAssistantModal = ({ isOpen, onClose, page }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const tutorialId = page.name === 'tutorial' ? page.id : 'default';
    const aiConfig = AI_TIPS_DATABASE[tutorialId] || AI_TIPS_DATABASE['default'];

    useEffect(() => {
        if (isOpen) {
            const greeting = `Hello ${user?.name || 'there'}! ${aiConfig.greeting}`;
            setMessages([{ sender: 'ai', text: greeting }, { sender: 'ai', text: aiConfig.tips.join('\n\n') }]);
        }
    }, [isOpen, tutorialId, user, aiConfig.greeting, aiConfig.tips]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let response = "I'm not sure how to answer that. Try asking about a specific term or for an 'example'.";
            
            for (const rule in aiConfig.rules) {
                if (lowerInput.includes(rule)) {
                    response = aiConfig.rules[rule];
                    break;
                }
            }

            setMessages(prev => [...prev, { sender: 'ai', text: response }]);
            setIsTyping(false);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-4 z-40 animate-fade-in-up">
            <div className="w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col">
                <header className="p-4 bg-cyan-600 text-white rounded-t-lg flex justify-between items-center">
                    <h3 className="font-bold">Code Assistant</h3>
                    <button onClick={onClose} className="text-white">&times;</button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <ReactMarkdown components={{ p: 'span' }}>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="text-left">
                            <div className="inline-block p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                                <span className="typing-indicator"><span>.</span><span>.</span><span>.</span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                </div>
            </div>
        </div>
    );
};

const App = () => {
  const [page, setPage] = useState({ name: 'home' });
  const [theme, setTheme] = useState('light');
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);

  const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    console.log('%c👨‍💻 Developed by Yash Dhanani', 'color: teal; font-size: 14px; font-weight: bold;');

    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);
    
    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(html2canvasScript);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes marquee { from { transform: translateX(0%); } to { transform: translateX(-100%); } }
        @keyframes marquee2 { from { transform: translateX(100%); } to { transform: translateX(0%); } }
        .animate-marquee { animation: marquee 90s linear infinite; }
        .animate-marquee2 { animation: marquee2 90s linear infinite; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .footer-fade-in { animation: fade-in-up 0.8s ease-out forwards; }
        @keyframes typing { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
        .typing-indicator span { animation: typing 1s infinite; font-weight: bold; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-fade-in-stagger { opacity: 0; animation: fade-in-up 0.5s ease-out forwards; }
    `;
    document.head.appendChild(style);

    return () => {
        if (tailwindScript.parentNode) document.head.removeChild(tailwindScript);
        if (html2canvasScript.parentNode) document.head.removeChild(html2canvasScript);
        if (style.parentNode) document.head.removeChild(style);
    }
  }, []);

  useEffect(() => {
      if (theme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [theme]);

  const renderPage = () => {
    switch (page.name) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'tutorials':
        return <TutorialsPage setPage={setPage} />;
      case 'tutorial':
        return <TutorialDisplayPage setPage={setPage} tutorialId={page.id} />;
      case 'certificate':
        return <CertificatePage setPage={setPage} tutorialTitle={page.tutorialTitle} />;
      case 'exercises':
        return <ExercisesPage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <Navbar setPage={setPage} theme={theme} toggleTheme={toggleTheme} onLoginClick={() => setAuthModalOpen(true)} />
            <ScrollingBanner setPage={setPage} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <AIAssistantWidget onClick={() => setAiAssistantOpen(prev => !prev)} />
            <AIAssistantModal isOpen={isAiAssistantOpen} onClose={() => setAiAssistantOpen(false)} page={page} />
            {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
            {isAboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}
            <Footer onAboutClick={() => setAboutModalOpen(true)} />
        </div>
    </AuthProvider>
  );
};

export default App;
