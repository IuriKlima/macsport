export async function uploadToImgBB(file: File): Promise<string> {
  const API_KEY = 'a08cc6e0bf180575795f7e51689e6a26';
  
  try {
    // 1. Convert to WebP
    const webpFile = await convertToWebP(file);
    
    // 2. Upload to ImgBB
    const formData = new FormData();
    formData.append('image', webpFile);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Erro ao enviar imagem para ImgBB');
    }
  } catch (error) {
    console.error('ImgBB Upload Error:', error);
    throw error;
  }
}

async function convertToWebP(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Resize if too large (optional, but good for performance)
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1920;
        
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Failed to get canvas context'));
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Failed to convert image to WebP'));
          
          const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const newFile = new File([blob], newFileName, { type: 'image/webp' });
          resolve(newFile);
        }, 'image/webp', 0.8); // 80% quality
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
