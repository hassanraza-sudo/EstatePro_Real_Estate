import React, { useState } from "react";

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculatePayment = (e) => {
    e.preventDefault();

    const principal = parseFloat(loanAmount);
    const annualInterest = parseFloat(interestRate) / 100;
    const years = parseFloat(loanTerm);

    if (isNaN(principal) || isNaN(annualInterest) || isNaN(years)) {
      setMonthlyPayment(null);
      return;
    }

    const monthlyRate = annualInterest / 12;
    const totalPayments = years * 12;

    const monthly =
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -totalPayments));

    setMonthlyPayment(monthly.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 to-slate-400 mt-5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-neutral-400 rounded-2xl shadow-xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🏠 Mortgage Calculator
        </h2>

        <form onSubmit={calculatePayment} className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label className="block text-gray-800 font-serif mb-1">
              Loan Amount (PKR)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 1000000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-gray-800 font-serif mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g. 7.5"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-gray-800 font-serif mb-1">
              Loan Term (Years)
            </label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="e.g. 20"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-80 bg-zinc-600 hover:bg-gray-700 text-white font-serif py-2.5 rounded-lg transition duration-200"
            >
              Calculate Payment
            </button>
          </div>
        </form>

        {/* Result */}
        {monthlyPayment && (
          <div className="mt-8 text-center bg-slate-300 border border-zinc-600 text-slate-800 p-6 rounded-xl shadow-sm transition-all duration-300">
            <p className="text-lg font-serif mb-2">
              Estimated Monthly Payment
            </p>
            <p className="text-3xl font-semibold">PKR {monthlyPayment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculator;
