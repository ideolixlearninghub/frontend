function Assessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch(`${BACKEND_URL}/assessment`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        curriculum: "nigerian",
        grade: "grade5",
        subject: "Mathematics",
        total_questions: 70
      })
    });
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  const handleAnswer = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch(`${BACKEND_URL}/submit_assessment`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ answers })
    });
    const data = await res.json();
    setScore(data.score);
    setSubmitted(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Assessment Mode</h2>
      {!questions.length && !loading && (
        <button onClick={fetchQuestions} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Load 70 Questions
        </button>
      )}
      {loading && <p>Loading questions...</p>}
      {questions.length > 0 && !submitted && (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="p-4 border rounded bg-white">
              <p className="font-semibold">{i + 1}. {q.question}</p>
              {q.choices ? (
                q.choices.map((choice, j) => (
                  <label key={j} className="flex items-center gap-2">
                    <input
                      type={q.type === "mcq_multi" ? "checkbox" : "radio"}
                      name={`q${i}`}
                      value={choice}
                      onChange={e => handleAnswer(i, e.target.value)}
                    />
                    {choice}
                  </label>
                ))
              ) : (
                <input type="text" className="border p-2 rounded w-full mt-2" onChange={e => handleAnswer(i, e.target.value)} />
              )}
            </div>
          ))}
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit Assessment</button>
        </div>
      )}
      {submitted && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="text-2xl font-bold mb-2">Your Score: {score}%</h3>
          {score >= 85 ? <p className="text-green-700 font-semibold">Congratulations! You are eligible for the certificate 🎉</p> :
            <p className="text-red-700 font-semibold">You did not meet the 85% threshold. Keep practicing!</p>}
        </div>
      )}
    </div>
  );
}
