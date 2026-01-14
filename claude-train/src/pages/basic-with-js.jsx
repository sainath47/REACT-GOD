import React, { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense, createContext, useContext, memo, useReducer, useTransition } from 'react';
import { Search, Plus, X, Filter, TrendingUp, Users, DollarSign, Activity, Trash2, Edit2, Save } from 'lucide-react';

// ==================== CONTEXT API ====================
const ThemeContext = createContext();
const AuthContext = createContext();

// Custom Hook for Theme
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Custom Hook for Auth
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ==================== CUSTOM HOOKS ====================
// Custom Hook: useLocalStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Custom Hook: useDebounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom Hook: useFetch with caching
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      abortControllerRef.current = new AbortController();
      setLoading(true);
      
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = {
          users: 1234,
          revenue: 45678,
          growth: 23.5
        };
        setData(mockData);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url]);

  return { data, loading, error };
};

// ==================== REDUCER FOR STATE MANAGEMENT ====================
const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'TOGGLE_TASK':
      return state.map(task =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
    case 'UPDATE_TASK':
      return state.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task
      );
    default:
      return state;
  }
};

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==================== MEMOIZED COMPONENTS ====================
// React.memo - prevents unnecessary re-renders
const StatCard = memo(({ title, value, icon: Icon, trend, color }) => {
  console.log(`StatCard ${title} rendered`);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm font-medium">{title}</span>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      {trend && (
        <div className="flex items-center mt-2 text-sm text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{trend}% from last month</span>
        </div>
      )}
    </div>
  );
});

// ==================== MAIN COMPONENTS ====================
const TaskItem = memo(({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onUpdate(task.id, { text: editText });
      setIsEditing(false);
    }
  }, [editText, task.id, onUpdate]);

  return (
    <div className={`flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border ${task.completed ? 'opacity-60' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 text-blue-600 rounded"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          className="flex-1 px-3 py-1 border rounded"
          autoFocus
        />
      ) : (
        <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.text}
        </span>
      )}
      
      <span className={`px-2 py-1 text-xs rounded ${
        task.priority === 'high' ? 'bg-red-100 text-red-700' :
        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-green-100 text-green-700'
      }`}>
        {task.priority}
      </span>
      
      {isEditing ? (
        <button onClick={handleSave} className="text-green-600 hover:text-green-800">
          <Save className="w-4 h-4" />
        </button>
      ) : (
        <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800">
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      
      <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-800">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

const Dashboard = () => {
  // State management with useReducer
  const [tasks, dispatch] = useReducer(tasksReducer, [
    { id: 1, text: 'Learn React Hooks', completed: true, priority: 'high' },
    { id: 2, text: 'Build a project', completed: false, priority: 'medium' },
    { id: 3, text: 'Practice code splitting', completed: false, priority: 'low' },
  ]);

  // Various state hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  
  // Custom hooks
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: stats, loading } = useFetch('/api/stats');
  
  // Refs
  const inputRef = useRef(null);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  // useCallback - memoize functions
  const handleAddTask = useCallback(() => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority
      };
      dispatch({ type: 'ADD_TASK', payload: task });
      setNewTask('');
      inputRef.current?.focus();
    }
  }, [newTask, priority]);

  const handleToggle = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, []);

  const handleDelete = useCallback((id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const handleUpdate = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  }, []);

  // useMemo - expensive calculations
  const filteredTasks = useMemo(() => {
    console.log('Filtering tasks...');
    
    let filtered = tasks;
    
    // Filter by status
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }
    
    // Filter by search
    if (debouncedSearch) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [tasks, filter, debouncedSearch]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      active: tasks.filter(t => !t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
    };
  }, [tasks]);

  // Handle search with transition (non-blocking)
  const handleSearchChange = (e) => {
    startTransition(() => {
      setSearchTerm(e.target.value);
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Task Dashboard
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Render count: {renderCount.current}
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Toggle Theme
          </button>
        </div>

        {/* Stats Cards - React.memo in action */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={taskStats.total}
            icon={Activity}
            color="#3b82f6"
          />
          <StatCard
            title="Active"
            value={taskStats.active}
            icon={Users}
            color="#10b981"
          />
          <StatCard
            title="Completed"
            value={taskStats.completed}
            icon={DollarSign}
            trend={12.5}
            color="#8b5cf6"
          />
          <StatCard
            title="High Priority"
            value={taskStats.highPriority}
            icon={TrendingUp}
            color="#ef4444"
          />
        </div>

        {/* API Data Fetching Example */}
        {loading ? (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ) : stats ? (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg mb-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Live Stats (useFetch Hook)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-80">Users</p>
                <p className="text-2xl font-bold">{stats.users.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Revenue</p>
                <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Growth</p>
                <p className="text-2xl font-bold">{stats.growth}%</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Task Input */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAddTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search tasks (debounced)..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isPending && (
                <div className="absolute right-3 top-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-500 text-lg">No tasks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== CODE SPLITTING EXAMPLE ====================
const LazyComponent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="bg-green-100 p-6 rounded-lg border-2 border-green-500">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              🎉 Lazy Loaded Component!
            </h3>
            <p className="text-green-700">
              This component was loaded on demand using React.lazy() and Suspense
            </p>
          </div>
        )
      });
    }, 1000);
  });
});

// ==================== MAIN APP WITH PROVIDERS ====================
export default function App() {
  const [user, setUser] = useState({ name: 'John Doe', role: 'developer' });
  const [theme, setTheme] = useState('light');
  const [showLazy, setShowLazy] = useState(false);

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ user, setUser }}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <div className="min-h-screen">
            <Dashboard />
            
            {/* Code Splitting Demo */}
            <div className="max-w-7xl mx-auto px-8 pb-8">
              <button
                onClick={() => setShowLazy(!showLazy)}
                className="mb-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                {showLazy ? 'Hide' : 'Load'} Lazy Component (Code Splitting Demo)
              </button>
              
              {showLazy && (
                <Suspense fallback={
                  <div className="bg-gray-100 p-6 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                }>
                  <LazyComponent />
                </Suspense>
              )}
            </div>

            {/* Concepts Covered Legend */}
            <div className="max-w-7xl mx-auto px-8 pb-8">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                <h3 className="text-xl font-bold mb-4">✅ React Concepts Demonstrated</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>✓ useState</div>
                  <div>✓ useEffect</div>
                  <div>✓ useCallback</div>
                  <div>✓ useMemo</div>
                  <div>✓ useRef</div>
                  <div>✓ useContext</div>
                  <div>✓ useReducer</div>
                  <div>✓ useTransition</div>
                  <div>✓ Custom Hooks</div>
                  <div>✓ React.memo</div>
                  <div>✓ Error Boundaries</div>
                  <div>✓ Code Splitting</div>
                  <div>✓ Suspense</div>
                  <div>✓ Context API</div>
                  <div>✓ LocalStorage</div>
                  <div>✓ Debouncing</div>
                  <div>✓ API Fetching</div>
                  <div>✓ Cleanup</div>
                </div>
              </div>
            </div>
          </div>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}