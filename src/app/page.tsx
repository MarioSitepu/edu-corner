"use client";

import { useState } from "react";

export default function Home() {
  const [nama, setNama] = useState("");
  const [citaCita, setCitaCita] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<{ nama: string; citaCita: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nama.trim() && citaCita.trim()) {
      const newData = { nama: nama.trim(), citaCita: citaCita.trim() };
      setData([...data, newData]);
      setNama("");
      setCitaCita("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Edu-Corner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Masukkan nama dan cita-cita Anda
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Input */}
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Nama Anda
              </label>
              <input
                type="text"
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                required
              />
            </div>

            {/* Cita-cita Input */}
            <div>
              <label
                htmlFor="citaCita"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Cita-cita Anda
              </label>
              <textarea
                id="citaCita"
                value={citaCita}
                onChange={(e) => setCitaCita(e.target.value)}
                placeholder="Masukkan cita-cita Anda"
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Simpan Data
            </button>
          </form>

          {/* Success Message */}
          {submitted && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg text-center animate-fade-in">
              ✓ Data berhasil disimpan!
            </div>
          )}
        </div>

        {/* Data List */}
        {data.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Data yang Tersimpan
            </h2>
            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 dark:bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {item.nama}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Cita-cita:</span> {item.citaCita}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
