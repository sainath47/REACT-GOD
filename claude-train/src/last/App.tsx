  import React, { useState, useEffect, useCallback, useMemo, useRef, useReducer, createContext, useContext, memo } from 'react';
  import { Play, BookOpen, Code2, Zap, Brain, Target, Trophy } from 'lucide-react';

  // =============================================================================
  // LEVEL 1: ABSOLUTE BASICS - Understanding React & TypeScript from scratch
  // =============================================================================

  // What is a Component? A function that returns JSX
  const WelcomeMessage: React.FC = () => {
    return <h1 className="text-2xl font-bold text-blue-600">Hello World</h1>;
  };

  // Props - Passing Data to Components
  interface GreetingProps {
    name: string;
    age: number;
    isStudent?: boolean;
  }

  const Greeting: React.FC<GreetingProps> = ({ name, age, isStudent = false }) => {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-lg">Hi <strong>{name}</strong>, you are {age} years old</p>
        {isStudent && <p className="text-sm text-gray-600">Student status: Active</p>}
      </div>
    );
  };

  // State - Making Components Interactive
  const CounterBasic: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border-2 border-blue-300">
        <h3 className="text-xl font-bold mb-4">Basic Counter (State)</h3>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={decrement} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            -
          </button>
          <span className="text-4xl font-bold text-blue-600">{count}</span>
          <button onClick={increment} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            +
          </button>
        </div>
        <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Reset
        </button>
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p><strong>What is happening:</strong></p>
          <p>• count is state - it starts at 0</p>
          <p>• When you click +, setCount runs</p>
          <p>• React sees state changed and re-renders</p>
          <p>• The new count value appears on screen</p>
        </div>
      </div>
    );
  };

  // Complex State - Objects & Arrays
  interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }

  const TodoListBasic: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    
    const addTodo = () => {
      if (inputValue.trim() === '') return;
      
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      // Always use key prop for list items => [{id,text,completed},{id,text,completed},.....]
      
      setTodos([...todos, newTodo]); 
      // Never mutate state directly - use spread operator
      setInputValue('');
    };
    
    const toggleTodo = (id: number) => {
      setTodos(todos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      ));
    };
    
    const deleteTodo = (id: number) => {
      setTodos(todos.filter(todo => todo.id !== id));
    };
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border-2 border-green-300">
        <h3 className="text-xl font-bold mb-4">Todo List (Complex State)</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button onClick={addTodo} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Add
          </button>
        </div>
        
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No todos yet. Add one above!</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5"
                />
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p><strong>Key Concepts:</strong></p>
          <p>• State can be arrays or objects</p>
          <p>• Use .map() to render lists</p>
          <p>• Always use key prop for list items</p>
          <p>• Never mutate state directly - use spread operator</p>
        </div>
      </div>
    );
  };

  // =============================================================================
  // LEVEL 2: INTERMEDIATE - Side Effects & Performance
  // =============================================================================


  // the below functional componet defines all the life cycle methods
  const EffectExample: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    
    useEffect(() => {
      console.log('Component rendered!');
    });// since no dependency array , thats why it will be executed after every render
    
    useEffect(() => {
      console.log('Component mounted (first render only)');
      document.title = 'React Learning';
    }, []); // it will be executed at the mount(means intially)
    
    useEffect(() => {
      console.log(`Count changed to: ${count}`);
      document.title = `Count: ${count}`;
    }, [count]);
    
    useEffect(() => {
      const timer = setInterval(() => {
        console.log('Timer tick');
      }, 1000);
      
      return () => {
        clearInterval(timer);
        console.log('Timer cleaned up');
      };
    }, []);
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border-2 border-purple-300">
        <h3 className="text-xl font-bold mb-4">useEffect Hook</h3>
        <p className="mb-4">Count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Increment
        </button>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p><strong>useEffect Rules:</strong></p>
          <p>• No dependencies: runs every render</p>
          <p>• Empty []: runs once on mount</p>
          <p>• [count]: runs when count changes</p>
          <p>• Return function: cleanup</p>
        </div>
      </div>
    );
  };

  const MemoExample: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);
    
    const total = useMemo(() => {
      console.log('Calculating total...');
      return items.reduce((sum, item) => sum + item, 0);
    }, [items]);
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border-2 border-orange-300">
        <h3 className="text-xl font-bold mb-4">useMemo Hook</h3>
        <p className="mb-2">Items: {items.join(', ')}</p>
        <p className="mb-2 text-lg font-bold">Total: {total}</p>
        <p className="mb-4">Count: {count}</p>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Increment Count
          </button>
          <button
            onClick={() => setItems([...items, items.length + 1])}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Item
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p><strong>When to use useMemo:</strong></p>
          <p>• Expensive calculations</p>
          <p>• Filtering large arrays</p>
          <p>• Preventing unnecessary re-renders</p>
        </div>
      </div>
    );
  };

  interface ChildProps {
    onClick: () => void;
    label: string;
  }

  const ChildComponent = memo<ChildProps>(({ onClick, label }) => {
    console.log(`${label} rendered`);
    return (
      <button onClick={onClick} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
        {label}
      </button>
    );
  });

  const CallbackExample: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [other, setOther] = useState<number>(0);
    
    const handleClick = useCallback(() => {
      setCount(c => c + 1);
    }, []);
    
    const handleOther = useCallback(() => {
      setOther(o => o + 1);
    }, []);
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border-2 border-indigo-300">
        <h3 className="text-xl font-bold mb-4">useCallback Hook</h3>
        <p className="mb-4">Count: {count} | Other: {other}</p>
        
        <div className="flex gap-2">
          <ChildComponent onClick={handleClick} label="Increment Count" />
          <ChildComponent onClick={handleOther} label="Increment Other" />
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p><strong>useCallback explained:</strong></p>
          <p>• Memoizes function reference</p>
          <p>• Useful with React.memo</p>
          <p>• Prevents child re-renders</p>
        </div>
      </div>
    );
  };

  // =============================================================================
  // LEVEL 3: ADVANCED - Real-World Patterns
  // =============================================================================

  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }

  type CartAction = 
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'REMOVE_ITEM'; payload: number }
    | { type: 'CLEAR_CART' };

  const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
    switch (action.type) {
      case 'ADD_ITEM':
        const existing = state.find(item => item.id === action.payload.id);
        if (existing) {
          return state.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...state, { ...action.payload, quantity: 1 }];
        
      case 'REMOVE_ITEM':
        return state.filter(item => item.id !== action.payload);
        
      case 'CLEAR_CART':
        return [];
        
      default:
        return state;
    }
  };

  const ShoppingCart: React.FC = () => {
    const [cart, dispatch] = useReducer(cartReducer, []);
    
    const products = [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Mouse', price: 29 },
      { id: 3, name: 'Keyboard', price: 79 },
    ];
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border-2 border-pink-300">
        <h3 className="text-xl font-bold mb-4">Shopping Cart (useReducer)</h3>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Products:</h4>
          <div className="space-y-2">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{product.name} - ${product.price}</span>
                <button
                  onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Cart:</h4>
          {cart.length === 0 ? (
            <p className="text-gray-400">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span>{item.name} x {item.quantity}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${item.price * item.quantity}</span>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                        className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-3 bg-green-100 rounded font-bold">
                <span>Total:</span>
                <span>${total}</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear Cart
              </button>
            </>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p><strong>useReducer vs useState:</strong></p>
          <p>• useState: Simple state</p>
          <p>• useReducer: Complex state with actions</p>
        </div>
      </div>
    );
  };

  interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  }

  const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

  const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
  };

  const ThemedComponent: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    
    return (
      <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <p className="mb-2">Current theme: <strong>{theme}</strong></p>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>
      </div>
    );
  };

  const ContextExample: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    
    const toggleTheme = useCallback(() => {
      setTheme(t => t === 'light' ? 'dark' : 'light');
    }, []);
    
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="p-6 bg-white rounded-lg shadow-md border-2 border-teal-300">
          <h3 className="text-xl font-bold mb-4">Context API</h3>
          <ThemedComponent />
          
          <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
            <p><strong>Context API:</strong></p>
            <p>• Share data across component tree</p>
            <p>• Good for theme, auth, language</p>
          </div>
        </div>
      </ThemeContext.Provider>
    );
  };

  function useToggle(initialValue: boolean = false): [boolean, () => void] {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue(v => !v), []);
    return [value, toggle];
  }

  function useInputValue(initialValue: string = ''): [string, (e: React.ChangeEvent<HTMLInputElement>) => void, () => void] {
    const [value, setValue] = useState(initialValue);
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    }, []);
    const reset = useCallback(() => setValue(initialValue), [initialValue]);
    return [value, onChange, reset];
  }

// the above is the custom hook

  const CustomHooksExample: React.FC = () => {
    const [isVisible, toggleVisible] = useToggle(false);
    const [name, handleNameChange, resetName] = useInputValue('');
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border-2 border-yellow-300">
        <h3 className="text-xl font-bold mb-4">Custom Hooks</h3>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={toggleVisible}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              {isVisible ? 'Hide' : 'Show'} Content
            </button>
            {isVisible && (
              <p className="mt-2 p-3 bg-purple-50 rounded">This content is toggled!</p>
            )}
          </div>
          
          <div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              className="px-4 py-2 border rounded mr-2"
            />
            <button
              onClick={resetName}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
            <p className="mt-2">Hello, {name || 'stranger'}!</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p><strong>Custom Hooks:</strong></p>
          <p>• Extract reusable logic</p>
          <p>• Must start with use prefix</p>
          <p>• Can use other hooks inside</p>
        </div>
      </div>
    );
  };

  // Main Dashboard
  const LearningPath: React.FC = () => {
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    
    const levels = [
      {
        level: 1,
        title: 'Absolute Basics',
        icon: BookOpen,
        color: 'blue',
        lessons: [
          { name: 'Components', description: 'What is a component' },
          { name: 'Props', description: 'Passing data' },
          { name: 'State', description: 'Interactive components' },
          { name: 'Complex State', description: 'Objects and arrays' },
        ]
      },
      {
        level: 2,
        title: 'Intermediate',
        icon: Zap,
        color: 'purple',
        lessons: [
          { name: 'useEffect', description: 'Side effects' },
          { name: 'useMemo', description: 'Optimize calculations' },
          { name: 'useCallback', description: 'Optimize functions' },
        ]
      },
      {
        level: 3,
        title: 'Advanced',
        icon: Brain,
        color: 'pink',
        lessons: [
          { name: 'useReducer', description: 'Complex state' },
          { name: 'Context API', description: 'Global state' },
          { name: 'Custom Hooks', description: 'Reusable logic' },
        ]
      }
    ];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h1 className="text-5xl font-bold text-gray-800">
                React + TypeScript Mastery
              </h1>
            </div>
            <p className="text-xl text-gray-600">From Zero to Interview-Ready Developer</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {levels.map((lvl) => {
              const Icon = lvl.icon;
              return (
                <button
                  key={lvl.level}
                  onClick={() => setCurrentLevel(lvl.level)}
                  className={`p-6 rounded-xl shadow-lg transition-all ${
                    currentLevel === lvl.level
                      ? 'bg-blue-500 text-white scale-105'
                      : 'bg-white text-gray-800 hover:scale-102'
                  }`}
                >
                  <Icon className="w-12 h-12 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold mb-2">Level {lvl.level}</h3>
                  <p className="text-lg">{lvl.title}</p>
                  <div className="mt-4 text-sm">
                    {lvl.lessons.map((lesson, idx) => (
                      <p key={idx} className="mb-1">✓ {lesson.name}</p>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="space-y-8">
            {currentLevel === 1 && (
              <>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
                  <h2 className="text-3xl font-bold mb-2">Level 1: Absolute Basics</h2>
                  <p className="text-lg">Understanding React and TypeScript fundamentals</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold text-lg mb-2">Lesson 1: Components</h4>
                    <WelcomeMessage />
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold text-lg mb-2">Lesson 2: Props</h4>
                    <Greeting name="Sarah" age={25} isStudent={true} />
                  </div>
                </div>
                <CounterBasic />
                <TodoListBasic />
              </>
            )}
            
            {currentLevel === 2 && (
              <>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
                  <h2 className="text-3xl font-bold mb-2">Level 2: Intermediate</h2>
                  <p className="text-lg">Performance optimization and side effects</p>
                </div>
                <EffectExample />
                <div className="grid md:grid-cols-2 gap-6">
                  <MemoExample />
                  <CallbackExample />
                </div>
              </>
            )}
            
            {currentLevel === 3 && (
              <>
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg text-white shadow-lg">
                  <h2 className="text-3xl font-bold mb-2">Level 3: Advanced</h2>
                  <p className="text-lg">Real-world patterns and complex state</p>
                </div>
                <ShoppingCart />
                <div className="grid md:grid-cols-2 gap-6">
                  <ContextExample />
                  <CustomHooksExample />
                </div>
              </>
            )}
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-green-500 to-teal-500 p-8 rounded-lg shadow-lg text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-8 h-8" />
              Interview Cheat Sheet
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Must Know Concepts:</h3>
                <ul className="space-y-2">
                  <li>✓ Component: Function that returns JSX</li>
                  <li>✓ Props: Input to components</li>
                  <li>✓ State: Data that can change</li>
                  <li>✓ useEffect: Side effects</li>
                  <li>✓ useMemo: Memoize calculations</li>
                  <li>✓ useCallback: Memoize functions</li>
                  <li>✓ useReducer: Complex state</li>
                  <li>✓ Context: Share data globally</li>
                  <li>✓ Custom Hooks: Reusable logic</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Common Questions:</h3>
                <ul className="space-y-2">
                  <li><strong>Q:</strong> What is React?<br/>
                    <strong>A:</strong> JS library for building UIs</li>
                  <li><strong>Q:</strong> Props vs State?<br/>
                    <strong>A:</strong> Props from parent, State is internal</li>
                  <li><strong>Q:</strong> When to use useEffect?<br/>
                    <strong>A:</strong> API calls, subscriptions, timers</li>
                  <li><strong>Q:</strong> useMemo vs useCallback?<br/>
                    <strong>A:</strong> useMemo = value, useCallback = function</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default LearningPath;