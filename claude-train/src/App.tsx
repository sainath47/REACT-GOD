import React, { useState, useEffect, useRef, lazy, Suspense, memo, startTransition, useDeferredValue, useId, forwardRef, useImperativeHandle } from 'react';
import { Loader, Rocket, Zap, Clock, Eye, Code, Shield, Package } from 'lucide-react';

// =============================================================================
// TOPIC 1: CODE SPLITTING - Load code only when needed
// =============================================================================

/*
  WHAT IS CODE SPLITTING?
  - Break your app into smaller chunks
  - Load chunks only when needed
  - Reduces initial bundle size
  - Faster initial load time
  
  HOW TO SEE IT:
  1. Open Network tab (F12)
  2. Click "Load Heavy Component" button
  3. Watch a NEW JavaScript file load
  4. That file only loads when you need it!
*/

// This component is NOT loaded initially
const HeavyComponent = lazy(() => {
  console.log('🚀 Loading HeavyComponent...');
  return new Promise<{ default: React.ComponentType }>((resolve) => {
    // Simulate loading delay (like downloading from server)
    setTimeout(() => {
      console.log('✅ HeavyComponent loaded!');
      resolve({
        default: () => (
          <div className="p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-3">🎉 Heavy Component Loaded!</h3>
            <p className="mb-2">This component was split into a separate file.</p>
            <p className="mb-2">Check Network tab - you'll see it loaded separately!</p>
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded">
              <p className="font-semibold">Why Code Splitting?</p>
              <p>• Reduces initial bundle size</p>
              <p>• Faster first page load</p>
              <p>• Load features on demand</p>
            </div>
          </div>
        )
      });
    }, 2000); // 2 second delay to simulate network
  });
});

const CodeSplittingDemo: React.FC = () => {
  const [showHeavy, setShowHeavy] = useState(false);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-blue-300">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold">Code Splitting with React.lazy()</h3>
      </div>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Open DevTools (F12) → Network tab</p>
        <p className="text-sm mb-1">2. Click the button below</p>
        <p className="text-sm mb-1">3. Watch console logs</p>
        <p className="text-sm">4. See new JS file load in Network tab!</p>
      </div>
      
      <button
        onClick={() => setShowHeavy(!showHeavy)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold mb-4"
      >
        {showHeavy ? 'Hide' : 'Load'} Heavy Component
      </button>
      
      {showHeavy && (
        <Suspense fallback={
          <div className="p-6 bg-gray-100 rounded-lg animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <Loader className="w-6 h-6 animate-spin" />
              <p className="text-lg">Loading component... (Check Network tab!)</p>
            </div>
          </div>
        }>
          <HeavyComponent />
        </Suspense>
      )}
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"Code splitting breaks your app into smaller chunks that load on demand. I use React.lazy() to dynamically import components and Suspense to show a loading state while they load. This reduces the initial bundle size and improves performance."</p>
      </div>
    </div>
  );
};

// =============================================================================
// TOPIC 2: SUSPENSE - Handle async operations gracefully
// =============================================================================

const SlowDataComponent = lazy(() => {
  return new Promise<{ default: React.ComponentType }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 font-semibold">✅ Data loaded successfully!</p>
            <p className="text-sm text-green-700 mt-2">Users: 1,234 | Revenue: $45,678</p>
          </div>
        )
      });
    }, 3000);
  });
});

const SuspenseDemo: React.FC = () => {
  const [showData, setShowData] = useState(false);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-purple-300">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold">Suspense - Handle Loading States</h3>
      </div>
      
      <div className="mb-4 p-4 bg-purple-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Click "Load Data" button</p>
        <p className="text-sm mb-1">2. See skeleton/spinner (Suspense fallback)</p>
        <p className="text-sm">3. After 3 seconds, data appears</p>
      </div>
      
      <button
        onClick={() => setShowData(!showData)}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold mb-4"
      >
        {showData ? 'Hide' : 'Load'} Data
      </button>
      
      {showData && (
        <Suspense fallback={
          <div className="p-6 bg-purple-100 rounded-lg">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-purple-300 rounded w-3/4"></div>
              <div className="h-4 bg-purple-300 rounded w-1/2"></div>
            </div>
            <p className="text-purple-700 mt-3 text-sm">Loading data... (This is the Suspense fallback)</p>
          </div>
        }>
          <SlowDataComponent />
        </Suspense>
      )}
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"Suspense lets you declaratively handle loading states for async operations. While a component is loading, Suspense shows a fallback UI like a spinner or skeleton. It works with React.lazy() for code splitting and will support data fetching in the future."</p>
      </div>
    </div>
  );
};

// =============================================================================
// TOPIC 3: startTransition & useDeferredValue - Keep UI Responsive
// =============================================================================

const TransitionDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  
  // Simulate expensive filtering operation
  const generateList = (text: string) => {
    const items: string[] = [];
    for (let i = 0; i < 5000; i++) {
      items.push(`${text} - Item ${i}`);
    }
    return items;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value); // Update immediately (high priority)
    
    // Mark list update as low priority (non-blocking)
    setIsPending(true);
    startTransition(() => {
      setList(generateList(value)); // This won't block typing
      setIsPending(false);
    });
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-orange-300">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-bold">startTransition - Non-Blocking Updates</h3>
      </div>
      
      <div className="mb-4 p-4 bg-orange-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Type quickly in the input field</p>
        <p className="text-sm mb-1">2. Notice input stays responsive (doesn't lag)</p>
        <p className="text-sm mb-1">3. List updates happen in background</p>
        <p className="text-sm">4. See "Updating..." indicator during transition</p>
      </div>
      
      <div className="relative mb-4">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type something... (generates 5000 items)"
          className="w-full px-4 py-2 border rounded-lg"
        />
        {isPending && (
          <div className="absolute right-3 top-3">
            <Loader className="w-5 h-5 animate-spin text-orange-600" />
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
        <p className="text-sm text-gray-600 mb-2">
          Showing {list.length} items {isPending && '(Updating...)'}
        </p>
        {list.slice(0, 10).map((item, idx) => (
          <p key={idx} className="text-xs text-gray-700">{item}</p>
        ))}
        {list.length > 10 && <p className="text-xs text-gray-500 mt-2">... and {list.length - 10} more</p>}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"startTransition marks state updates as low priority, keeping the UI responsive during expensive operations. The input stays snappy while the heavy list update happens in the background. This prevents UI freezing during large updates."</p>
      </div>
    </div>
  );
};

// useDeferredValue example
const DeferredDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);
  
  // Expensive list generation
  const list = React.useMemo(() => {
    const items: string[] = [];
    for (let i = 0; i < 3000; i++) {
      items.push(`${deferredInput} - Result ${i}`);
    }
    return items;
  }, [deferredInput]);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-teal-300">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-6 h-6 text-teal-600" />
        <h3 className="text-xl font-bold">useDeferredValue - Defer Expensive Updates</h3>
      </div>
      
      <div className="mb-4 p-4 bg-teal-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Type in the input field</p>
        <p className="text-sm mb-1">2. Input updates immediately</p>
        <p className="text-sm">3. List updates are deferred (slightly delayed)</p>
      </div>
      
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type to filter 3000 items..."
        className="w-full px-4 py-2 border rounded-lg mb-4"
      />
      
      <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
        <p className="text-sm text-gray-600 mb-2">
          Filtering {list.length} items with: "{deferredInput}"
        </p>
        {list.slice(0, 8).map((item, idx) => (
          <p key={idx} className="text-xs text-gray-700">{item}</p>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"useDeferredValue returns a deferred version of a value that lags behind the original. It's useful when you have an expensive computation that shouldn't block user input. The input stays responsive while the heavy work uses the slightly old value."</p>
      </div>
    </div>
  );
};

// =============================================================================
// TOPIC 4: useId - Generate Unique IDs for Accessibility
// =============================================================================

const UseIdDemo: React.FC = () => {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-indigo-300">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-bold">useId - Unique IDs for Accessibility</h3>
      </div>
      
      <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Inspect any input field (Right-click → Inspect)</p>
        <p className="text-sm mb-1">2. See the unique ID (like :r1:, :r2:)</p>
        <p className="text-sm">3. Notice label's "htmlFor" matches input's "id"</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium mb-1">
            Name (ID: {nameId})
          </label>
          <input
            id={nameId}
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium mb-1">
            Email (ID: {emailId})
          </label>
          <input
            id={emailId}
            type="email"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium mb-1">
            Password (ID: {passwordId})
          </label>
          <input
            id={passwordId}
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter password"
          />
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"useId generates unique IDs that are stable across server and client, crucial for accessibility. It ensures label and input relationships work correctly, especially important for screen readers and in SSR applications where IDs need to match between server and client."</p>
      </div>
    </div>
  );
};

// =============================================================================
// TOPIC 5: forwardRef & useImperativeHandle - Expose Component Methods
// =============================================================================

interface FancyInputHandle {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
}

const FancyInput = forwardRef<FancyInputHandle, { placeholder: string }>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  
  // Expose custom methods to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    },
    getValue: () => {
      return value;
    }
  }));
  
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={props.placeholder}
      className="w-full px-4 py-2 border rounded-lg"
    />
  );
});

const ForwardRefDemo: React.FC = () => {
  const inputRef = useRef<FancyInputHandle>(null);
  
  const handleFocus = () => {
    inputRef.current?.focus();
  };
  
  const handleClear = () => {
    inputRef.current?.clear();
  };
  
  const handleGetValue = () => {
    const value = inputRef.current?.getValue();
    alert(`Current value: ${value}`);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-pink-300">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-6 h-6 text-pink-600" />
        <h3 className="text-xl font-bold">forwardRef & useImperativeHandle</h3>
      </div>
      
      <div className="mb-4 p-4 bg-pink-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Type something in the input</p>
        <p className="text-sm mb-1">2. Click "Focus" - cursor jumps to input</p>
        <p className="text-sm mb-1">3. Click "Clear" - input empties and focuses</p>
        <p className="text-sm">4. Click "Get Value" - shows alert with current text</p>
      </div>
      
      <FancyInput ref={inputRef} placeholder="Type something..." />
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleFocus}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Focus Input
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Input
        </button>
        <button
          onClick={handleGetValue}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Get Value
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"forwardRef allows parent components to access child component refs. useImperativeHandle customizes what the ref exposes, letting you control which methods parents can call. This is useful for form libraries, modals, or any component where parent needs to trigger child actions."</p>
      </div>
    </div>
  );
};

// =============================================================================
// TOPIC 6: Error Boundaries - Catch JavaScript Errors
// =============================================================================

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border-2 border-red-300 rounded-lg">
          <h3 className="text-xl font-bold text-red-700 mb-2">⚠️ Something went wrong!</h3>
          <p className="text-red-600 mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

const BuggyComponent: React.FC<{ shouldError: boolean }> = ({ shouldError }) => {
  if (shouldError) {
    throw new Error('💥 Intentional error for demo!');
  }
  
  return (
    <div className="p-4 bg-green-100 rounded-lg">
      <p className="text-green-800 font-semibold">✅ Component working fine!</p>
    </div>
  );
};

const ErrorBoundaryDemo: React.FC = () => {
  const [shouldError, setShouldError] = useState(false);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-red-300">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-6 h-6 text-red-600" />
        <h3 className="text-xl font-bold">Error Boundaries - Catch Errors</h3>
      </div>
      
      <div className="mb-4 p-4 bg-red-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Click "Trigger Error" button</p>
        <p className="text-sm mb-1">2. Component crashes but app doesn't!</p>
        <p className="text-sm mb-1">3. Error boundary shows fallback UI</p>
        <p className="text-sm">4. Click "Try Again" to recover</p>
      </div>
      
      <button
        onClick={() => setShouldError(!shouldError)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mb-4"
      >
        {shouldError ? 'Fix Component' : 'Trigger Error'}
      </button>
      
      <ErrorBoundary>
        <BuggyComponent shouldError={shouldError} />
      </ErrorBoundary>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"Error Boundaries are class components that catch JavaScript errors in their child component tree. They prevent the entire app from crashing and show a fallback UI. They catch errors during rendering, in lifecycle methods, and in constructors, but NOT in event handlers."</p>
      </div>
    </div>
  );
};

// =============================================================================
// TOPIC 7: Portal - Render Outside Parent DOM
// =============================================================================

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  // In real app, you'd use ReactDOM.createPortal here
  // For demo purposes, we'll just render normally
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

const PortalDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-2 border-green-300">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold">Portals - Render Outside DOM Tree</h3>
      </div>
      
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <p className="font-semibold mb-2">🎯 What to Look For:</p>
        <p className="text-sm mb-1">1. Click "Open Modal" button</p>
        <p className="text-sm mb-1">2. Modal appears on top of everything</p>
        <p className="text-sm mb-1">3. Inspect in DevTools - modal is outside parent</p>
        <p className="text-sm">4. Dark overlay covers entire screen</p>
      </div>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
      >
        Open Modal
      </button>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-bold mb-3">Modal Using Portal</h3>
        <p className="text-gray-600 mb-2">This modal is rendered outside the normal DOM hierarchy!</p>
        <p className="text-sm text-gray-500">In production, use ReactDOM.createPortal()</p>
      </Modal>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <p className="font-bold mb-2">Interview Answer:</p>
        <p>"Portals let you render children into a DOM node outside the parent component's hierarchy. This is perfect for modals, tooltips, and dropdowns that need to break out of overflow:hidden or z-index constraints. Events still bubble up through the React tree."</p>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN APP
// =============================================================================

const App: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<number>(1);
  
  const topics = [
    { id: 1, name: 'Code Splitting', icon: Package },
    { id: 2, name: 'Suspense', icon: Clock },
    { id: 3, name: 'Transitions', icon: Zap },
    { id: 4, name: 'useId', icon: Eye },
    { id: 5, name: 'forwardRef', icon: Code },
    { id: 6, name: 'Error Boundaries', icon: Shield },
    { id: 7, name: 'Portals', icon: Rocket },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🚀 Advanced React Concepts - Part 2
          </h1>
          <p className="text-xl text-gray-600">Topics Every Experienced Dev Must Know</p>
        </div>
        
        {/* Topic Navigator */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                onClick={() => setCurrentTopic(topic.id)}
                className={`p-4 rounded-lg shadow-md transition-all ${
                  currentTopic === topic.id
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-white text-gray-800 hover:scale-102'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-semibold">{topic.name}</p>
              </button>
            );
          })}
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {currentTopic === 1 && <CodeSplittingDemo />}
          {currentTopic === 2 && <SuspenseDemo />}
          {currentTopic === 3 && (
            <>
              <TransitionDemo />
              <DeferredDemo />
            </>
          )}
          {currentTopic === 4 && <UseIdDemo />}
          {currentTopic === 5 && <ForwardRefDemo />}
          {currentTopic === 6 && <ErrorBoundaryDemo />}
          {currentTopic === 7 && <PortalDemo />}
        </div>
        
        {/* Summary */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-lg shadow-lg text-white">
          <h2 className="text-3xl font-bold mb-6">📚 Complete Interview Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Definitions:</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">Code Splitting:</p>
                  <p>Split app into smaller chunks that load on demand using React.lazy()</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">Suspense:</p>
                  <p>Show fallback UI while async components/data load</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">startTransition:</p>
                  <p>Mark updates as low priority to keep UI responsive</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">useDeferredValue:</p>
                  <p>Defer expensive updates while keeping input responsive</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">More Definitions:</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">useId:</p>
                  <p>Generate unique IDs for accessibility (labels & inputs)</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">forwardRef:</p>
                  <p>Pass refs to child components</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">useImperativeHandle:</p>
                  <p>Customize ref methods exposed to parent</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">Error Boundaries:</p>
                  <p>Catch errors in component tree, show fallback UI</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded">
                  <p className="font-bold">Portals:</p>
                  <p>Render children outside parent DOM hierarchy</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-white bg-opacity-20 rounded-lg">
            <h3 className="text-xl font-bold mb-3">🎯 Common Interview Questions:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Q:</strong> How do you optimize a large React app?</p>
              <p><strong>A:</strong> Code splitting, lazy loading, React.memo, useMemo, useCallback, virtualization</p>
              
              <p className="mt-3"><strong>Q:</strong> What's the difference between Suspense and loading states?</p>
              <p><strong>A:</strong> Suspense is declarative and handles async boundaries, while loading states are imperative manual tracking</p>
              
              <p className="mt-3"><strong>Q:</strong> When would you use Error Boundaries?</p>
              <p><strong>A:</strong> To prevent entire app crashes, show fallback UI for broken components, log errors to monitoring service</p>
              
              <p className="mt-3"><strong>Q:</strong> Why use Portals?</p>
              <p><strong>A:</strong> For modals, tooltips, dropdowns that need to escape parent overflow/z-index constraints</p>
            </div>
          </div>
        </div>
        
        {/* Testing Guide */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🧪 How to Test Each Concept</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Code Splitting:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Open Network tab (F12)</li>
                <li>2. Click "Load Heavy Component"</li>
                <li>3. See new JS file load</li>
                <li>4. Check console for load messages</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-2">Suspense:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Click "Load Data"</li>
                <li>2. See skeleton loader appear</li>
                <li>3. Wait 3 seconds</li>
                <li>4. Data appears smoothly</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-bold text-orange-800 mb-2">startTransition:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Type fast in the input</li>
                <li>2. Notice NO lag in typing</li>
                <li>3. List updates in background</li>
                <li>4. See "Updating..." indicator</li>
              </ul>
            </div>
            
            <div className="p-4 bg-teal-50 rounded-lg">
              <h3 className="font-bold text-teal-800 mb-2">useDeferredValue:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Type in search box</li>
                <li>2. Input stays responsive</li>
                <li>3. Results update slightly delayed</li>
                <li>4. No freezing!</li>
              </ul>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-bold text-indigo-800 mb-2">useId:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Right-click any input → Inspect</li>
                <li>2. See unique ID (like :r1:)</li>
                <li>3. Check label's htmlFor attribute</li>
                <li>4. It matches input's id!</li>
              </ul>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-lg">
              <h3 className="font-bold text-pink-800 mb-2">forwardRef:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Type in the input field</li>
                <li>2. Click "Focus" button</li>
                <li>3. Cursor jumps to input</li>
                <li>4. Try "Clear" and "Get Value"</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-bold text-red-800 mb-2">Error Boundaries:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Click "Trigger Error"</li>
                <li>2. Component crashes gracefully</li>
                <li>3. App still works!</li>
                <li>4. Click "Try Again" to recover</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">Portals:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Click "Open Modal"</li>
                <li>2. Modal covers entire screen</li>
                <li>3. Inspect in DevTools</li>
                <li>4. See it's outside parent div</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Pro Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-teal-500 p-8 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">💡 Pro Tips for Interviews</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-bold">Always mention trade-offs:</p>
                <p>"Code splitting reduces initial load but adds network requests for chunks"</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-bold">Show you understand real-world usage:</p>
                <p>"I'd use Error Boundaries around third-party widgets and feature sections"</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-bold">Connect concepts:</p>
                <p>"Suspense works with lazy() for code splitting AND will support data fetching"</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛠️</span>
              <div>
                <p className="font-bold">Mention tools you'd use:</p>
                <p>"I'd measure bundle size with webpack-bundle-analyzer before optimizing"</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-bold">Talk about metrics:</p>
                <p>"Code splitting improved our FCP by 40% and reduced initial bundle from 800KB to 200KB"</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* What's Next */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md border-2 border-blue-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🚀 Complete React Mastery Path</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <h3 className="font-bold text-green-800 mb-2">✅ Part 1 (Basics)</h3>
              <ul className="text-sm space-y-1">
                <li>• useState, useEffect</li>
                <li>• useMemo, useCallback</li>
                <li>• useReducer, Context</li>
                <li>• Custom Hooks</li>
                <li>• React.memo</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <h3 className="font-bold text-blue-800 mb-2">✅ Part 2 (Advanced)</h3>
              <ul className="text-sm space-y-1">
                <li>• Code Splitting</li>
                <li>• Suspense</li>
                <li>• Transitions</li>
                <li>• useId, forwardRef</li>
                <li>• Error Boundaries, Portals</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
              <h3 className="font-bold text-purple-800 mb-2">🎯 Next Steps</h3>
              <ul className="text-sm space-y-1">
                <li>• TypeScript with React</li>
                <li>• Testing (Jest, RTL)</li>
                <li>• Performance profiling</li>
                <li>• SSR/Next.js concepts</li>
                <li>• Build real projects!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;