import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import Register from './Pages/Register';
import BoardView from './Pages/BoardView';
import API from './api';
import { PlusCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [view, setView] = useState(user ? 'boards' : 'login');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (user) fetchBoards();
  }, [user]);

  async function fetchBoards() {
    try {
      const res = await API.get('/boards/all');
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleLogin(userObj) {
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    setView('boards');
    fetchBoards();
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={2000} />

      <header className="w-full bg-blue-600 text-white to-indigo-600 text-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-wide">Trello Mini</h1>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-medium bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
                {user.name}
              </span>

              <button
                onClick={logout}
                className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setView('login')}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  view === 'login'
                    ? 'bg-white text-blue-700 shadow'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setView('register')}
                className={`px-4 py-2 rounded-lg transition font-semibold shadow ${
                  view === 'register'
                    ? 'bg-white text-blue-700'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>
      <main className="p-6">

        {!user && view === 'login' && (
          <Login
            onLogin={handleLogin}
            switchToRegister={() => setView('register')}
          />
        )}

        {!user && view === 'register' && (
          <Register
            onRegister={handleLogin}
            switchToLogin={() => setView('login')}
          />
        )}

        {user && view === 'boards' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Boards</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {boards.map(board => (
                <div
                  key={board._id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer border border-gray-200 hover:border-blue-400 transition"
                  onClick={() => {
                    setSelectedBoard(board);
                    setView('board');
                  }}
                >
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {board.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">Open board →</p>
                </div>
              ))}

              <NewBoard onCreated={fetchBoards} />
            </div>
          </div>
        )}

        {user && view === 'board' && selectedBoard && (
          <BoardView
            board={selectedBoard}
            goBack={() => {
              setView('boards');
              setSelectedBoard(null);
              fetchBoards();
            }}
          />
        )}
      </main>
    </div>
  );
}

function NewBoard({ onCreated }) {
  const [name, setName] = useState('');

  async function createBoard() {
    if (!name.trim()) return alert("Board name required");
    await API.post('/boards/create', { name });

    setName('');
    onCreated();
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-gray-300 flex flex-col items-center justify-center gap-3">
      <input
        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Board name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button
        onClick={createBoard}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition shadow"
      >
        <PlusCircle size={18} /> Create Board
      </button>
    </div>
  );
}

export default App;