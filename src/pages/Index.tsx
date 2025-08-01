import FileUploader from '@/components/FileUploader';

const Index = () => {
  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
    // Здесь можно добавить логику для обработки выбранного файла
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
        
        <FileUploader onFileSelect={handleFileSelect} />
      </div>
    </div>
  );
};

export default Index;
