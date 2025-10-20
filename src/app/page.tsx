"use client";

import { useState } from "react";

type FoodItem = {
  name: string;
  quantity: string;
  protein: number;
};

const mockAnalysis: FoodItem[] = [
  { name: "🍗 Chicken Breast", quantity: "150g", protein: 45 },
  { name: "🍚 Cooked Rice", quantity: "200g", protein: 4 },
  { name: "🥗 Salad", quantity: "100g", protein: 1 },
];

const proteinGoal = 100;

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodItem[] | null>(null);
  const [dailyTotal, setDailyTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setIsLoading(true);
        setAnalysis(null);
        // Simulate AI analysis
        setTimeout(() => {
          const mealProtein = mockAnalysis.reduce(
            (sum, item) => sum + item.protein,
            0
          );
          setAnalysis(mockAnalysis);
          setDailyTotal((prevTotal) => prevTotal + mealProtein);
          setIsLoading(false);
        }, 2000);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const remainingProtein = Math.max(0, proteinGoal - dailyTotal);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          AI Protein Tracker
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Upload a photo of your meal to estimate your protein intake.
        </p>

        <div className="mb-8">
          <label
            htmlFor="meal-upload"
            className="cursor-pointer w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {uploadedImage ? "Choose another image" : "Click to upload a photo"}
          </label>
          <input
            id="meal-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {isLoading && (
          <div className="text-center">
            <p className="text-lg font-semibold">Analyzing your meal...</p>
            <div className="mt-4 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {uploadedImage && !isLoading && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Your Meal</h2>
            <img
              src={uploadedImage}
              alt="Uploaded meal"
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {analysis && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Protein Analysis
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b dark:border-gray-600">Food Name</th>
                  <th className="py-2 px-4 border-b dark:border-gray-600">Quantity</th>
                  <th className="py-2 px-4 border-b dark:border-gray-600 text-right">Protein (g)</th>
                </tr>
              </thead>
              <tbody>
                {analysis.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{item.name}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{item.quantity}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700 text-right">{item.protein}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="py-2 px-4 font-bold text-lg">Total for this meal:</td>
                  <td className="py-2 px-4 font-bold text-lg text-right">
                    {analysis.reduce((sum, item) => sum + item.protein, 0)}g
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Daily Progress</h2>
          <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
            {dailyTotal}g / {proteinGoal}g
          </p>
          {dailyTotal > 0 && (
            <p className="text-lg">
              {remainingProtein > 0
                ? `You need ${remainingProtein}g more protein to reach your daily target.`
                : "Congratulations! You've reached your protein goal!"}
            </p>
          )}
        </div>

        {remainingProtein > 0 && dailyTotal > 0 && (
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-center mb-4">High-Protein Suggestions</h3>
                <div className="flex justify-center gap-4 text-sm">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Paneer</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Tofu</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Lentils</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Chicken Breast</span>
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
