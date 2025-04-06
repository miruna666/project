'use client';

import React, { useEffect, useRef, useState, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SegmentImage {
  id: number;
  src: string;
}

interface WheelComponentProps {
  segments: SegmentImage[];
  size?: number;
  onFinished: (selected: SegmentImage) => void;
}

interface SpinParams {
  segmentsCount: number;
  maxSpeed: number;
  upTime: number;
  downTime: number;
}

const WheelComponent: FC<WheelComponentProps> = ({ segments, size = 290, onFinished }) => {
  const [internalSegments, setInternalSegments] = useState<SegmentImage[]>([...segments]);
  const [isFinished, setFinished] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<SegmentImage | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleCurrentRef = useRef<number>(0);
  const angleDeltaRef = useRef<number>(0);
  const spinStartRef = useRef<number>(0);
  const isStartedRef = useRef<boolean>(false);
  const spinParamsRef = useRef<SpinParams | null>(null);

  const imageCache = useRef<{ [id: number]: HTMLImageElement }>({});

  useEffect(() => {
    internalSegments.forEach(segment => {
      if (!imageCache.current[segment.id]) {
        const img = new Image();
        img.src = segment.src;
        img.onload = () => {
          wheelDraw();
        };
        imageCache.current[segment.id] = img;
      }
    });
    wheelDraw();
  }, [internalSegments]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const wheelDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clear();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (internalSegments.length === 0) return;

    const len = internalSegments.length;
    const PI2 = Math.PI * 2;
    let lastAngle = angleCurrentRef.current;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrentRef.current;
      drawSegment(ctx, internalSegments[i - 1], lastAngle, angle, centerX, centerY);
      lastAngle = angle;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.font = 'bold 2em Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Spin', centerX, centerY + 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    ctx.stroke();
  };

  const drawSegment = (
    ctx: CanvasRenderingContext2D,
    segment: SegmentImage,
    startAngle: number,
    endAngle: number,
    centerX: number,
    centerY: number
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, startAngle, endAngle, false);
    ctx.closePath();
    ctx.clip();

    const midAngle = (startAngle + endAngle) / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle);

    const cachedImage = imageCache.current[segment.id];
    if (cachedImage && cachedImage.complete) {
      ctx.drawImage(cachedImage, 0, -size, size, size * 2);
    }
    ctx.restore();
    ctx.restore();
  };

  const getSelectedIndex = (segmentsCount: number): number => {
    const normalizedAngle = (angleCurrentRef.current + Math.PI / 2) % (Math.PI * 2);
    const anglePerSegment = (Math.PI * 2) / segmentsCount;
    let index = Math.floor(segmentsCount - normalizedAngle / anglePerSegment) % segmentsCount;
    if (index < 0) index += segmentsCount;
    return index;
  };

  const animateSpin = () => {
    if (!spinParamsRef.current) return;
    const { segmentsCount, maxSpeed, upTime, downTime } = spinParamsRef.current;
    const duration = Date.now() - spinStartRef.current;
    let progress = 0;
    let finished = false;

    if (duration < upTime) {
      progress = duration / upTime;
      angleDeltaRef.current = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else if (duration < upTime + downTime) {
      progress = (duration - upTime) / downTime;
      angleDeltaRef.current = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
    } else {
      finished = true;
    }

    angleCurrentRef.current = (angleCurrentRef.current + angleDeltaRef.current) % (Math.PI * 2);
    draw();

    if (!finished) {
      requestAnimationFrame(animateSpin);
    } else {
      const idx = getSelectedIndex(segmentsCount);
      const selected = internalSegments[idx];
      setSelectedImage(selected);
      setShowModal(true);
      setFinished(true);
      onFinished(selected);
      isStartedRef.current = false;
    }
  };

  const spin = () => {
    if (isStartedRef.current || internalSegments.length === 0) return;
    isStartedRef.current = true;

    const segmentsCount = internalSegments.length;
    const maxSpeed = Math.PI / segmentsCount;
    const upTime = segmentsCount * 1000;
    const downTime = segmentsCount * 100;

    spinParamsRef.current = { segmentsCount, maxSpeed, upTime, downTime };
    spinStartRef.current = Date.now();

    requestAnimationFrame(animateSpin);
  };

  const closeModal = () => {
    if (selectedImage) {
      setInternalSegments(prev => prev.filter(seg => seg.id !== selectedImage.id));
    }
    setShowModal(false);
    setFinished(false);
    setSelectedImage(null);
    angleCurrentRef.current = 0;
    wheelDraw();
  };

  const draw = () => {
    clear();
    wheelDraw();
  };

  const handleRestart = () => {
    setInternalSegments([...segments]);
    setFinished(false);
    setSelectedImage(null);
    angleCurrentRef.current = 0;
    wheelDraw();
  };

  return (
    <div id="wheel" style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={size * 2}
        height={size * 2}
        onClick={spin}
        style={{ cursor: internalSegments.length === 0 ? 'default' : 'pointer' }}
      />

      {showModal && selectedImage && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
          }}
        >
          <img
            src={selectedImage.src}
            alt="Selected"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: 20,
              boxShadow: '0 0 40px rgba(255,255,255,0.4)',
              transform: 'scale(1.05)',
            }}
          />
        </div>
      )}

      <AnimatePresence>
        {internalSegments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                background: '#fff',
                padding: '40px 60px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              }}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
                Toate imaginile au fost extrase! 🐝
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#fff',
                  background: '#007bff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
              >
                Joacă din nou
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WheelComponent;
