
import React, { useState, useEffect, useCallback } from 'react';
import { IOutputs, ICommunityPost, ITitleSuggestion } from './types';
import { generateContent, generateCommunityPost } from './services/geminiService';
import ApiKeyInput from './components/ApiKeyInput';
import OutputCard from './components/OutputCard';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [topic, setTopic] = useState<string>('Heart attack symptoms in women over 60');
  const [script, setScript] = useState<string>('');
  const [outputs, setOutputs] = useState<IOutputs | null>(null);
  const [communityPost, setCommunityPost] = useState<ICommunityPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCommunityLoading, setIsCommunityLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleGenerateContent = useCallback(async () => {
    if (!apiKey) {
      setError('Vui lòng nhập API Key của bạn.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputs(null);
    setCommunityPost(null);

    try {
      const result = await generateContent(apiKey, topic, script);
      setOutputs(result);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, topic, script]);
  
  const handleGenerateCommunityPost = useCallback(async () => {
    if (!apiKey || !outputs?.fullScript) {
      setError('Cần tạo nội dung chính trước khi tạo bài đăng cộng đồng.');
      return;
    }
    setIsCommunityLoading(true);
    setError(null);
    setCommunityPost(null);

    try {
        const result = await generateCommunityPost(apiKey, topic, outputs.fullScript);
        setCommunityPost(result);
    } catch (err: any) {
        setError(err.message || 'Không thể tạo bài đăng cộng đồng.');
    } finally {
        setIsCommunityLoading(false);
    }
  }, [apiKey, topic, outputs]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">App Ky Design AI - Senior Forward Health</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thông tin đầu vào</h2>
            <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
            <div className="mb-4">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Chủ đề chính
              </label>
              <textarea
                id="topic"
                rows={2}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="script" className="block text-sm font-medium text-gray-700 mb-2">
                Kịch bản gốc (tùy chọn)
              </label>
              <textarea
                id="script"
                rows={8}
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Dán kịch bản gốc vào đây nếu có..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <div className="flex flex-col space-y-4">
                <button
                onClick={handleGenerateContent}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors"
                >
                {isLoading ? <><SpinnerIcon /> <span className="ml-2">Đang xử lý...</span></> : '1. Bắt đầu sáng tạo'}
                </button>

                <button
                    onClick={handleGenerateCommunityPost}
                    disabled={!outputs || isCommunityLoading || isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isCommunityLoading ? <><SpinnerIcon /> <span className="ml-2">Đang tạo...</span></> : '2. Tạo Bài đăng Cộng đồng'}
                </button>
            </div>
          </div>

          {/* Right Column: Outputs */}
          <div className="transition-opacity duration-500" style={{ opacity: isLoading ? 0.5 : 1 }}>
            {!outputs && !isLoading && (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                <h3 className="text-lg font-semibold">Kết quả sẽ hiển thị ở đây</h3>
                <p className="mt-2">Điền thông tin và nhấn "Bắt đầu sáng tạo" để AI làm việc.</p>
              </div>
            )}
            
            {outputs?.keywordAnalysis && (
                <OutputCard title="Phân tích Từ khóa" isLoading={isLoading} copyText={JSON.stringify(outputs.keywordAnalysis, null, 2)}>
                    <p className="text-sm text-gray-600 mb-4">{outputs.keywordAnalysis.explanation}</p>
                    <div>
                        <h4 className="font-semibold text-gray-700">Main Keywords:</h4>
                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{outputs.keywordAnalysis.main.join(', ')}</p>
                    </div>
                    <div className="mt-2">
                        <h4 className="font-semibold text-gray-700">LSI Keywords:</h4>
                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{outputs.keywordAnalysis.lsi.join(', ')}</p>
                    </div>
                    <div className="mt-2">
                        <h4 className="font-semibold text-gray-700">Long-tail Questions:</h4>
                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{outputs.keywordAnalysis.questions.join(', ')}</p>
                    </div>
                </OutputCard>
            )}

            {(outputs?.videoHook || isLoading) && (
                <OutputCard title="Video Hook" isLoading={isLoading} copyText={outputs?.videoHook}>
                    <p className="text-gray-800 whitespace-pre-wrap">{outputs?.videoHook}</p>
                </OutputCard>
            )}
            
            {(outputs?.titleSuggestions || isLoading) && (
                <OutputCard title="Đề xuất Tiêu đề" isLoading={isLoading}>
                    <div className="space-y-4">
                        {outputs?.titleSuggestions.map((s: ITitleSuggestion, i: number) => (
                            <div key={i} className="border border-gray-200 p-3 rounded-md">
                                <p className="font-semibold text-indigo-700">{s.title}</p>
                                <p className="text-sm mt-1"><strong className="text-green-600">Ưu điểm:</strong> {s.pros}</p>
                                <p className="text-sm"><strong className="text-red-600">Nhược điểm:</strong> {s.cons}</p>
                            </div>
                        ))}
                    </div>
                </OutputCard>
            )}

            {(outputs?.videoDescription || isLoading) && (
                <OutputCard title="Mô tả Video" isLoading={isLoading} copyText={outputs?.videoDescription}>
                     <p className="text-gray-800 whitespace-pre-wrap">{outputs?.videoDescription}</p>
                </OutputCard>
            )}

            {(outputs?.videoTags || isLoading) && (
                 <OutputCard title="Thẻ Tag" isLoading={isLoading} copyText={outputs?.videoTags}>
                     <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{outputs?.videoTags}</p>
                </OutputCard>
            )}
            
            {(outputs?.fullScript || isLoading) && (
                <OutputCard title="Kịch bản hoàn chỉnh" isLoading={isLoading} copyText={outputs?.fullScript}>
                     <p className="text-gray-800 whitespace-pre-wrap max-h-60 overflow-y-auto">{outputs?.fullScript}</p>
                </OutputCard>
            )}
            
            {(outputs?.splitScript || isLoading) && (
                <OutputCard title="Kịch bản đã chia (90 câu/phần)" isLoading={isLoading}>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {outputs?.splitScript.map((section, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded">
                                <OutputCard title={`Phần ${index + 1}`} isLoading={false} copyText={section.substring(section.indexOf(":") + 1).trim()}>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{section.substring(section.indexOf(":") + 1).trim()}</p>
                                </OutputCard>
                            </div>
                        ))}
                    </div>
                </OutputCard>
            )}

            {(outputs?.qualityReport || isLoading) && (
                <OutputCard title="Báo cáo Chất lượng" isLoading={isLoading} copyText={outputs?.qualityReport}>
                     <p className="text-gray-800 whitespace-pre-wrap">{outputs?.qualityReport}</p>
                </OutputCard>
            )}
            
            {(communityPost || isCommunityLoading) && (
                 <OutputCard title="Bài đăng Cộng đồng" isLoading={isCommunityLoading} copyText={communityPost?.postText}>
                    <p className="text-gray-800 whitespace-pre-wrap mb-4">{communityPost?.postText}</p>
                    {communityPost?.pollOptions && (
                        <div>
                            <h4 className="font-semibold text-gray-700">Lựa chọn thăm dò:</h4>
                            <ul className="list-disc list-inside mt-2 text-gray-800">
                                {communityPost.pollOptions.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                        </div>
                    )}
                 </OutputCard>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
