import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  webhookUrl: string;
}

const ALLOWED_EXTENSIONS = ['pdf', 'tiff', 'tif', 'jpeg', 'jpg', 'png'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/tiff', 
  'image/tif',
  'image/jpeg', 
  'image/jpg', 
  'image/png'
];
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, webhookUrl }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // Проверка расширения файла
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      toast({
        title: "Неподдерживаемый формат файла",
        description: `Разрешены только файлы: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`,
        variant: "destructive",
      });
      return false;
    }

    // Проверка MIME-типа
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast({
        title: "Неподдерживаемый тип файла",
        description: "Файл не соответствует допустимому MIME-типу",
        variant: "destructive",
      });
      return false;
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла: 200MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
      toast({
        title: "Файл загружен",
        description: `${file.name} готов к отправке`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !webhookUrl) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Симуляция прогресса загрузки
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);
    
    try {
      // Получаем URL параметры
      const urlParams = new URLSearchParams(window.location.search);
      const chatId = urlParams.get('chat_id');
      const timestamp = urlParams.get('timestamp');
      
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Добавляем параметры пользователя
      if (chatId) formData.append('chat_id', chatId);
      if (timestamp) formData.append('timestamp', timestamp);
      
      // Отправляем POST запрос на n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      
      // Завершаем прогресс
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.ok) {
        toast({
          title: "Файл успешно загружен",
          description: `${selectedFile.name} отправлен на обработку`,
        });
        
        // Сброс состояния после успешной загрузки
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 1000);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      console.error('Ошибка загрузки файла:', error);
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Попробуйте еще раз",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card
        className={`
          relative p-8 border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-upload-zone-hover scale-[1.02] shadow-lg' 
            : 'border-upload-zone-border bg-upload-zone hover:border-primary hover:bg-upload-zone-hover hover:scale-[1.01]'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.tiff,.tif,.jpeg,.jpg,.png"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`
              p-4 rounded-full transition-all duration-300
              ${isDragOver 
                ? 'bg-primary text-primary-foreground scale-110' 
                : 'bg-primary/10 text-primary'
              }
            `}>
              <Upload className="w-8 h-8" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isDragOver ? 'Отпустите файл здесь' : 'Перетащите файл сюда'}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            или <span className="text-primary font-medium">выберите файл</span> с компьютера
          </p>
          
          <p className="text-sm text-muted-foreground">
            Поддерживаемые форматы: PDF, TIFF, JPEG, PNG (до 200MB)
          </p>
        </div>
      </Card>

      {selectedFile && (
        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {selectedFile && (
        <div className="space-y-4">
          {isUploading && (
            <Card className="p-4 bg-card border border-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Загрузка файла...
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {selectedFile.name}
                </p>
              </div>
            </Card>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
            >
              {isUploading ? 'Загружаем...' : 'Отправить на проверку'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;