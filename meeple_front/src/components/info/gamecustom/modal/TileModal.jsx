import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const TileModal = ({ onClose, cardId }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFD700');
  const [priceColor, setPriceColor] = useState('#FFFFFF');
  const [uploadedImage, setUploadedImage] = useState(null);
  const canvasRef = useRef(null);

  const addText = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
  
    // 이름 텍스트 (더 위로)
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px DungGeunMo';
    ctx.fillText(name, width / 2, height / 3 - 100);  // 위치 더 위로
    
    // 가격 텍스트 위치 조정
    ctx.font = 'bold 72px DungGeunMo';  
    ctx.fillStyle = priceColor;    
    ctx.fillText(price, width / 2 - 60, height / 3 - 20);  // 숫자 왼쪽으로
    
    ctx.font = 'bold 36px DungGeunMo';  
    ctx.fillStyle = 'white';       
    ctx.fillText('만마불', width / 2 + 80, height / 3 - 20);  // "만마불" 오른쪽으로
  };

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 400;
    const height = 600;

    // Canvas 초기화
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 상단 색상 영역
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height / 3);

    // 이미지가 있으면 그리기
    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, height / 3, width, (height / 3) * 2);
        addText();
      };
      img.src = uploadedImage;
    } else {
      addText();
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      generateImage();
    }
  }, [name, price, backgroundColor, priceColor, uploadedImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg w-11/12 max-w-4xl h-[80vh] p-6 relative">
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X size={24} />
      </button>
      
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">타일 {cardId} 커스터마이징</h2>

      <div className="grid grid-cols-2 gap-6 h-[calc(100%-100px)]">
        <div className="space-y-6 overflow-y-auto pr-4">
          {/* 상단 색상 선택 */}
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-white">상단 색상</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 이름 입력 */}
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <label className="block text-white mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none"
              placeholder="이름을 입력해주세요"
            />
          </div>

          {/* 가격 입력 */}
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <label className="block text-white mb-2">가격</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  const value = Math.min(60, parseInt(e.target.value) || 0);
                  setPrice(value);
                }}
                min="0"   
                max="60" 
                className="flex-1 p-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="최대 60"
              />
              <input
                type="color"
                value={priceColor}
                onChange={(e) => setPriceColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <label className="block text-white mb-2">타일 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 bg-slate-600 text-white rounded file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
            />
          </div>
        </div>

        <div className="h-full flex flex-col">
          <h3 className="text-lg text-white mb-2">미리보기</h3>
          <div className="flex-1 bg-slate-700/50 rounded-lg p-4 flex items-center justify-center">
            <canvas 
              ref={canvasRef}
              width="400"
              height="600"
              className="h-[400px] w-auto object-contain" 
            />
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={generateImage}
              className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
            >
              이미지 생성
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileModal;