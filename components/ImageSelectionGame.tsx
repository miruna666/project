'use client';

import React, { useState } from 'react';

interface ImageSelectionGameProps {
  correctImages: string[]; // căile pentru pozele corecte
  wrongImages: string[];   // căile pentru pozele greșite
}

interface ImageItem {
  src: string;
  isCorrect: boolean;
  id: string;
}

const ImageSelectionGame: React.FC<ImageSelectionGameProps> = ({ correctImages, wrongImages }) => {
  // Funcție helper pentru amestecarea aleatorie a array-ului
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const allImages: ImageItem[] = [
    ...correctImages.map((src, i) => ({ src, isCorrect: true, id: `correct-${i}` })),
    ...wrongImages.map((src, i) => ({ src, isCorrect: false, id: `wrong-${i}` })),
  ];

  const [shuffledImages, setShuffledImages] = useState<ImageItem[]>(shuffleArray(allImages));
  const [disabledImages, setDisabledImages] = useState<Set<string>>(new Set());
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  // Jocul se termină când toate imaginile corecte au fost selectate
  const isGameFinished = disabledImages.size === correctImages.length;

  const handleClick = (image: ImageItem) => {
    if (isGameFinished) return; // jocul s-a terminat, nu mai permit click
    if (image.isCorrect && disabledImages.has(image.id)) return; // nu permite re-selectarea imaginilor corecte

    const feedbackType = image.isCorrect ? 'correct' : 'wrong';
    setFeedbacks(prev => ({ ...prev, [image.id]: feedbackType }));

    if (image.isCorrect) {
      setDisabledImages(prev => new Set(prev).add(image.id));
    }
  };

  const handleRestart = () => {
    setDisabledImages(new Set());
    setFeedbacks({});
    setShuffledImages(shuffleArray(allImages));
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',

      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Titlu și descriere */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>Jocul de Selectare a Imaginilor</h1>
        <p style={{ marginTop: '10px', fontSize: '1.2rem', color: '#666' }}>
          Selectează toate imaginile corecte pentru a câștiga jocul!
        </p>
      </div>

      {/* Grid-ul cu 4 imagini pe rând */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '30px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {shuffledImages.map((image) => {
          const feedback = feedbacks[image.id];
          const isDisabled = disabledImages.has(image.id);
          let borderStyle = '2px solid #ddd';
          if (feedback === 'correct') {
            borderStyle = '5px solid #28a745';
          } else if (feedback === 'wrong') {
            borderStyle = '5px solid #dc3545';
          }
          return (
            <div
              key={image.id}
              onClick={() => handleClick(image)}
              style={{
                position: 'relative',
                cursor: isGameFinished || (image.isCorrect && isDisabled) ? 'not-allowed' : 'pointer',
                opacity: isGameFinished || (image.isCorrect && isDisabled) ? 0.6 : 1,
                border: borderStyle,
                borderRadius: '20px',
                padding: '10px',
            
                width: '240px',
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s, border 0.3s, opacity 0.3s',
                overflow: 'hidden'
              }}
            >
              <img
                src={image.src}
                alt="imagine"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: '16px',
                  transition: 'transform 0.3s'
                }}
              />
              {feedback && (
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: feedback === 'correct' ? 'rgba(40,167,69,0.9)' : 'rgba(220,53,69,0.9)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {feedback === 'correct' ? 'Corect! Bravo!' : 'Greșit! Încearcă din nou!'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overlay la finalul jocului */}
      {isGameFinished && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#fff',
            padding: '40px 60px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
              Felicitări! Ai selectat toate pozele corecte!
            </h2>
            <button
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
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              Joacă din nou
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelectionGame;
