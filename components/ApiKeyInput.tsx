
import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => {
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('geminiApiKey', newKey);
  };

  return (
    <div className="mb-6">
      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
        Gemini API Key
      </label>
      <input
        type="password"
        id="apiKey"
        name="apiKey"
        value={apiKey}
        onChange={handleApiKeyChange}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Dán API Key của bạn vào đây"
      />
    </div>
  );
};

export default ApiKeyInput;
