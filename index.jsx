import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const BACKEND_URL = "https://exambackend-52h2.onrender.com";

// ------------------ WELCOME PAGE ------------------
function Welcome() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400 animate-gradient">
      <img src="https://raw.githubusercontent.com/ideolixlearninghub/ideolix-web/main/ideolix%20LOGO.jpg" className="w-40 mb-8 animate-bounce" />
      <h1 className="text-5xl font-bold text-white mb-4 text-center">Ideolix Learning Hub</h1>
      <p className="text-white text-lg mb-8 text-center">Practice, Assess, and Excel in Any Curriculum!</p>
      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200">Login</Link>
        <Link to="/register" className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200">Register</Link>
      </div>
    </div>
  );
}

// ------------------ REGISTER PAGE ------------------
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) navigate("/login");
    else setMessage(data.error);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="border p-2 rounded" required />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
}

// ------------------ LOGIN PAGE ------------------
function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setUser({ email });
      navigate("/dashboard");
    } else setMessage(data.error);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 rounded" required />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Login</button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
}

// ------------------ DASHBOARD ------------------
function Dashboard({ user }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white gap-6">
      <h1 className="text-4xl font-bold">Welcome, {user.email}</h1>
      <div className="flex gap-4">
        <Link to="/practice" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-200">Practice</Link>
        <Link to="/assessment" className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow hover:bg-gray-200">Assessment</Link>
      </div>
    </div>
  );
}

// ------------------ PRACTICE PAGE ------------------
function Practice() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch(`${BACKEND_URL}/practice`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        curriculum: "nigerian",
        grade: "grade3",
        subject: "Mathematics",
        topics: ["Algebra","Geometry"],
        count_per_topic: 5
      })
    });
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Practice Questions</h2>
      <button onClick={fetchQuestions} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4">Load Questions</button>
      {loading && <p>Loading...</p>}
      <ul className="space-y-4">
        {questions.map((q,i) => (
          <li key={i} className="p-4 border rounded shadow bg-white">{q.question}</li>
        ))}
      </ul>
    </div>
  );
}

// ------------------ APP ------------------
function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Welcome />} />
        <Route path="/practice" element={user ? <Practice /> : <Welcome />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
