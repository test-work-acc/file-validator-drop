import FileUploader from '@/components/FileUploader';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

// TODO: Замените на ваш реальный n8n webhook URL
const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/your-webhook-id';

const Index = () => {
  const [urlParams, setUrlParams] = useState({ chat_id: '', timestamp: '' });

  useEffect(() => {
    // Получаем параметры из URL при загрузке страницы
    const searchParams = new URLSearchParams(window.location.search);
    setUrlParams({
      chat_id: searchParams.get('chat_id') || '',
      timestamp: searchParams.get('timestamp') || ''
    });
  }, []);

  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
    console.log('URL параметры:', urlParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Загрузите файл для проверки
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите документ в формате PDF, TIFF, JPEG или PNG для анализа и проверки
          </p>
        </div>

        {/* Информация о пользователе из URL */}
        {(urlParams.chat_id || urlParams.timestamp) && (
          <Card className="max-w-2xl mx-auto p-4 mb-6 bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Информация пользователя:</h3>
            <div className="text-sm space-y-1">
              {urlParams.chat_id && <p>Chat ID: {urlParams.chat_id}</p>}
              {urlParams.timestamp && <p>Timestamp: {urlParams.timestamp}</p>}
            </div>
          </Card>
        )}
        
        <FileUploader onFileSelect={handleFileSelect} webhookUrl={WEBHOOK_URL} />
      </div>
    </div>
  );
};

export default Index;
