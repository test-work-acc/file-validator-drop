import FileUploader from '@/components/FileUploader';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
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

        {/* Поле для ввода webhook URL */}
        <Card className="max-w-2xl mx-auto p-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">n8n Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Введите URL вашего n8n webhook для загрузки файлов
            </p>
          </div>
        </Card>
        
        <FileUploader onFileSelect={handleFileSelect} webhookUrl={webhookUrl} />
      </div>
    </div>
  );
};

export default Index;
